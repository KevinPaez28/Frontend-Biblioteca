import "../../../Components/Formulario/formulario.css"
import { post } from "../../../Helpers/api"; 
import * as validate from "../../../Helpers/Modules/modules"; 
import { success, error } from "../../../Helpers/alertas";

export default async () => {
    const form = document.querySelector("#formulario_resetPassword");
    const campos = form.querySelectorAll("input");

    // Campo de información
    const textoInfo = document.querySelector(".form__descripcion");

    // Tomamos email y token del localStorage
    const resetToken = localStorage.getItem("reset_token");

    campos.forEach(campo => {
        // Validaciones de los campos de contraseña
        if (campo.id === "newPassword" || campo.id === "confirmPassword") {
            campo.addEventListener("blur", e => {
                validate.validarCampo(e);
            });
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validación general de todos los campos
        if (!validate.validarCampos(e, "reset-password")) {
            console.log("Campos inválidos");
            return;
        }



        // Preparamos el objeto para enviar al backend
        const data = {
            token: resetToken,            // token del localStorage
            password: validate.datos.newPassword,
            password_confirmation:validate.datos.confirmPassword,
        };

        console.log("Datos a enviar:", data);

        // POST al endpoint de cambio de contraseña
        const response = await post('Reset-password/change', data);

        // Manejo de errores
        if (!response.success || (response.errors && response.errors.length > 0)) {
            if (response.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response.message || "Error al cambiar la contraseña");
            }
            return;
        }

        // Éxito
        success(response.message || "Contraseña cambiada correctamente");
        form.reset();

        // Limpiamos el token del storage por seguridad
        localStorage.removeItem("reset_token");

        
        // Redirigimos al login
        window.location.hash = "#/Login";
    });
};
