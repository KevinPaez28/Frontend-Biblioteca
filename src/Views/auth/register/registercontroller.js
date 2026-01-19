import "../../../Components/Formulario/formulario.css"

import { get, post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error } from "../../../Helpers/alertas";

export default async () => {
    // ================= OBTENER ELEMENTOS DEL DOM =================
    // Obtenemos el formulario principal
    const form = document.querySelector("#formulario_register");
    // Obtenemos los selects por clase
    const selectRol = document.querySelector(".rol");
    const selectFicha = document.querySelector(".ficha");
    const selectPrograma = document.querySelector(".programa");

    // ================= CARGAR DATOS DESDE API =================
    // Traemos los roles, fichas y programas desde la API
    const fichas = await get("ficha");
    const programas = await get("programa");
    const roles = await get("roles");

    // ================= RELLENAR SELECTS =================
    // Rellenamos select de roles
    roles.data.forEach(r => {
        const op = document.createElement("option");
        op.value = r.id;
        op.textContent = r.name;
        selectRol.append(op);
    });

    // Rellenamos select de fichas
    fichas.data.forEach(f => {
        const op = document.createElement("option");
        op.value = f.id;
        op.textContent = f.ficha;
        selectFicha.append(op);
    });

    // Rellenamos select de programas
    programas.data.forEach(p => {
        const op = document.createElement("option");
        op.value = p.id;
        op.textContent = p.training_program;
        selectPrograma.append(op);
    });

    // ================= EVENTO CAMBIO DE ROL =================
    // Escuchamos cuando cambia el select de rol
    selectRol.addEventListener("change", () => {
        const aprendiz = roles.data.find(r => r.name.toLowerCase() === "aprendiz");

        // Roles que deben mostrar correo y contraseña
        const adminOrHelpers = roles.data.filter(r => {
            const nombre = r.name.toLowerCase();
            return nombre === "administrador" || nombre === "ayudante";
        });

        const clase = document.querySelectorAll(".form__grupo.activo"); // ficha y programa
        const passwordGroup = document.querySelector(".form__grupo.password"); // correo y contraseña

        const selectedId = parseInt(selectRol.value); // asegúrate de comparar números

        if (selectedId === aprendiz.id) {
            // Aprendiz: mostrar ficha y programa
            clase.forEach(g => g.classList.remove("oculto"));
            passwordGroup.classList.add("oculto");
            passwordGroup.querySelector("input").value = "";
        }
        else if (adminOrHelpers.some(r => r.id === selectedId)) {
            // Administrador o Ayudante: mostrar correo y contraseña
            passwordGroup.classList.remove("oculto");
            clase.forEach(g => g.classList.add("oculto"));
            selectFicha.value = "";
            selectPrograma.value = "";
        }
        else {
            // Otros roles: ocultar todo
            clase.forEach(g => g.classList.add("oculto"));
            passwordGroup.classList.add("oculto");
            selectFicha.value = "";
            selectPrograma.value = "";
            passwordGroup.querySelector("input").value = "";
        }
    });




    // ================= VALIDACIONES DE CAMPOS =================
    // Tomamos todos los inputs y selects del formulario
    const campos = form.querySelectorAll("input, select");

    // Recorremos cada campo para agregar sus validaciones
    campos.forEach(campo => {

        // ================= NUMEROS: DOCUMENTO Y TELEFONO =================
        if (campo.id === "documento" || campo.id === "telefono") {
            // Validar solo números y longitud máxima mientras se escribe
            campo.addEventListener("keydown", e => {
                validate.validarNumeros(e);
                validate.validarMaximo(e, campo.maxLength);
            });
            // Validar longitud mínima y campo requerido al perder el foco
            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength);
                validate.validarCampo(e);
            });
            return; // Salimos del forEach para no aplicar otras validaciones
        }

        // ================= TEXTOS =================
        if (campo.type === "text") {
            // Validar solo letras y longitud máxima mientras se escribe
            campo.addEventListener("keydown", e => {
                validate.validarTexto(e);
                validate.validarMaximo(e, campo.maxLength || 50);
            });
            // Validar longitud mínima y campo requerido al perder el foco
            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength || 3);
                validate.validarCampo(e);
            });
        }

        // ================= CORREO =================
        if (campo.type === "email") {
            // Validar formato de correo al perder el foco
            campo.addEventListener("blur", validate.validarCorreo);
        }

        // ================= CONTRASEÑA =================
        if (campo.type === "password") {
            // Validar reglas de contraseña solo si el campo NO está oculto
            campo.addEventListener("blur", e => {
                if (!campo.closest(".form__grupo").classList.contains("oculto")) {
                    validate.validarPassword(e);
                } else {
                    // Quitar error si estaba presente antes
                    validate.quitarError(campo.closest(".form__grupo"));
                }
            });
        }

    });

    // ================= SUBMIT DEL FORMULARIO =================
    let enviando = false;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (enviando) return; // evita doble envío

        if (!validate.validarCampos(event)) return;

        const data = { ...validate.datos };
        enviando = true; // bloqueamos mientras se procesa

        const response = await post("user/create", data);

        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al crear el usuario");
            }
            enviando = false; // desbloqueamos si hay error
            return;
        }

        success(response.message || "Usuario creado exitosamente");
        form.reset();
        enviando = false; // desbloqueamos al terminar
    });


};
