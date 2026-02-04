import { exportFile, get } from "../../../../Helpers/api.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlExportAsistencias from "./index.html?raw";
import { error, loading, success } from "../../../../Helpers/alertas.js";


// ============================================================================
// FUNCIÓN: abrirModalReason
// ============================================================================
// - Modal para **exportar asistencias por rango de fechas** a Excel.
// - Valida fechas obligatorias.
// - Descarga archivo `.xlsx` con nombre dinámico: `Asistencias_YYYY-MM-DD_a_YYYY-MM-DD.xlsx`.
// - Maneja error específico: "No se encontraron asistencias".
// ============================================================================
export const abrirModalReason = async () => {

    // Abre modal con plantilla de exportación de asistencias
    const modal = mostrarModal(htmlExportAsistencias);

    // Espera renderizado DOM antes de configurar eventos
    requestAnimationFrame(() => {

        // Elementos del modal
        const btnCerrar = modal.querySelector("#btnCerrarModalExport");
        const form = modal.querySelector("#formExportAsistencias");

        // Botón cerrar modal
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ===== MANEJO DE ENVÍO DEL FORMULARIO =====
        form.onsubmit = async (event) => {
            event.preventDefault(); // Previene recarga de página

            // Captura fechas del formulario
            const fechaInicio = modal.querySelector("#filtroFechaInicio").value;
            const fechaFin = modal.querySelector("#filtroFechaFin").value;

            // Validación: ambas fechas obligatorias
            if (!fechaInicio || !fechaFin) {
                error("Debes seleccionar ambas fechas");
                return;
            }

            // UX: loading + cierra modal
            loading("Exportando Aprendices");
            cerrarModal(modal);

            // Construye query params para el endpoint
            const params = new URLSearchParams({
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });

            // Endpoint específico para exportación por motivos/reason
            const endpoint = `asistencia/export/reason?${params.toString()}`;

            try {
                // Descarga archivo Excel como Blob
                const blob = await exportFile(endpoint);

                // ===== DESCARGA AUTOMÁTICA =====
                // Crea URL temporal del blob
                const blobUrl = URL.createObjectURL(blob);

                // Crea enlace invisible y fuerza descarga
                const link = document.createElement('a');
                link.href = blobUrl;
                // Nombre dinámico con rango de fechas
                link.download = `Asistencias_${fechaInicio}_a_${fechaFin}.xlsx`;

                // Simula click y limpia
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl); // Libera memoria

                // Confirma éxito al usuario
                cerrarModal(modal);
                success('Excel descargado correctamente');

            } catch (err) {
                cerrarModal(modal);

                // Manejo específico de errores del backend
                if (err.message.includes('No se encontraron asistencias')) {
                    error('No se encontraron asistencias en el rango de fechas seleccionado');
                } else {
                    error(err.message || "Error al descargar el Excel");
                }
            }
        };
    });
};
