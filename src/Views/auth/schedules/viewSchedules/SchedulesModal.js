import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./viewSchedules.html?raw";

export const abrirModalHorario = (item, index) => {
    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        // ================== ELEMENTOS DEL MODAL ==================
        const modalNombre = modal.querySelector("#modalNombre");
        const modalJornada = modal.querySelector("#modalJornada");
        const modalInicio = modal.querySelector("#modalInicio");
        const modalFin = modal.querySelector("#modalFin");
        const btnCerrar = modal.querySelector("#btnCerrarModal");

        if (!modalNombre || !modalJornada || !modalInicio || !modalFin || !btnCerrar) {
            console.error("No se encontraron todos los elementos del modal");
            cerrarModal(modal);
            return;
        }

        // ================== PRECARGAR DATOS ==================
        modalNombre.textContent = `Horario ${index + 1}`;
        modalJornada.textContent = item.jornada;
        modalInicio.textContent = item.start_time;
        modalFin.textContent = item.end_time;

        // ================== CERRAR MODAL ==================
        btnCerrar.addEventListener("click", () => cerrarModal(modal));
    });
};
