import "../../../Components/Formulario/formulario.css";
import { post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error } from "../../../Helpers/alertas";

/**
 * @async
 * @function
 * @description Este módulo se encarga de la lógica para verificar un código enviado al correo del usuario.
 *  Selecciona el formulario, valida los campos, y realiza la petición al backend para verificar el código.
 */
export default async () => {
    // Seleccionamos el formulario correctamente por ID
    const form = document.querySelector("#formulario_verifyCode");
    if (!form) return console.error("Formulario no encontrado");

    // Todos los inputs del formulario
    const campos = form.querySelectorAll("input");

    // Elemento donde mostramos info del correo
    const textoInfo = document.querySelector(".form__descripcion");

    // Obtenemos el correo previamente guardado
    const correoOculto = localStorage.getItem("email_reset");

    textoInfo.textContent = correoOculto
        ? `Se ha enviado un código al correo ${correoOculto}`
        : "Ingrese su documento para continuar.";

    // Configurar validación de campos
    campos.forEach(campo => {
        if (campo.id === "code") {
            campo.addEventListener("blur", e => {
                validate.validarCampo(e);
                validate.validarNumeros(e); // si solo son números
            });
        }
    });

    // Evitamos envío múltiple
    let enviando = false;

    // Manejador del evento submit del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (enviando) return; // si ya se está enviando, no hacemos nada

        if (!validate.validarCampos(e, "email-verify")) {
            return;
        }

        const data = { token: String(validate.datos.code) };
        localStorage.setItem("reset_token", validate.datos.code);

        try {
            enviando = true; // bloqueamos nuevos envíos
            const response = await post('validate', data);

            if (!response || !response.success) {
                if (response.errors && response.errors.length > 0) {
                    response.errors.forEach(err => error(err)); // Mostrar todos los errores
                } else {
                    error(response.message || "Error enviando el código");
                }
                return;
            }

            success(response.message || "Código enviado al correo correctamente");
            form.reset();
            window.location.hash = `#/ResetPassword`;

        } catch (err) {
            console.error(err);
            error("Ocurrió un error inesperado");
        } finally {
            enviando = false; // desbloqueamos
        }
    });
};
