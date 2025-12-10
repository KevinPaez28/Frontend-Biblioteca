import "../../Styles/Formulario/Formulario.css"

import { get, post } from "../../Helpers/api";
import * as validate from "../../Helpers/Modules/modules"; // validaciones
import { success, error } from "../../Helpers/alertas";

export default async () => {

    // ================= OBTENER ELEMENTOS DEL DOM =================
    const form = document.querySelector(".form__form");

    const campos = form.querySelectorAll("input");

    campos.forEach(campo => {
        if (campo.id === "documento") {
            // Validar solo números y longitud máxima mientras se escribe
            campo.addEventListener("keydown", e => {
                validate.validarNumeros(e);
                validate.validarMaximo(e, campo.maxLength || 10);
            });
            // Validar longitud mínima y campo requerido al perder el foco
            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength || 6);
                validate.validarCampo(e);
            });
            return; // Salimos del forEach para no aplicar otras validaciones
        }
    });

    // ================= SUBMIT DEL FORMULARIO =================
    form.addEventListener("submit", async e => {
        e.preventDefault();

        if (!validate.validarCampos(e)) return;

        // Obtenemos los datos validados
        const data = { ...validate.datos };
        console.log(data);

        const response = await post("login", data);

        if (!response.success) {
            if (response.errors) response.errors.forEach(err => error(err));
            else error(response.message || "Error al iniciar sesión");
            return;
        }

        success(response.message)
        form.reset();
    });
};
