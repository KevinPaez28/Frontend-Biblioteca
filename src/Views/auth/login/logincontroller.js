import "../../../Components/Formulario/formulario.css"

import { get, login, post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error, loading } from "../../../Helpers/alertas";

/**
 * @description Initializes the login form functionality, including validation and submission.
 * @returns {Promise<void>}
 */
export default async () => {

    // ================= OBTENER ELEMENTOS DEL DOM =================
    // Get the form element from the DOM
    const form = document.querySelector("#formulario_login");

    // Get all input elements within the form
    const campos = form.querySelectorAll("input");

    // Iterate over each input field to attach specific validation logic
    campos.forEach(campo => {
        // Check if the current field is the 'documento' field
        if (campo.id === "documento") {
            /**
             * @description Validates that only numbers are allowed and limits the maximum length while typing.
             * @param {KeyboardEvent} e - The keyboard event.
             */
            campo.addEventListener("keydown", e => {
                validate.validarNumeros(e); // Validate only numbers are entered
                validate.validarMaximo(e, campo.maxLength || 10); // Validate maximum length
            });
            /**
             * @description Validates the minimum length and required field when the input loses focus.
             * @param {FocusEvent} e - The focus event.
             */
            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength || 6); // Validate minimum length
                validate.validarCampo(e); // Validate that the field is not empty
            });
            return; // Exit the forEach loop to prevent applying other validations
        }
    });
    
    // ================= SUBMIT DEL FORMULARIO =================
    // Handle the form submission
    form.onsubmit = async (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Validate all form fields
        if (!validate.validarCampos(event, "login")) {
            return; // If validation fails, exit the function
        }
        
        // Get the validated data from the form
        const data = {
            document: String(validate.datos.document), // Ensure document is a string
            password: String(validate.datos.password) // Ensure password is a string
        };
        
        
        loading("Iniciando Sesion") // Show a loading message
        
        const response = await login(data); // Send the login request to the API
        
        // ===== Manejo de errores =====
        // Check if the login was not successful or if there are errors
        if (!response.ok || (response.errors && response.errors.length > 0)) {
            // If there are specific errors, display them
            if (response.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                // If there is a general error, display it
                error(response.message || "Error al iniciar sesión");
            }
            return; // Exit the function
        }

        // ===== Login exitoso =====
        // If the login was successful
        success(response.message || "Inicio de sesión exitoso"); // Display a success message
        localStorage.setItem("role_id", response.data.role_id); // Store the user's role ID in local storage
        localStorage.setItem("user_id", response.data.id); // Store the user's ID in local storage
        localStorage.setItem("permissions", JSON.stringify(response.data.permissions)); // Store the user's permissions in local storage
        localStorage.setItem("nombres", response.data.names) // Store the user's first name in local storage
        localStorage.setItem("apellido", response.data.last_name) // Store the user's last name in local storage
        window.location.hash = "#/Dashboard"; // Redirect to the dashboard
        form.reset(); // Reset the form
    };
};
