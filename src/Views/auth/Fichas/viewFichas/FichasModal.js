import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./viewFichas.html?raw";

/**
 * @description Function to open a modal with ficha information.
 * @param {Object} item Object containing the ficha data.
 * @param {number} index Index of the ficha in the list.
 */
export const abrirModalFicha = (item, index) => {

    // Show the modal using the imported function and HTML content.
    const modal = mostrarModal(htmlContent);

    // Use requestAnimationFrame to ensure the modal is rendered before manipulating it.
    requestAnimationFrame(() => {
        // Set the modal title with the ficha index.
        modal.querySelector("#modalNombre").textContent = `Ficha ${index + 1}`;
        // Set the ficha number in the modal.
        modal.querySelector("#modalFicha").textContent = item.ficha;
        // Set the training program name in the modal, or display "—" if it's not available.
        modal.querySelector("#modalPrograma").textContent =
            item.programa?.training_program || "—";

        // Add an event listener to the close button to close the modal.
        modal
            .querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
