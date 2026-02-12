import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarPrograma from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import programasController from "../ProgramsController.js";

/**
 * @description Función asíncrona para mostrar un modal de edición de programa y gestionar su actualización.
 * @param {Object} programa Objeto que contiene la información del programa a editar.
 * @returns {Promise<void>}
 */
export const editarModalPrograma = async (programa) => {
    // Mostrar el modal utilizando la función mostrarModal y el HTML importado.
    const modal = mostrarModal(htmlEditarPrograma);

    // Usar requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(async () => {
        // Obtener una referencia al botón de cerrar del modal.
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        // Obtener una referencia al formulario del modal.
        const form = modal.querySelector("#formPrograma");

        // ===== PRECARGAR DATOS =====
        // Precargar el nombre del programa en el campo de entrada correspondiente.
        modal.querySelector("#inputPrograma").value =
            programa.training_program || "";

        // Agregar un event listener al botón de cerrar para cerrar el modal cuando se hace clic.
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable para controlar el envío múltiple del formulario.
        let enviando = false;

        // Configurar el evento onsubmit del formulario.
        form.onsubmit = async (event) => {
            // Prevenir el comportamiento por defecto del formulario (recargar la página).
            event.preventDefault();
            // Si ya se está enviando, salir de la función.
            if (enviando) return;

            // Validar los campos del formulario utilizando la función validarCampos.
            if (!validate.validarCampos(event)) return;

            // Crear un objeto payload con los datos del formulario validados.
            const payload = { ...validate.datos };

            try {
                // Establecer la variable enviando a true para evitar el envío múltiple.
                enviando = true;
                // Enviar una petición PATCH a la API para actualizar el programa con el payload.
                const response = await patch(`programa/${programa.id}`, payload);

                // Si la respuesta de la API no es exitosa.
                if (!response || !response.success) {
                    // Cerrar el modal.
                    cerrarModal(modal);
                    // Si hay errores en la respuesta, mostrar cada error.
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        // Si no hay errores específicos, mostrar un mensaje de error genérico.
                        error(response?.message || "Error al actualizar el programa");
                    }
                    // Establecer la variable enviando a false para permitir futuros envíos.
                    enviando = false;
                    return;
                }

                // Si la respuesta de la API es exitosa, resetear el formulario.
                form.reset();
                // Cerrar el modal.
                cerrarModal(modal);
                // Mostrar un mensaje de éxito.
                success(response.message || "Programa actualizado correctamente");
                // Recargar la lista de programas.
                programasController();
                // Establecer la variable enviando a false para permitir futuros envíos.
                enviando = false;

            } catch (err) {
                // Si ocurre un error inesperado, imprimir el error en la consola.
                console.error(err);
                // Mostrar un mensaje de error genérico.
                error("Ocurrió un error inesperado");
                // Establecer la variable enviando a false para permitir futuros envíos.
                enviando = false;
            }
        };
    });
};
