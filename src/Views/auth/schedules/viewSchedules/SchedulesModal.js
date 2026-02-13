import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./viewSchedules.html?raw";

/**
 * @description Abre un modal para mostrar la información de un horario.
 * @param {object} item Objeto que contiene la información del horario a mostrar.
 * @param {number} index Índice del horario en la lista.
 */
export const abrirModalHorario = (item, index) => {
    // Muestra el modal utilizando la función mostrarModal y el contenido HTML importado.
    const modal = mostrarModal(htmlContent);

    // Utiliza requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(() => {
        // ================== ELEMENTOS DEL MODAL ==================
        // Obtiene referencias a los elementos del modal.
        const modalNombre = modal.querySelector("#modalNombre");
        const modalJornada = modal.querySelector("#modalJornada");
        const modalInicio = modal.querySelector("#modalInicio");
        const modalFin = modal.querySelector("#modalFin");
        const btnCerrar = modal.querySelector("#btnCerrarModal");

        // Si no se encuentran todos los elementos del modal, registra un error en la consola, cierra el modal y sale de la función.
        if (!modalNombre || !modalJornada || !modalInicio || !modalFin || !btnCerrar) {
            console.error("No se encontraron todos los elementos del modal");
            cerrarModal(modal);
            return;
        }

        // ================== PRECARGAR DATOS ==================
        // Establece el contenido de texto de los elementos del modal con la información del horario.
        modalNombre.textContent = `Horario ${index + 1}`;
        modalJornada.textContent = item.jornada;
        modalInicio.textContent = item.start_time;
        modalFin.textContent = item.end_time;

        // ================== CERRAR MODAL ==================
        // Agrega un event listener al botón de cerrar para cerrar el modal cuando se hace clic.
        btnCerrar.addEventListener("click", () => cerrarModal(modal));
    });
};
