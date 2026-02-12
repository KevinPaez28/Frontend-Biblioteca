import "../../../../Components/Formulario/formulario.css";
import { patch } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import htmlCambiarPassword from "./index.html?raw";

/**
 * @description Abre un modal para permitir al usuario cambiar su contraseña.
 * @param {object} item - El objeto de usuario que contiene la información del usuario, incluyendo el ID del usuario.
 */
export const abrirModalCambiarPassword = (item) => {
    // Muestra el modal utilizando el contenido HTML proporcionado
    const modal = mostrarModal(htmlCambiarPassword);

    // Utiliza requestAnimationFrame para asegurar que el modal se renderice completamente antes de manipularlo
    requestAnimationFrame(() => {
        // Obtiene una referencia al formulario de cambio de contraseña dentro del modal
        const form = modal.querySelector("#formCambiarPassword");
        // Si el formulario no se encuentra, registra un error y sale
        if (!form) return console.error("Formulario no encontrado");

        // Obtiene referencias al botón de cerrar y a los campos de entrada dentro del formulario
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const inputActual = form.querySelector('input[name="current_password"]');
        const inputNueva = form.querySelector('input[name="newPassword"]');
        const inputConfirmar = form.querySelector('input[name="confirmPassword"]');

        // Almacena los campos de entrada en un array para facilitar la iteración
        const inputs = [inputActual, inputNueva, inputConfirmar];

        // ================= VALIDACIÓN VISUAL POR CAMPO =================
        // Adjunta event listeners de validación a cada campo de entrada
        inputs.forEach(campo => {
            campo.addEventListener("blur", () => {
                // Si el campo es el campo de contraseña actual, realiza la validación básica del campo
                if (campo.name === "current_password") {
                    validate.validarCampo({ target: campo });
                }
                // De lo contrario, realiza la validación específica de la contraseña
                else {
                    const valido = validate.validarPassword({ target: campo });
                    // Si la contraseña es válida, elimina la clase de error del elemento padre de la entrada
                    if (valido) {
                        campo.closest(".form__grupo").classList.remove("error");
                    }
                }
            });
        });

        // ================= BOTÓN CERRAR =================
        // Agrega un event listener al botón de cerrar para cerrar el modal
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ================= SUBMIT =================
        // Bandera para evitar el envío múltiple del formulario
        let enviando = false;
        // Maneja el evento de envío del formulario
        form.onsubmit = async (event) => {
            // Previene el comportamiento de envío del formulario por defecto
            event.preventDefault();
            // Si el formulario ya está siendo enviado, previene otro envío
            if (enviando) return;

            // Valida todos los campos del formulario
            if (!validate.validarCampos(e)) {
                return;
            }
            // Muestra un mensaje de carga
            loading("Actualizando contraseña...");
            // Cierra el modal
            cerrarModal(modal);
            // Establece 'enviando' en true para evitar el envío múltiple
            enviando = true;

            // Crea un objeto de carga útil con los datos de la contraseña
            const payload = {
                current_password: inputActual.value,
                new_password: inputNueva.value,
                new_password_confirmation: inputConfirmar.value,

            };

            try {
                // Envía una solicitud PATCH para actualizar la contraseña
                const response = await patch(`user/newpassword/${item.id}`, payload);

                // Si la respuesta no es exitosa
                if (!response || !response.success) {
                    cerrarModal(modal);
                    // Muestra cualquier error
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al cambiar la contraseña");
                    }
                    return;
                }

                // Si la actualización es exitosa, muestra un mensaje de éxito
                success(response.message || "Contraseña actualizada correctamente");
                form.reset();
                cerrarModal(modal);

            } catch (err) {
                // Maneja cualquier error que ocurra durante el proceso de actualización
                console.error(err);
                error("Ocurrió un error inesperado");
            } finally {
                // Restablece 'enviando' a false para permitir envíos futuros
                enviando = false;
            }
        };
    });
};
