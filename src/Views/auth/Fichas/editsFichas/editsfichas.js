import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarFicha from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import fichasController from "../FichasController.js";

/**
 * @description Función asíncrona para mostrar un modal de edición de ficha y gestionar su actualización.
 * @param {Object} ficha Objeto que contiene la información de la ficha a editar.
 * @returns {Promise<void>}
 */
export const editarmodalFicha = async (ficha) => {
    // Mostrar el modal utilizando la función mostrarModal y el HTML importado.
    const modal = mostrarModal(htmlEditarFicha);

    // Usar requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(async () => {

        // Obtener referencias a los elementos del DOM dentro del modal.
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formFicha");
        const inputFicha = modal.querySelector("#inputFicha");
        const selectPrograma = modal.querySelector("#inputPrograma");

        // ===== PRECARGAR DATOS =====
        // Establecer el valor del input de ficha con el valor actual de la ficha, o una cadena vacía si no existe.
        inputFicha.value = ficha.ficha || "";

        // ===== CARGAR PROGRAMAS =====
        // Obtener la lista de programas desde la API.
        const programas = await get("programa");
        // Verificar si se obtuvieron programas y si la lista no está vacía.
        if (programas?.data?.length) {
            // Iterar sobre cada programa en la lista.
            programas.data.forEach(p => {
                // Crear un elemento 'option' para cada programa.
                const option = document.createElement("option");
                // Establecer el valor del 'option' con el ID del programa.
                option.value = p.id;
                // Establecer el texto del 'option' con el nombre del programa.
                option.textContent = p.training_program;
                // Si el ID del programa actual coincide con el ID del programa de la ficha, seleccionar este 'option'.
                if (ficha.programa?.id === p.id) option.selected = true;
                // Agregar el 'option' al 'select' de programas.
                selectPrograma.appendChild(option);
            });
        }

        // ===== CERRAR =====
        // Agregar un event listener al botón de cerrar para cerrar el modal cuando se hace clic.
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable para evitar el envío múltiple del formulario.
        let enviando = false;

        // ===== SUBMIT =====
        // Agregar un event listener para el evento 'submit' del formulario.
        form.onsubmit = async (event) => {
            // Prevenir el comportamiento por defecto del formulario (recargar la página).
            event.preventDefault();
            // Si ya se está enviando, salir de la función.
            if (enviando) return;
            // Validar los campos del formulario utilizando la función 'validarCampos'.
            if (!validate.validarCampos(event)) return;

            // Crear un objeto 'payload' con los datos validados del formulario.
            const payload = { ...validate.datos };

            try {
                // Establecer 'enviando' a true para evitar el envío múltiple.
                enviando = true;
                // Enviar una petición PATCH a la API para actualizar la ficha con el 'payload'.
                const response = await patch(`ficha/${ficha.id}`, payload);

                // Si la respuesta de la API es falsa o no tiene éxito.
                if (!response || !response.success) {
                    // Cerrar el modal.
                    cerrarModal(modal);
                    // Si hay errores en la respuesta, mostrar cada error.
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        // Si no hay errores específicos, mostrar un mensaje de error genérico.
                        error(response?.message || "Error al actualizar la ficha");
                    }
                    // Establecer 'enviando' a false para permitir futuros envíos.
                    enviando = false;
                    return;
                }

                // Si la respuesta de la API es exitosa, cerrar el modal.
                cerrarModal(modal);
                // Mostrar un mensaje de éxito.
                success(response.message || "Ficha actualizada correctamente");
                // Resetear el formulario.
                form.reset();
                // Recargar la lista de fichas.
                fichasController();

            } catch (err) {
                // Si ocurre un error inesperado, imprimir el error en la consola.
                console.error(err);
                // Mostrar un mensaje de error genérico.
                error("Ocurrió un error inesperado");
            }

            // Establecer 'enviando' a false para permitir futuros envíos.
            enviando = false;
        };
    });
};
