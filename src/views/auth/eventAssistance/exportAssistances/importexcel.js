import { exportFile, get } from "../../../../helpers/api.js";
import "../../../../components/models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../helpers/modalManagement.js";
import htmlExportAsistencias from "./index.html?raw";
import { error, loading, success } from "../../../../helpers/alertas.js";

// ============================================================================
// FUNCIÓN PRINCIPAL: abrirModalCrearAsistenciaEvento
// ============================================================================
// Abre modal para crear asistencias masivas asociadas a un evento y ficha.
// Carga dinámicamente los select de eventos y fichas desde la API.
// Envía POST a endpoint asistencia/events/create.
// Maneja respuestas complejas con arrays created[] y skipped[].
// ============================================================================
export const abrirModalExportAsistencias = async () => {

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
            const endpoint = `asistencia/export/event?${params.toString()}`;

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

