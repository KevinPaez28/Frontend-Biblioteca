import { exportFile, get } from "../../../../Helpers/api.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlExportAsistencias from "./index.html?raw";
import { error, loading, success } from "../../../../Helpers/alertas.js";

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
                error("Debes seleccionar ambas fechas");
                return;
            }
            loading("Registrando aprendices...");

            const params = new URLSearchParams({
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });

            const endpoint = `asistencia/export?${params.toString()}`;

            try {
                // 🔑 Manejo completo como crearAsistencia
                const blob = await exportFile(endpoint);

                // Descarga
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `Asistencias_${fechaInicio}_a_${fechaFin}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);

                cerrarModal();
                success('Excel descargado correctamente');
                
            } catch (err) {
                cerrarModal();
                
                // ✅ Manejo de errores como crearAsistencia
                if (err.message.includes('No se encontraron asistencias')) {
                    error('No se encontraron asistencias en el rango de fechas seleccionado');
                } else {
                    error(err.message || "Error al descargar el Excel");
                }
            }
        });
    });
};
