import "../../../Components/Formulario/formulario.css"

import { get, login, post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error, loading } from "../../../Helpers/alertas";

/**
 * @description Inicializa la funcionalidad del formulario de inicio de sesión, incluyendo la validación y el envío.
 * @returns {Promise<void>}
 */
export default async () => {

    // ================= OBTENER ELEMENTOS DEL DOM =================
    // Obtiene el elemento del formulario desde el DOM
    const form = document.querySelector("#formulario_login");

    // Obtiene todos los elementos de entrada dentro del formulario
    const campos = form.querySelectorAll("input");

    // Itera sobre cada campo de entrada para adjuntar una lógica de validación específica
    campos.forEach(campo => {
        // Comprueba si el campo actual es el campo 'documento'
        if (campo.id === "documento") {
            /**
             * @description Valida que solo se permitan números y limita la longitud máxima al escribir.
             * @param {KeyboardEvent} e - El evento del teclado.
             */
            campo.addEventListener("keydown", e => {
                validate.validarNumeros(e); // Valida que solo se introduzcan números
                validate.validarMaximo(e, campo.maxLength || 10); // Valida la longitud máxima
            });
            /**
             * @description Valida la longitud mínima y el campo requerido cuando la entrada pierde el foco.
             * @param {FocusEvent} e - El evento de foco.
             */
            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength || 6); // Valida la longitud mínima
                validate.validarCampo(e); // Valida que el campo no esté vacío
            });
            return; // Sale del bucle forEach para evitar aplicar otras validaciones
        }
    });
    
    // ================= SUBMIT DEL FORMULARIO =================
    // Maneja el envío del formulario
    form.onsubmit = async (event) => {
        // Previene el comportamiento de envío del formulario por defecto
        event.preventDefault();
        
        // Valida todos los campos del formulario
        if (!validate.validarCampos(event, "login")) {
            return; // Si la validación falla, sale de la función
        }
        
        // Obtiene los datos validados del formulario
        const data = {
            document: String(validate.datos.document), // Asegura que el documento sea una cadena
            password: String(validate.datos.password) // Asegura que la contraseña sea una cadena
        };
        
        
        loading("Iniciando Sesion") // Muestra un mensaje de carga
        
        const response = await login(data); // Envía la solicitud de inicio de sesión a la API
        
        // ===== Manejo de errores =====
        // Comprueba si el inicio de sesión no fue exitoso o si hay errores
        if (!response.ok || (response.errors && response.errors.length > 0)) {
            // Si hay errores específicos, los muestra
            if (response.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                // Si hay un error general, lo muestra
                error(response.message || "Error al iniciar sesión");
            }
            return; // Sale de la función
        }

        // ===== Login exitoso =====
        // Si el inicio de sesión fue exitoso
        success(response.message || "Inicio de sesión exitoso"); // Muestra un mensaje de éxito
        localStorage.setItem("role_id", response.data.role_id); // Almacena el ID del rol del usuario en el almacenamiento local
        localStorage.setItem("user_id", response.data.id); // Almacena el ID del usuario en el almacenamiento local
        localStorage.setItem("permissions", JSON.stringify(response.data.permissions)); // Almacena los permisos del usuario en el almacenamiento local
        localStorage.setItem("nombres", response.data.names) // Almacena el nombre del usuario en el almacenamiento local
        localStorage.setItem("apellido", response.data.last_name) // Almacena el apellido del usuario en el almacenamiento local
        window.location.hash = "#/Dashboard"; // Redirige al panel de control
        form.reset(); // Restablece el formulario
    };
};
