import "../../../components/formulario/formulario.css"
import { get, post } from "../../../helpers/api.js";
import * as validate from "../../../helpers/modules/modules.js";
import { success, error, loading } from "../../../helpers/alertas.js";

export default async () => {

    const form = document.querySelector("#formulario_register");
    if (!form) return;

    const selectRol = form.querySelector(".rol");
    const selectFicha = form.querySelector(".ficha");
    const selectPrograma = form.querySelector(".programa");
    const Tdocumento = form.querySelector(".Tdocumento");

    let enviando = false;

    // ================= SUBMIT =================
    form.onsubmit = async (event) => {
        event.preventDefault();

        if (enviando) return;
        if (!validate.validarCampos(event)) return;

        loading("Registrando usuario");
        enviando = true;

        const token = await grecaptcha.execute(
            "6Lc2YmksAAAAAJ_KMFarZmicnTEqWt1wdi-Q6xAf",
            { action: "registrar" }
        );

        const data = {
            ...validate.datos,
            recaptcha_token: token
        };

        const response = await post("user/create", data);

        if (!response || !response.success) {
            if (response?.errors?.length) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al crear usuario");
            }
            enviando = false;
            return;
        }

        success(response.message || "Usuario creado exitosamente");
        form.reset();

        // 👇 limpiar programa después de reset
        selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
        selectPrograma.disabled = true;

        enviando = false;
    };

    // ================= CARGA DE DATOS =================

    const fichas = await get("ficha");
    const roles = await get("roles/select");
    const tipo = await get("Tipo_documento");

    // Roles
    roles.data.forEach(r => {
        const op = document.createElement("option");
        op.value = r.id;
        op.textContent = r.name;
        selectRol.append(op);
    });

    // Tipo documento
    tipo.data.forEach(r => {
        const op = document.createElement("option");
        op.value = r.id;
        op.textContent = r.name;
        Tdocumento.append(op);
    });

    // ================= FICHAS (CON PROGRAMA) =================
    fichas.data.forEach(f => {
        const op = document.createElement("option");
        op.value = f.id;
        op.textContent = f.ficha;

        // 👇 guardamos programa
        op.dataset.programaId = f.programa?.id || "";
        op.dataset.programaNombre = f.programa?.training_program || "";

        selectFicha.append(op);
    });

    // ================= FICHA → PROGRAMA =================
    selectFicha.addEventListener("change", () => {

        selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
        selectPrograma.disabled = true;

        if (!selectFicha.value) return;

        const selected = selectFicha.selectedOptions[0];

        const programaId = selected.dataset.programaId;
        const programaNombre = selected.dataset.programaNombre;

        if (!programaId) return;

        const op = document.createElement("option");
        op.value = programaId;
        op.textContent = programaNombre;

        selectPrograma.append(op);
        selectPrograma.value = programaId;
        selectPrograma.disabled = false;
    });

    // ================= ROLES =================
    selectRol.addEventListener("change", () => {

        const aprendiz = roles.data.find(r => r.name.toLowerCase() === "aprendiz");

        const adminOrhelpers = roles.data.filter(r => {
            const n = r.name.toLowerCase();
            return n === "administrador" || n === "apoyo";
        });

        const gruposActivos = form.querySelectorAll(".form__grupo.activo");
        const passwordGroup = form.querySelector(".form__grupo.password");

        const selectedId = parseInt(selectRol.value);

        if (aprendiz && selectedId === aprendiz.id) {
            gruposActivos.forEach(g => g.classList.remove("oculto"));
            passwordGroup.classList.add("oculto");
            passwordGroup.querySelector("input").value = "";
        }
        else if (adminOrhelpers.some(r => r.id === selectedId)) {
            passwordGroup.classList.remove("oculto");
            gruposActivos.forEach(g => g.classList.add("oculto"));
            selectFicha.value = "";
            selectPrograma.value = "";
        }
        else {
            gruposActivos.forEach(g => g.classList.add("oculto"));
            passwordGroup.classList.add("oculto");
            selectFicha.value = "";
            selectPrograma.value = "";
            passwordGroup.querySelector("input").value = "";
        }
    });

    // ================= VALIDACIONES =================
    const campos = form.querySelectorAll("input, select");

    campos.forEach(campo => {

        if (campo.id === "documento" || campo.id === "telefono") {

            campo.addEventListener("keydown", e => {
                validate.validarNumeros(e);
                validate.validarMaximo(e, campo.maxLength);
            });

            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength);
                validate.validarCampo(e);
            });

            return;
        }

        if (campo.type === "text") {
            campo.addEventListener("keydown", e => {
                validate.validarTexto(e);
                validate.validarMaximo(e, campo.maxLength || 50);
            });

            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength || 3);
                validate.validarCampo(e);
            });
        }

        if (campo.type === "email") {
            campo.addEventListener("blur", validate.validarCorreo);
        }

        if (campo.type === "password") {
            campo.addEventListener("blur", e => {
                if (!campo.closest(".form__grupo").classList.contains("oculto")) {
                    validate.validarPassword(e);
                } else {
                    validate.quitarError(campo.closest(".form__grupo"));
                }
            });
        }
    });

};