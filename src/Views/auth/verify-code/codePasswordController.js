import "../../../Components/Formulario/formulario.css";
import { post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error } from "../../../Helpers/alertas";

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

    // Validación de los inputs mientras se escribe o pierde foco
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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (enviando) return; // si ya se está enviando, no hacemos nada

        if (!validate.validarCampos(e, "email-verify")) {
            console.log("Campos inválidos");
            return;
        }

        const data = { token: String(validate.datos.code) };
        localStorage.setItem("reset_token", validate.datos.code);

        try {
            enviando = true; // bloqueamos nuevos envíos
            const response = await post('validate', data);

            if (!response || !response.success) {
                if (response.errors && response.errors.length > 0) {
                    response.errors.forEach(err => error(err));
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
