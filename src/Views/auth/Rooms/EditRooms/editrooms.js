import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import roomsController from "../roomsController.js";

/**
 * @description Función para mostrar y manejar el modal para editar una sala.
 * @param {object} item - El objeto de la sala que contiene los datos a editar.
 */
export const editmodalreason = (item) => {
    // Muestra el modal utilizando el contenido HTML proporcionado
    const modal = mostrarModal(htmlContent);

    // Asegura que el modal se renderice completamente antes de manipularlo
    requestAnimationFrame(async () => {
        // Obtiene referencias a los elementos del modal
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formRoom");
        const inputNombre = modal.querySelector("#modalInputNombreSala");
        const inputDescripcion = modal.querySelector("#modalInputDescripcion");
        const selectEstado = modal.querySelector("#modalInputActivo");

        // ===== PRECARGAR DATOS =====
        // Precarga los datos en los campos de entrada
        inputNombre.value = item.name;
        inputDescripcion.value = item.description;

        // ===== RELLENAR SELECT DE ESTADOS =====
        // Obtiene los estados para el elemento select
        const estados = await get("estadosalas");
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;

            // Selecciona la opción si coincide con el estado del elemento
            if (e.id === item.state_room_id) {
                op.selected = true;
            }

            selectEstado.append(op);
        });

        // CIERRE CORRECTO DEL MODAL
        // Agrega un event listener al botón de cerrar
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable para prevenir el envío múltiple del formulario
        let enviando = false;

        // Maneja el evento de envío del formulario
        form.onsubmit = async (event) => {
            // Previene el comportamiento de envío del formulario por defecto
            event.preventDefault();
            // Si el formulario ya se está enviando, previene el envío múltiple
            if (enviando) return;
            // Valida los campos del formulario
            if (!validate.validarCampos(event)) return;
            // Muestra un mensaje de carga
            loading("Modificando Motivo");
            // Cierra el modal
            cerrarModal(modal);

            // Crea la carga útil con los datos del formulario y el estado seleccionado
            const payload = {
                ...validate.datos,
                estado_sala: selectEstado.value
            };

            try {
                // Establece 'enviando' en true para prevenir el envío múltiple
                enviando = true;

                // Envía una petición PATCH para actualizar la sala
                const response = await patch(`salas/${item.id}`, payload);

                // Si la respuesta no es exitosa
                if (!response || !response.success) {
                    // Muestra cualquier error
                    if (response?.errors && response.errors.length > 0) {
                        response.errors.forEach(err => error(err));
                        // Asegura que el modal se cierre
                        cerrarModal(modal);
                    } else {
                        error(response?.message || "Error al actualizar el horario");
                    }
                    // Restablece 'enviando' a false
                    enviando = false;
                    return;
                }

                // Si la actualización es exitosa
                cerrarModal(modal);
                success(response.message || "Sala actualizada correctamente");
                form.reset();
                roomsController();
                // Restablece 'enviando' a false
                enviando = false;

            } catch (err) {
                // Maneja cualquier error durante el proceso de actualización
                console.error(err);
                error("Ocurrió un error inesperado");
                // Restablece 'enviando' a false
                enviando = false;
            }
        };
    });
};
