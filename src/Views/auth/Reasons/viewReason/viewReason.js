import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

/**
 * @description Opens a modal to display reason details.
 * @param {object} item - The reason object with details to display.
 * @param {number} index - The index of the reason in the list.
 */
export const abrirModalReason = (item, index) => {

    // Displays the modal using the provided HTML content
    const modal = mostrarModal(htmlContent);

    // Ensures the modal is fully rendered before manipulating it
    requestAnimationFrame(() => {
        // Sets the modal title to the reason's name or a default value
        modal.querySelector('#modalNombreMotivo').textContent =
            item.name || `Motivo ${index + 1}`;

        // Sets the modal content for the reason's description
        modal.querySelector('#modalUsoSala').textContent =
            item.description || '';

        // Sets the modal content to show the reason's active status
        modal.querySelector('#modalActivo').textContent =
            "Estado: " + (item.state?.name || "—");

        // Adds an event listener to the close button to close the modal
        modal
            .querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
