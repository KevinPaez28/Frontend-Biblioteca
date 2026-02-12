import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearPrograma from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import programasController from "../ProgramsController.js";

/**
 * @description Abre un modal para crear un nuevo programa.
 */
export const abrirModalCrearPrograma = async () => {

    // Muestra el modal utilizando la función importada y el contenido HTML
    const modal = mostrarModal(htmlCrearPrograma);

    // Utiliza requestAnimationFrame para asegurar que el modal se renderice completamente antes de manipularlo
    requestAnimationFrame(() => {
        // Obtiene referencias al botón de cerrar y al formulario dentro del modal
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formPrograma");

        // Agrega un event listener al botón de cerrar para cerrar el modal
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable para prevenir el envío múltiple del formulario
        let enviando = false;

        // Maneja el evento de envío del formulario
        form.onsubmit = async (event) => {
            // Previene el comportamiento de envío del formulario por defecto
            event.preventDefault();
            // Si el formulario ya está en proceso de envío, previene otro envío
            if (enviando) return;

            // Valida los campos del formulario utilizando el módulo de validación importado
            if (!validate.validarCampos(event)) return;

            // Crea un objeto de carga útil con los datos validados
            const payload = { ...validate.datos };

            try {
                // Establece 'enviando' en true para prevenir el envío múltiple
                enviando = true;
                // Envía una solicitud POST a la API para crear el programa
                const response = await post("programa/create", payload);

                // Si la respuesta no es exitosa
                if (!response || !response.success) {
                    // Si hay errores específicos en la respuesta, los muestra
                    if (response?.errors?.length) {
                        cerrarModal(modal);
                        response.errors.forEach(err => error(err));
                    }
                    // De lo contrario, muestra un mensaje de error general
                    else {
                        error(response?.message || "Error al crear el programa");
                    }
                    // Restablece 'enviando' en false para permitir envíos futuros
                    enviando = false;
                    return;
                }

                // Si la creación del programa es exitosa
                cerrarModal(modal);
                form.reset();
                success(response.message || "Programa creado correctamente");
                programasController(); // Refresca la lista de programas
                enviando = false; // Restablece 'enviando'

            } catch (err) {
                // Maneja cualquier error que ocurra durante el proceso de creación
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false; // Restablece 'enviando'
            }
        };
    });
};
