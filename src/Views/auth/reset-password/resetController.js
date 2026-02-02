import "../../../Components/Formulario/formulario.css";
import { post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error } from "../../../Helpers/alertas";

export default async () => {
    const form = document.querySelector("#formulario_resetPassword");
    if (!form) return console.error("Formulario no encontrado");

    const campos = form.querySelectorAll("input");

    // Campo de información
    const textoInfo = document.querySelector(".form__descripcion");

    // Tomamos email y token del localStorage
    const resetToken = localStorage.getItem("reset_token");

    campos.forEach(campo => {
        if (campo.id === "newPassword" || campo.id === "confirmPassword") {
            campo.addEventListener("blur", e => {
                validate.validarCampo(e);
            });
        }
    });

    // Bandera para evitar envíos dobles
    let enviando = false;

  form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (enviando) return; // si ya se está enviando, no hacemos nada

        if (!validate.validarCampos(e, "reset-password")) {
            return;
        }

        const data = {
            token: resetToken,
            password: validate.datos.newPassword,
            password_confirmation: validate.datos.confirmPassword,
        };


        enviando = true; // bloqueamos nuevos envíos

        try {
            const response = await post('Reset-password/change', data);

            if (!response || !response.success) {
                if (response.errors && response.errors.length > 0) {
                    response.errors.forEach(err => error(err));
                } else {
                    error(response.message || "Error al cambiar la contraseña");
                }
                enviando = false; // desbloqueamos aquí
                return;
            }

            success(response.message || "Contraseña cambiada correctamente");
            form.reset();
            localStorage.removeItem("reset_token");
            window.location.hash = "#/Login";

        } catch (err) {
            console.error(err);
            error("Ocurrió un error inesperado");
            enviando = false; // desbloqueamos si hay error
        }
    });
};
