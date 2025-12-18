import "../../../Components/Formulario/formulario.css"
import { post } from "../../../Helpers/api"; 
import * as validate from "../../../Helpers/Modules/modules"; 
import { success, error } from "../../../Helpers/alertas";

export default async () => {
    const form = document.querySelector("formulario_verifyCode");
    const campos = form.querySelectorAll("input");

    const textoInfo = document.querySelector(".form__descripcion");

    const correoOculto = localStorage.getItem("email_reset");

    if (correoOculto) {
        textoInfo.textContent = `Se ha enviado un código al correo ${correoOculto}`;
    } else {
        textoInfo.textContent = "Ingrese su documento para continuar.";
    }

    campos.forEach(campo => {

        // Validación específica para el campo email
        if (campo.id === "email") {

            // Validar email mientras escribe
            campo.addEventListener("blur", e => {
                validate.validarEmail(e); // si ya tienes esto en tus módulos
                validate.validarCampo(e);
            });
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validación general de todos los campos
        if (!validate.validarCampos(e, "email-verify")) {
            console.log("Campos inválidos");
            return;
        }

        const data = {
            token: String(validate.datos.code)
        };

        localStorage.setItem("reset_token", validate.datos.code);

        console.log("Datos a enviar:", data);

        // POST al endpoint que envía el código
        const response = await post('validate', data);

        // Manejo de errores e
        if (!response.ok || (response.errors && response.errors.length > 0)) {

            if (response.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response.message || "Error enviando el código");
            }

            return; // no mostrar ok
        }

        // ÉXITO
        success(response.message || "Código enviado al correo correctamente");
        form.reset();

        window.location.hash = `#/ResetPassword`
    });
};
