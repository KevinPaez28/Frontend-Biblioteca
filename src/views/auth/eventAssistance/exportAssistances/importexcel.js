import { exportFile } from "../../../../helpers/api.js";
import "../../../../components/models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../helpers/modalManagement.js";
import htmlExportAsistencias from "./index.html?raw";
import { error, loading, success } from "../../../../helpers/alertas.js";

export const abrirModalExportAsistencias = async () => {
    const modal = mostrarModal(htmlExportAsistencias);

    requestAnimationFrame(() => {
        const btnCerrar = modal.querySelector("#btnCerrarModalExport");
        const form = modal.querySelector("#formExportAsistencias");

        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        form.onsubmit = async (event) => {
            event.preventDefault();

            const fechaInicio = modal.querySelector("#filtroFechaInicio").value;
            const fechaFin = modal.querySelector("#filtroFechaFin").value;

            if (!fechaInicio || !fechaFin) {
                error("Debes seleccionar ambas fechas");
                return;
            }
            
            cerrarModal(modal);
            loading("Exportando Aprendices");

            const params = new URLSearchParams({
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });
            const endpoint = `asistencia/export/event?${params.toString()}`;

            try {
                const blob = await exportFile(endpoint);

                // Cerramos el modal solo después de que el Excel esté listo

                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `Asistencias_${fechaInicio}_a_${fechaFin}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);

                success('Excel descargado correctamente');
            } catch (err) {
                // Cerramos el modal si hay error
                cerrarModal(modal);
                error(err.message || "Error al descargar el Excel");
            }
        };
    });
};