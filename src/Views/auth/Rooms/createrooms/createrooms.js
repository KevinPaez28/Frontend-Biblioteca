import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearArea from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import AreasController from "../roomsController.js";

/**
 * @description Abre un modal para crear una nueva área.
 * Esta función muestra un modal que contiene un formulario para crear una nueva área y gestiona el envío del formulario.
 */
export const abrirModalCrearArea = async () => {

    // Muestra el modal utilizando la función importada, 'mostrarModal', y el contenido HTML, 'htmlCrearArea'.
    const modal = mostrarModal(htmlCrearArea);

    // Utiliza 'requestAnimationFrame' para asegurar que el modal se ha renderizado completamente antes de manipularlo.
    requestAnimationFrame(() => {

        // Obtiene referencias a los elementos del modal.
        const btnCerrar = modal.querySelector("#btnCerrarModal"); // Selecciona el botón de cerrar del modal
        const form = modal.querySelector("#formArea"); // Selecciona el formulario para crear una nueva área
        if (!form) return; // Si el formulario no se encuentra, sale de la función

        // Establece el evento onclick para cerrar el modal, utilizando la función importada, 'cerrarModal'.
        btnCerrar.onclick = () => cerrarModal(modal); // No se acumula

        // Bandera para prevenir el envío múltiple del formulario.
        let enviando = false;

        // Maneja el evento de envío del formulario.
        form.onsubmit = async (event) => {
            // Previene el comportamiento de envío del formulario por defecto.
            event.preventDefault();
            // Si el formulario ya se está enviando, previene envíos múltiples.
            if (enviando) return;

            // Valida los campos del formulario utilizando la función importada, 'validarCampos'.
            if (!validate.validarCampos(event)) return;

            // Establece 'enviando' a true para prevenir envíos múltiples.
            enviando = true;
            // Muestra un mensaje de carga utilizando la función importada, 'loading'.
            loading("Registrando Area");
            // Cierra el modal utilizando la función importada, 'cerrarModal'.
            cerrarModal(modal);

            // Crea un objeto payload con los datos del formulario y el ID del estado por defecto.
            const payload = {
                ...validate.datos,
                estado_id: 1
            };

            try {
                // Envía una petición POST a la API para crear la nueva área.
                const response = await post("salas/create", payload);

                // Si la respuesta no es exitosa.
                if (!response || !response.success) {
                    // Cierra el modal utilizando la función importada, 'cerrarModal'.
                    cerrarModal(modal);
                    // Si hay errores específicos, los muestra utilizando la función importada, 'error'.
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        // Si no hay errores específicos, muestra un mensaje de error genérico.
                        error(response?.message || "Error al crear el área");
                    }
                    // Restablece 'enviando' a false para permitir futuros envíos.
                    enviando = false;
                    return;
                }

                // Restablece los campos del formulario.
                form.reset();
                // Cierra el modal utilizando la función importada, 'cerrarModal'.
                cerrarModal(modal);
                // Muestra un mensaje de éxito utilizando la función importada, 'success'.
                success(response.message || "Área creada correctamente");
                // Refresca la lista de áreas llamando a la función 'AreasController'.
                AreasController();

            } catch (err) {
                // Si ocurre un error durante el proceso, registra el error y muestra un mensaje de error.
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            // Restablece 'enviando' a false para permitir futuros envíos.
            enviando = false;
        };
    });
};
