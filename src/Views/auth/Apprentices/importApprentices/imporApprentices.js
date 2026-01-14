import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { error, success, loading, closeAlert } from "../../../../Helpers/alertas";
import { postFile } from "../../../../Helpers/api";
import ApprenticesController from "../ApprenticesController";
import "../../../../Styles/importDates/import.css";

export const importApprenties = () => {

    mostrarModal(htmlContent);

    requestAnimationFrame(() => {

        const form = document.querySelector("#formImportarAprendices");
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const inputArchivo = document.querySelector("#inputArchivoExcel");

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false;

        // ===== SUBMIT =====
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;

            const archivo = inputArchivo.files[0];
            if (!archivo) {
                error("Debe seleccionar un archivo");
                return;
            }

            try {
                enviando = true;

                cerrarModal();
                loading("Registrando aprendices...");

                const response = await postFile("user/import", archivo);
                console.log(response);
                
                closeAlert();

                // ===== Manejo de errores =====
                if (!response || !response.success) {

                    if (response?.errors && response.errors.length > 0) {
                        cerrarModal();

                        // Separar duplicados y otros errores
                        const duplicados = response.errors
                            .filter(err => err.error.includes("Duplicate entry"))
                            .map(err => {
                                const match = err.error.match(/Duplicate entry '([^']+)'/); // <-- solo captura el documento
                                return match ? match[1] : "desconocido";
                            });

                        if (duplicados.length > 0) {
                            error(`Los siguientes documentos ya están registrados:\n${duplicados.join(", ")}`);
                        }

                        // Otros errores distintos a duplicados
                        response.errors
                            .filter(err => !err.error.includes("Duplicate entry"))
                            .forEach(err => error(err.error));

                    } else {
                        cerrarModal();
                        error(response?.message || "Error al importar aprendices");
                    }

                    enviando = false;
                    return;
                }

                // ===== Importación exitosa =====
                cerrarModal();
                success(response.message || "Importación exitosa");
                await ApprenticesController();
                enviando = false;

            } catch (err) {
                console.error(err);
                closeAlert();
                error("Error inesperado al importar");
                enviando = false;
            }
        });
    });
};
