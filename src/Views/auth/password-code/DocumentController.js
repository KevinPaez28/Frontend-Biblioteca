import "../../../Components/Formulario/formulario.css"
import { post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error } from "../../../Helpers/alertas";

/**
 * @description Esta función configura el formulario de recuperación de contraseña, maneja la validación de la entrada,
 *              y envía el formulario para solicitar un código de restablecimiento de contraseña.
 */
export default async () => {
    // Obtiene el elemento del formulario del DOM usando su ID
    const form = document.querySelector("#formulario_passwordCode");
    // Obtiene todos los elementos de entrada dentro del formulario
    const campos = form.querySelectorAll("input");

    // Itera a través de cada campo de entrada para adjuntar reglas de validación específicas
    campos.forEach(campo => {
        // Comprueba si el campo de entrada actual es el campo 'documento' (número de documento)
        if (campo.id === "documento") {
            // Adjunta listeners de eventos para la validación en tiempo real y basada en el foco

            // Valida que solo se introduzcan números y limita la longitud máxima al escribir
            campo.addEventListener("keydown", e => {
                validate.validarNumeros(e); // Utiliza el módulo de validación para permitir solo números
                validate.validarMaximo(e, campo.maxLength || 10); // Limita la longitud máxima de la entrada
            });

            // Valida la longitud mínima y que el campo no esté vacío cuando la entrada pierde el foco
            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength || 6); // Asegura que se cumpla la longitud mínima
                validate.validarCampo(e); // Asegura que el campo no esté vacío
            });
        }
    });

    // Bandera para evitar envíos múltiples
    let enviando = false;

    // Maneja el evento de envío del formulario
    form.onsubmit = async (event) => {
        // Previene el comportamiento de envío del formulario por defecto
        event.preventDefault();

        // Si el formulario ya está siendo enviado, previene otro envío
        if (enviando) return;

        // Valida todos los campos del formulario antes del envío
        if (!validate.validarCampos(event, "login")) {
            return; // Si la validación falla, sale de la función
        }

        // Crea un objeto de datos que contiene el número de documento de los datos del formulario validados
        const data = {
            document: String(validate.datos.document) // Asegura que el número de documento se convierta en una cadena
        };

        // Establece la bandera 'enviando' a true para evitar envíos múltiples
        enviando = true;

        // Envía una solicitud POST al endpoint 'Reset-password' con el número de documento
        const response = await post('Reset-password', data);

        // Maneja la respuesta de la API
        if (!response || !response.success) {
            // Si la respuesta indica un error

            // Muestra mensajes de error específicos si están disponibles
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err)); // Itera a través de cada error y lo muestra
            } else {
                // Muestra un mensaje de error general si no se proporcionan errores específicos
                error(response?.message || "Error al enviar la recuperación");
            }

            enviando = false; // Restablece la bandera 'enviando' para permitir envíos futuros
            return; // Sale de la función
        }

        // Si la solicitud de restablecimiento de contraseña es exitosa

        // Almacena el correo electrónico del usuario en el almacenamiento local para usarlo en el siguiente paso
        localStorage.setItem("email_reset", response.data.email);

        // Muestra un mensaje de éxito
        success(response.message || "Se ha enviado el correo de recuperación correctamente");

        form.reset(); // Restablece los campos del formulario
        enviando = false; // Restablece la bandera 'enviando' para permitir envíos futuros

        // Redirige al usuario a la página 'Verifycode' para verificar el código de restablecimiento
        window.location.hash = `#/Verifycode`;
    };
};
