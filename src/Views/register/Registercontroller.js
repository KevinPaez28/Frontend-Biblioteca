import "../../Styles/Formulario/Formulario.css"

import { get, post } from "../../Helpers/api";
import * as validate from "../../Helpers/Modules/modules"; // validaciones
import { success, error } from "../../Helpers/alertas";

export default async () => {
    // ================= OBTENER ELEMENTOS DEL DOM =================
    // Obtenemos el formulario principal
    const form = document.querySelector(".form__form");
    // Obtenemos los selects por clase
    const selectRol = document.querySelector(".rol");
    const selectFicha = document.querySelector(".ficha");
    const selectPrograma = document.querySelector(".programa");

    // ================= CARGAR DATOS DESDE API =================
    // Traemos los roles, fichas y programas desde la API
    const roles = await get("roles");
    const fichas = await get("ficha");
    const programas = await get("programa");

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
        // Buscamos el rol aprendiz en la lista de roles
        const aprendiz = roles.data.find(r => r.name.toLowerCase() === "aprendiz");
        // Seleccionamos los grupos del formulario que tengan la clase activo
        const clase = document.querySelectorAll(".form__grupo.activo");

        // Si el rol seleccionado es aprendiz
        if (selectRol.value == aprendiz.id) {
            // Removemos la clase oculto para mostrar los campos
            clase.forEach(g => g.classList.remove("oculto"));
        } else {
            // Si no es aprendiz, ocultamos los campos
            clase.forEach(g => g.classList.add("oculto"));
            // Limpiamos los selects dependientes
            selectFicha.value = "";
            selectPrograma.value = "";
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
            // Validar reglas de contraseña al perder el foco
            campo.addEventListener("blur", validate.validarPassword);
        }
    });

    // ================= SUBMIT DEL FORMULARIO =================
    form.addEventListener("submit", async e => {
        e.preventDefault(); // Evitamos el envío por defecto

        // Validaciones generales antes de enviar
        if (!validate.validarCampos(e)) {
            console.log("mal");
            
            return;
        }

        // Obtenemos los datos validados
        const data = { ...validate.datos };
        console.log(data);

        // Enviamos datos a la API
        const response = await post("user/create", data);

        // ================= MANEJO DE RESPUESTAS =================
        if (!response.success) {
            // Si hay errores, mostramos cada uno
            if (response.errors) response.errors.forEach(err => error(err));
            // Si solo hay mensaje general
            else error(response.message || "Error al registrar");
            return;
        }

        // Si todo sale bien
        success(response.message || "Registrado correctamente");
        form.reset(); // Limpiamos el formulario
    });
};
