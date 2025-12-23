import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Styles/Schedules/SchedulesModal.css"
import htmlContent from "./viewSchedules.html?raw";

export const abrirModalHorario = (item, index) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        document.querySelector("#modalNombre").textContent = `Horario ${index + 1}`;
        document.querySelector("#modalJornada").textContent = item.jornada;
        document.querySelector("#modalInicio").textContent = item.start_time;
        document.querySelector("#modalFin").textContent = item.end_time;

        document
            .querySelector("#btnCerrarModal")
            .addEventListener("click", cerrarModal);
    });
};