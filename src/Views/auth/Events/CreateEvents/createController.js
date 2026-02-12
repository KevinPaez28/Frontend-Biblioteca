import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearEvento from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import EventsController from "../eventsController.js";

/**
 * @function abrirModalCrearEvento
 * @description Abre un modal para crear un nuevo evento, gestionando la interacción del usuario y la comunicación con el servidor.
 * @async
 * @returns {Promise<void>}
 */
export const abrirModalCrearEvento = async () => {

    // ================== MOSTRAR MODAL ==================
    /**
     * @constant modal
     * @type {HTMLElement}
     * @description Elemento HTML que representa el modal, obtenido al mostrar el contenido HTML.
     */
    const modal = mostrarModal(htmlCrearEvento);

    requestAnimationFrame(async () => {

        // ================== CONSTANTES DEL MODAL ==================
        /**
         * @constant btnCerrar
         * @type {HTMLElement}
         * @description Botón para cerrar el modal.
         */
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        /**
         * @constant form
         * @type {HTMLFormElement}
         * @description Formulario para la creación del evento.
         */
        const form = modal.querySelector("#formEvento");
        /**
         * @constant selectArea
         * @type {HTMLSelectElement}
         * @description Selector para elegir el área del evento.
         */
        const selectArea = modal.querySelector("#selectArea");

        // ================== BOTÓN CERRAR ==================
        /**
         * @event click
         * @description Asigna un evento al botón de cerrar para cerrar el modal cuando se hace clic.
         */
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ================== BANDERA DE ENVÍO ==================
        /**
         * @let enviando
         * @type {boolean}
         * @default false
         * @description Bandera para evitar el envío múltiple del formulario.
         */
        let enviando = false;

        // ================== EVENTO SUBMIT ==================
        /**
         * @event submit
         * @description Asigna un evento al formulario para gestionar el envío de datos al servidor.
         */
        form.onsubmit = async (event) => {
            event.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(event)) return;

            loading("Creando evento");
            cerrarModal(modal);

            const { fecha, hora, ...resto } = validate.datos;

            const payload = {
                ...resto,
                fecha: `${fecha}`,
                hora: `${hora}`,
                estado_id: 1
            };

            try {
                enviando = true;
                const response = await post("eventos/create", payload);

                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear el evento");
                    }
                    enviando = false;
                    return;
                }

                form.reset();
                cerrarModal(modal);
                success(response.message || "Evento creado correctamente");
                EventsController();
            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        };

        // ================== CARGA DE DATOS DINÁMICOS ==================
        try {
            /**
             * @constant areas
             * @type {Array}
             * @description  Arreglo de áreas obtenidas del servidor.
             */
            const areas = await get("salas");
            areas.data.forEach(area => {
                const option = document.createElement("option");
                option.value = area.id;
                option.textContent = area.name;
                selectArea.append(option);
            });
        } catch (err) {
            console.error(err);
            error("No se pudieron cargar las áreas");
        }

    });
};
