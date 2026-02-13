import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

/**
 * @description Abre un modal para mostrar los detalles de un motivo.
 * @param {object} item - El objeto del motivo que contiene los detalles a mostrar.
 * @param {number} index - El índice del motivo en la lista.
 */
export const abrirModalReason = (item, index) => {

    // Muestra el modal utilizando la función y el contenido HTML importados.
    const modal = mostrarModal(htmlContent);

    // Utiliza requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(() => {
        // Establece el título del modal con el nombre del motivo o un valor predeterminado.
        modal.querySelector('#modalNombreMotivo').textContent =
            item.name || `Motivo ${index + 1}`;

        // Establece el contenido del modal para la descripción del motivo o una cadena vacía si no hay descripción disponible.
        modal.querySelector('#modalDescripcionMotivo').textContent =
            item.description || '';

        // Establece el contenido del modal para mostrar el estado del motivo.
        modal.querySelector('#modalEstadoMotivo').textContent =
            "Estado: " + item.state.name;

        // Agrega un event listener al botón de cerrar para cerrar el modal cuando se hace clic.
        modal
            .querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
