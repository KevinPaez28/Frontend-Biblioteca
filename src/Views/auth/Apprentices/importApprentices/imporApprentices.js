import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { error, success, loading, closeAlert } from "../../../../Helpers/alertas";
import { postFile } from "../../../../Helpers/api";
import ApprenticesController from "../ApprenticesController";
import "../../../../Styles/importDates/import.css";


// ============================================================================
// FUNCIÓN: importApprenties
// ============================================================================
// - Abre modal para seleccionar archivo Excel de aprendices.
// - Envía archivo al backend usando postFile("user/import").
// - Maneja errores específicos: duplicados (documentos ya existentes) + otros.
// - Recarga el listado de aprendices tras importación exitosa.
// ============================================================================
export const importApprenties = () => {

    // Abre el modal con la plantilla HTML del formulario de importación
    const modal = mostrarModal(htmlContent);

    // Espera a que el DOM esté completamente renderizado
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
            event.preventDefault(); // Evita recarga de página
            if (enviando) return; // Bloquea doble envío

            // Valida que se haya seleccionado un archivo
            const archivo = inputArchivo.files[0];
            if (!archivo) {
                error("Debe seleccionar un archivo");
                return;
            }

            try {
                enviando = true;

                // Cierra modal y muestra loading
                cerrarModal(modal);
                loading("Registrando aprendices...");

                // Envía archivo al endpoint de importación masiva
                const response = await postFile("user/import", archivo);

                // Cierra alerta de loading
                closeAlert();

                // ===== MANEJO DE ERRORES DEL BACKEND =====
                if (!response || !response.success) {

                    if (response?.errors && response.errors.length > 0) {
                        cerrarModal(modal);

                        // Extrae documentos duplicados (ya existentes en BD)
                        const duplicados = response.errors
                            .filter(err => err.error.includes("Duplicate entry"))
                            .map(err => {
                                // Extrae el número de documento del mensaje de error SQL
                                const match = err.error.match(/Duplicate entry '([^']+)'/);
                                return match ? match[1] : "desconocido";
                            });

                        // Muestra duplicados en un solo mensaje legible
                        if (duplicados.length > 0) {
                            error(`Los siguientes documentos ya están registrados:\n${duplicados.join(", ")}`);
                        }

                        // Muestra errores de validación/formato (no duplicados)
                        response.errors
                            .filter(err => !err.error.includes("Duplicate entry"))
                            .forEach(err => error(err.error));

                    } else {
                        // Error genérico del servidor
                        cerrarModal(modal);
                        error(response?.message || "Error al importar aprendices");
                    }

                    enviando = false;
                    return;
                }

                // ===== IMPORTACIÓN EXITOSA =====
                cerrarModal(modal);
                success("Importación exitosa");
                // Recarga el listado de aprendices con los nuevos datos
                await ApprenticesController();
                enviando = false;

            } catch (err) {
                // Errores inesperados: red, timeout, servidor caído, etc.
                console.error(err);
                closeAlert();
                error("Error inesperado al importar");
                enviando = false;
            }
        };
    });
};
