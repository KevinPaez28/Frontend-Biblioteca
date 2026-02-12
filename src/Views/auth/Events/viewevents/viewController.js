import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

/**
 * @function abrirModalEvento
 * @description Opens a modal to display event details.
 * @param {object} item - The event object containing details to display.
 * @param {number} index - The index of the event in a list, used for default naming.
 */
export const abrirModalEvento = (item, index) => {

    /**
     * @constant modal
     * @type {HTMLElement}
     * @description The modal element to display.
     */
    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        /**
         * @description Sets the text content of the modal elements with event details, using default values if the data is not available.
         */
        modal.querySelector("#modalNombreEvento").textContent =
            item.name || `Evento ${index + 1}`;

        modal.querySelector("#modalEncargadoEvento").textContent =
            item.mandated || "—";

        modal.querySelector("#modalAreaEvento").textContent =
            item.room?.name || "—";

        modal.querySelector("#modalFechaEvento").textContent =
            item.date || "—";

        modal.querySelector("#modalHoraInicioEvento").textContent =
            item.time.start || "—";

        modal.querySelector("#modalHoraFinEvento").textContent =
            item.time.end || "—";

        modal.querySelector("#modalEstadoEvento").textContent =
            "Estado: " + (item.state?.name || "—");

        /**
         * @description Adds an event listener to the close button to close the modal.
         */
        modal.querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
