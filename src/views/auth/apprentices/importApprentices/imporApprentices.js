import "../../../../components/models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { error, success, loading, closeAlert } from "../../../../helpers/alertas.js";
import { postFile } from "../../../../helpers/api.js";
import ApprenticesController from "../ApprenticesController.js";
import "../../../../styles/importDates/import.css";

// ============================================================================
// FUNCIÓN: importApprenties
// ============================================================================
// - Abre modal para seleccionar archivo Excel de aprendices.
// - Envía archivo al backend usando postFile("user/import").
// - Maneja duplicados (usuarios ya existentes) y errores genéricos.
// - Recarga el listado de aprendices tras importación exitosa.
// ============================================================================
export const importApprenties = () => {

    // Abre el modal con la plantilla HTML del formulario de importación
    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {

        // Referencias a elementos clave del modal
        const form = modal.querySelector("#formImportarAprendices");
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const inputArchivo = modal.querySelector("#inputArchivoExcel");

        // Botón cerrar modal
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false; // Previene múltiples envíos simultáneos

        // ===== MANEJO DEL ENVÍO DEL FORMULARIO =====
        form.onsubmit = async (event) => {
            event.preventDefault();
            if (enviando) return;

            // Valida que se haya seleccionado un archivo
            const archivo = inputArchivo.files[0];
            if (!archivo) {
                cerrarModal(modal);
                error("Debe seleccionar un archivo");
                return;
            }

            try {
                cerrarModal(modal);
                enviando = true;
                loading("Registrando aprendices...");

                // Envía archivo al endpoint de importación masiva
                const response = await postFile("user/import", archivo);

                closeAlert();

                if (!response || !response.success) {
                    cerrarModal(modal);
                    error(response?.message || "Error al importar aprendices");
                    enviando = false;
                    return;
                }

                // ===== MANEJO DE USUARIOS EXISTENTES =====
                const duplicados = response.data?.usuarios_existentes || [];
                if (duplicados.length > 0) {
                    error(
                        "Los siguientes documentos ya estaban registrados:\n" +
                        duplicados.map(u => u.documento).join(", ")
                    );
                } else {
                    success("Importación exitosa");
                }

                // Recarga el listado de aprendices con los nuevos datos
                await ApprenticesController();
                enviando = false;

            } catch (err) {
                console.error(err);
                closeAlert();
                error("Error inesperado al importar");
                enviando = false;
            }
        };
    });
};