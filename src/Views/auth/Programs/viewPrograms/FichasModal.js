import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

/**
 * @description Abre un modal para mostrar la información de un programa.
 * @param {Object} item Objeto que contiene la información del programa.
 * @param {number} index Índice del programa en la lista.
 */
export const abrirModalPrograma = (item, index) => {

    // Muestra el modal utilizando la función y el contenido HTML importados.
    const modal = mostrarModal(htmlContent);

    // Utiliza requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(() => {
        // Establece el título del modal con el índice del programa.
        modal.querySelector("#modalNombre").textContent = `Programa ${index + 1}`;
        // Establece el nombre del programa en el modal, o muestra "—" si no está disponible.
        modal.querySelector("#modalPrograma").textContent =
            item.training_program || "—";

        // Agrega un event listener al botón de cerrar para cerrar el modal.
        modal
            .querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
