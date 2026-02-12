import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import EventsController from "../eventsController.js";

/**
 * @function editModalEvento
 * @description Abre un modal para editar un evento existente, precargando los datos del evento en el formulario y gestionando la actualización de los datos en el servidor.
 * @param {object} item - El objeto del evento a editar.  It must contains properties like `name`, `mandated`, `date`, `start_time`, `end_time`, `room?.id`, `state?.id`.
 * @async
 * @returns {Promise<void>}
 */
export const editModalEvento = (item) => {

    /**
     * @constant modal
     * @type {HTMLElement}
     * @description Elemento HTML que representa el modal, obtenido al mostrar el contenido HTML.
     */
    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(async () => {
        /**
         * @constant btnCerrar
         * @type {HTMLElement}
         * @description Botón para cerrar el modal.
         */
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        /**
         * @constant form
         * @type {HTMLFormElement}
         * @description Formulario para la edición del evento.
         */
        const form = modal.querySelector("#formEvento");

        /**
         * @constant inputNombre
         * @type {HTMLInputElement}
         * @description Input para el nombre del evento.
         */
        const inputNombre = modal.querySelector("#modalInputNombreEvento");
        /**
         * @constant inputEncargado
         * @type {HTMLInputElement}
         * @description Input para el encargado del evento.
         */
        const inputEncargado = modal.querySelector("#modalInputEncargado");
        /**
         * @constant inputFecha
         * @type {HTMLInputElement}
         * @description Input para la fecha del evento.
         */
        const inputFecha = modal.querySelector("#modalInputFecha");
        /**
         * @constant inputHoraInicio
         * @type {HTMLInputElement}
         * @description Input para la hora de inicio del evento.
         */
        const inputHoraInicio = modal.querySelector("#modalInputHoraInicio");
        /**
         * @constant inputHoraFin
         * @type {HTMLInputElement}
         * @description Input para la hora de fin del evento.
         */
        const inputHoraFin = modal.querySelector("#modalInputHoraFin");
        /**
         * @constant selectArea
         * @type {HTMLSelectElement}
         * @description Selector para el área del evento.
         */
        const selectArea = modal.querySelector("#modalSelectArea");
        /**
         * @constant selectEstado
         * @type {HTMLSelectElement}
         * @description Selector para el estado del evento.
         */
        const selectEstado = modal.querySelector("#modalSelectEstado");

        // ===== PRECARGAR DATOS =====
        inputNombre.value = item.name;
        inputEncargado.value = item.mandated;
        inputFecha.value = item.date;
        inputHoraInicio.value = item.start_time;
        inputHoraFin.value = item.end_time;

        // ===== RELLENAR ÁREAS =====
        /**
         * @constant areas
         * @type {Array}
         * @description Arreglo de áreas obtenidas del servidor.
         */
        const areas = await get("salas");
        areas.data.forEach(a => {
            /**
             * @constant op
             * @type {HTMLOptionElement}
             * @description Elemento 'option' creado para cada área.
             */
            const op = document.createElement("option");
            op.value = a.id;
            op.textContent = a.name;
            if (a.id === item.room?.id) op.selected = true;
            selectArea.append(op);
        });

        // ===== RELLENAR ESTADOS =====
        /**
         * @constant estados
         * @type {Array}
         * @description Arreglo de estados obtenidos del servidor.
         */
        const estados = await get("estadoEventos");
        estados.data.forEach(e => {
            /**
             * @constant op
             * @type {HTMLOptionElement}
             * @description Elemento 'option' creado para cada estado.
             */
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;
            if (e.id === item.state?.id) op.selected = true;
            selectEstado.append(op);
        });

        // ===== CERRAR MODAL =====
        /**
         * @event click
         * @description Asigna un evento al botón de cerrar para cerrar el modal cuando se hace clic.
         */
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        /**
         * @let enviando
         * @type {boolean}
         * @default false
         * @description Bandera para evitar el envío múltiple del formulario.
         */
        let enviando = false;

        // ===== SUBMIT =====
        /**
         * @event submit
         * @description Asigna un evento al formulario para gestionar el envío de datos al servidor.
         */
        form.onsubmit = async (event) => {
            event.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(event)) return;
            loading("Editando Evento");
            cerrarModal(modal);
            /**
             * @constant payload
             * @type {object}
             * @description Objeto con los datos a enviar al servidor.
             */
            const payload = {
                ...validate.datos,
                hora_inicio: inputHoraInicio.value,
                hora_fin: inputHoraFin.value,
                sala_id: selectArea.value,
                estado_id: selectEstado.value
            };

            try {
                enviando = true;
                /**
                 * @constant response
                 * @type {object}
                 * @description Respuesta del servidor al intentar actualizar el evento.
                 */
                const response = await patch(`eventos/${item.id}`, payload);

                if (!response || response.error) {
                    error(response?.message || "Error al actualizar el evento");
                    enviando = false;
                    return;
                }

                cerrarModal(modal);
                success(response.message || "Evento actualizado correctamente");
                EventsController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        };
    });
};
