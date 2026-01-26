import "../../../Components/Formulario/formulario.css"
import { get, post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";

import { success, error, loading } from "../../../Helpers/alertas";


export default async () => {

    // Obtener el formulario de registro
    const form = document.querySelector("#formulario_register");
    if (!form) return; // Si no existe, no ejecuta nada

    // Selects del formulario
    const selectRol = form.querySelector(".rol");
    const selectFicha = form.querySelector(".ficha");
    const selectPrograma = form.querySelector(".programa");

    // Bandera para evitar múltiples envíos seguidos
    let enviando = false;


    // ================= EVENTO SUBMIT DEL FORMULARIO =================
    form.addEventListener("submit", async (e) => {

        // Evita que la página se recargue
        e.preventDefault();

        // Si ya se está enviando, no deja volver a enviar
        if (enviando) return;

        // Ejecuta validaciones generales
        if (!validate.validarCampos(e)) return;

        // Muestra alerta de carga
        loading("Registrando usuario");

        // Activa bloqueo de envío
        enviando = true;

        // Copia los datos validados
        const data = { ...validate.datos };

        // Petición al backend
        const response = await post("user/create", data);


        // ================= MANEJO DE ERRORES =================
        if (!response || !response.success) {

            // Si el backend envía lista de errores
            if (response?.errors?.length) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al crear usuario");
            }

            // Libera el formulario para volver a intentar
            enviando = false;
            return;
        }


        // ================= REGISTRO EXITOSO =================

        // Cierra el loading (ESTO ES LO QUE FALTABA)
        success(response.message || "Usuario creado exitosamente");

        // Limpia formulario
        form.reset();

        // Permite volver a enviar después
        enviando = false;
    });



    // ================= CARGA DE DATOS DESDE API =================

    // Trae fichas, programas y roles al mismo tiempo
    
    const fichas= get("ficha"); 
    const programas= get("programa");
    const roles=get("roles");

    
    // Llena select de roles
    roles.data.forEach(r => {
        const op = document.createElement("option");
        op.value = r.id;
        op.textContent = r.name;
        selectRol.append(op);
    });

    // Llena select de fichas
    fichas.data.forEach(f => {
        const op = document.createElement("option");
        op.value = f.id;
        op.textContent = f.ficha;
        selectFicha.append(op);
    });

    // Llena select de programas
    programas.data.forEach(p => {
        const op = document.createElement("option");
        op.value = p.id;
        op.textContent = p.training_program;
        selectPrograma.append(op);
    });



    // ================= MOSTRAR / OCULTAR CAMPOS SEGÚN ROL =================
    selectRol.addEventListener("change", () => {

        // Buscar rol aprendiz
        const aprendiz = roles.data.find(r => r.name.toLowerCase() === "aprendiz");

        // Buscar roles administrador y ayudante
        const adminOrHelpers = roles.data.filter(r => {
            const n = r.name.toLowerCase();
            return n === "administrador" || n === "ayudante";
        });

        // Grupos que dependen de ficha/programa
        const gruposActivos = form.querySelectorAll(".form__grupo.activo");

        // Grupo de contraseña
        const passwordGroup = form.querySelector(".form__grupo.password");

        const selectedId = parseInt(selectRol.value);

        // Si es aprendiz
        if (aprendiz && selectedId === aprendiz.id) {
            gruposActivos.forEach(g => g.classList.remove("oculto"));
            passwordGroup.classList.add("oculto");
            passwordGroup.querySelector("input").value = "";
        }
        // Si es administrador o ayudante
        else if (adminOrHelpers.some(r => r.id === selectedId)) {
            passwordGroup.classList.remove("oculto");
            gruposActivos.forEach(g => g.classList.add("oculto"));
            selectFicha.value = "";
            selectPrograma.value = "";
        }
        // Cualquier otro rol
        else {
            gruposActivos.forEach(g => g.classList.add("oculto"));
            passwordGroup.classList.add("oculto");
            selectFicha.value = "";
            selectPrograma.value = "";
            passwordGroup.querySelector("input").value = "";
        }
    });



    // ================= VALIDACIONES POR CAMPO =================
    const campos = form.querySelectorAll("input, select");

    campos.forEach(campo => {

        // Validación para documento y teléfono (solo números)
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

        // Campos de texto normal
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

        // Validación de correo
        if (campo.type === "email") {
            campo.addEventListener("blur", validate.validarCorreo);
        }

        // Validación de contraseña solo si está visible
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
