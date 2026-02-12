import "../../../../Components/Formulario/formulario.css";
import { patch } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import htmlCambiarPassword from "./index.html?raw";

/**
 * @description Opens a modal to allow the user to change their password.
 * @param {object} item - The user object containing user information, including the user ID.
 */
export const abrirModalCambiarPassword = (item) => {
    // Display the modal using the provided HTML content
    const modal = mostrarModal(htmlCambiarPassword);

    // Use requestAnimationFrame to ensure the modal is fully rendered before manipulating it
    requestAnimationFrame(() => {
        // Get a reference to the password change form within the modal
        const form = modal.querySelector("#formCambiarPassword");
        // If the form is not found, log an error and exit
        if (!form) return console.error("Formulario no encontrado");

        // Get references to the close button and input fields within the form
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const inputActual = form.querySelector('input[name="current_password"]');
        const inputNueva = form.querySelector('input[name="newPassword"]');
        const inputConfirmar = form.querySelector('input[name="confirmPassword"]');

        // Store the input fields in an array for easier iteration
        const inputs = [inputActual, inputNueva, inputConfirmar];

        // ================= VALIDACIÓN VISUAL POR CAMPO =================
        // Attach validation event listeners to each input field
        inputs.forEach(campo => {
            campo.addEventListener("blur", () => {
                // If the field is the current password field, perform basic field validation
                if (campo.name === "current_password") {
                    validate.validarCampo({ target: campo });
                }
                // Otherwise, perform password-specific validation
                else {
                    const valido = validate.validarPassword({ target: campo });
                    // If the password is valid, remove the error class from the input's parent element
                    if (valido) {
                        campo.closest(".form__grupo").classList.remove("error");
                    }
                }
            });
        });

        // ================= BOTÓN CERRAR =================
        // Add an event listener to the close button to close the modal
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ================= SUBMIT =================
        // Flag to prevent multiple form submissions
        let enviando = false;
        // Handle the form submission event
        form.onsubmit = async (event) => {
            // Prevent the default form submission behavior
            event.preventDefault();
            // If the form is already submitting, prevent another submission
            if (enviando) return;

            // Validate all form fields
            if (!validate.validarCampos(e)) {
                return;
            }
            // Display a loading message
            loading("Actualizando contraseña...");
            // Close the modal
            cerrarModal(modal);
            // Set 'enviando' to true to prevent multiple submissions
            enviando = true;

            // Create a payload object with the password data
            const payload = {
                current_password: inputActual.value,
                new_password: inputNueva.value,
                new_password_confirmation: inputConfirmar.value,

            };

            try {
                // Send a PATCH request to update the password
                const response = await patch(`user/newpassword/${item.id}`, payload);

                // If the response is not successful
                if (!response || !response.success) {
                    cerrarModal(modal);
                    // Display any errors
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al cambiar la contraseña");
                    }
                    return;
                }

                // If the update is successful, display a success message
                success(response.message || "Contraseña actualizada correctamente");
                form.reset();
                cerrarModal(modal);

            } catch (err) {
                // Handle any errors that occur during the update process
                console.error(err);
                error("Ocurrió un error inesperado");
            } finally {
                // Reset 'enviando' to false to allow future submissions
                enviando = false;
            }
        };
    });
};
