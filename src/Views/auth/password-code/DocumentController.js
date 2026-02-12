import "../../../Components/Formulario/formulario.css"
import { post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error } from "../../../Helpers/alertas";

/**
 * @description This function sets up the password recovery form, handles input validation,
 *              and submits the form to request a password reset code.
 */
export default async () => {
    // Get the form element from the DOM using its ID
    const form = document.querySelector("#formulario_passwordCode");
    // Get all input elements within the form
    const campos = form.querySelectorAll("input");

    // Loop through each input field to attach specific validation rules
    campos.forEach(campo => {
        // Check if the current input field is the 'documento' (document number) field
        if (campo.id === "documento") {
            // Attach event listeners for real-time and focus-based validation

            // Validate that only numbers are entered and limit the maximum length while typing
            campo.addEventListener("keydown", e => {
                validate.validarNumeros(e); // Use the validate module to allow only numbers
                validate.validarMaximo(e, campo.maxLength || 10); // Limit the maximum length of the input
            });

            // Validate the minimum length and that the field is not empty when the input loses focus
            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength || 6); // Ensure the minimum length is met
                validate.validarCampo(e); // Ensure the field is not empty
            });
        }
    });

    // Flag to prevent multiple submissions
    let enviando = false;

    // Handle the form submission event
    form.onsubmit = async (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();

        // If the form is already being submitted, prevent another submission
        if (enviando) return;

        // Validate all form fields before submission
        if (!validate.validarCampos(event, "login")) {
            return; // If validation fails, exit the function
        }

        // Create a data object containing the document number from the validated form data
        const data = {
            document: String(validate.datos.document) // Ensure the document number is converted to a string
        };

        // Set the 'enviando' flag to true to prevent multiple submissions
        enviando = true;

        // Send a POST request to the 'Reset-password' endpoint with the document number
        const response = await post('Reset-password', data);

        // Handle the response from the API
        if (!response || !response.success) {
            // If the response indicates an error

            // Display specific error messages if available
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err)); // Iterate through each error and display it
            } else {
                // Display a general error message if no specific errors are provided
                error(response?.message || "Error al enviar la recuperación");
            }

            enviando = false; // Reset the 'enviando' flag to allow future submissions
            return; // Exit the function
        }

        // If the password reset request is successful

        // Store the user's email in local storage for use in the next step
        localStorage.setItem("email_reset", response.data.email);

        // Display a success message
        success(response.message || "Se ha enviado el correo de recuperación correctamente");

        form.reset(); // Reset the form fields
        enviando = false; // Reset the 'enviando' flag to allow future submissions

        // Redirect the user to the 'Verifycode' page to verify the reset code
        window.location.hash = `#/Verifycode`;
    };
};
