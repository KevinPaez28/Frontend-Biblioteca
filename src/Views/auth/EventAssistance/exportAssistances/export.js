import { get } from "../../../../Helpers/api.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlExportAsistencias from "./index.html?raw";

export const abrirModalExportAsistencias = async () => {

    mostrarModal(htmlExportAsistencias);

    requestAnimationFrame(() => {
        const btnCerrar = document.querySelector("#btnCerrarModalExport");
        const form = document.querySelector("#formExportAsistencias");

        btnCerrar.addEventListener("click", cerrarModal);

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fechaInicio = document.querySelector("#filtroFechaInicio").value;
            const fechaFin = document.querySelector("#filtroFechaFin").value;

            if (!fechaInicio || !fechaFin) {
                alert("Debes seleccionar ambas fechas");
                return;
            }

            const params = new URLSearchParams({
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });

            // Abre nueva ventana para descargar Excel
            const url = `/api/asistencia/export?${params.toString()}`;
            window.open(url, "_blank");

            cerrarModal();
        });

    });
};
