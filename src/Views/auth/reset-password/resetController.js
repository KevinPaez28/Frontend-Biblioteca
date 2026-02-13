import "../../../Components/Formulario/formulario.css";
import { post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error } from "../../../Helpers/alertas";

/**
 * @description Función asíncrona para manejar el formulario de restablecimiento de contraseña.
 */
export default async () => {
    // Obtener el formulario de restablecimiento de contraseña
    const form = document.querySelector("#formulario_resetPassword");
    // Si el formulario no se encuentra, registra un error en la consola y sale de la función
    if (!form) return console.error("Formulario no encontrado");

    // Obtener todos los campos de entrada del formulario
    const campos = form.querySelectorAll("input");

    // Campo de información (no utilizado en el código proporcionado, pero se mantiene la referencia)
    const textoInfo = document.querySelector(".form__descripcion");

    // Tomamos el token de restablecimiento del localStorage
    const resetToken = localStorage.getItem("reset_token");

    // Agregar un event listener a cada campo de contraseña para realizar la validación cuando pierden el foco
    campos.forEach(campo => {
        // Verificar si el campo es 'newPassword' o 'confirmPassword'
        if (campo.id === "newPassword" || campo.id === "confirmPassword") {
            // Agregar un event listener al evento 'blur' para realizar la validación
            campo.addEventListener("blur", e => {
                validate.validarCampo(e);
            });
        }
    });

    // Bandera para evitar envíos dobles del formulario
    let enviando = false;

    // Manejador del evento 'submit' del formulario
    form.onsubmit = async (event) => {
        // Prevenir el comportamiento predeterminado del formulario (recargar la página)
        event.preventDefault();
        // Si ya se está enviando el formulario, no hacer nada
        if (enviando) return;

        // Validar todos los campos del formulario utilizando la función 'validarCampos' del módulo 'validate'
        if (!validate.validarCampos(event, "reset-password")) {
            return;
        }

        // Crear un objeto 'data' con el token de restablecimiento, la nueva contraseña y la confirmación de la contraseña
        const data = {
            token: resetToken,
            password: validate.datos.newPassword,
            password_confirmation: validate.datos.confirmPassword,
        };

        // Establecer la bandera 'enviando' a 'true' para bloquear nuevos envíos
        enviando = true;

        try {
            // Enviar una petición POST al backend para cambiar la contraseña
            const response = await post('Reset-password/change', data);

            // Si la respuesta no es exitosa
            if (!response || !response.success) {
                // Si la respuesta contiene una lista de errores, mostrar cada error
                if (response.errors && response.errors.length > 0) {
                    response.errors.forEach(err => error(err));
                }
                // Si no, mostrar un mensaje de error genérico
                else {
                    error(response.message || "Error al cambiar la contraseña");
                }
                // Desbloquear el formulario para permitir nuevos envíos
                enviando = false;
                return;
            }

            // Si la respuesta es exitosa, mostrar un mensaje de éxito
            success(response.message || "Contraseña cambiada correctamente");
            // Limpiar el formulario
            form.reset();
            // Eliminar el token de restablecimiento del almacenamiento local
            localStorage.removeItem("reset_token");
            // Redirigir al usuario a la página de inicio de sesión
            window.location.hash = "#/Login";

        } catch (err) {
            // Si ocurre un error inesperado, registrar el error en la consola y mostrar un mensaje de error
            console.error(err);
            error("Ocurrió un error inesperado");
            // Desbloquear el formulario en caso de error
            enviando = false;
        }
    };
};
