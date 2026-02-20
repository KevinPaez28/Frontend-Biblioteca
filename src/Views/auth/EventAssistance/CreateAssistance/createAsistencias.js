import { post, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearAsistencia from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import asistenciasController from "../AssitanceController.js";


// ============================================================================
// FUNCIÓN: abrirModalCrearAsistenciaEvento
// ============================================================================
// - Modal para **crear asistencias masivas por evento y ficha**.
// - Carga dinámicamente eventos y fichas en selects.
// - Envía POST a `asistencia/events/create`.
// - Maneja **response compleja**: `created[]` + `skipped[]`.
// ============================================================================
export const abrirModalCrearAsistenciaEvento = async () => {

    // Abre modal con formulario de creación de asistencias
    const modal = mostrarModal(htmlCrearAsistencia);

    requestAnimationFrame(async () => {
        // ===== REFERENCIAS DOM =====
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formAsistenciaEvento");

        const selectEvento = modal.querySelector("#selectEvento");
        const selectFicha = modal.querySelector("#selectFicha");

        // Botón cerrar modal
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        /* ================= OBTENER DATOS DINÁMICOS ================= */

        // Carga paralela de eventos y fichas
        const eventos = await get("eventos");
        const fichas = await get("ficha");

        // ===== RELLENAR SELECT EVENTOS =====
        eventos.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name; // Nombre del evento
            selectEvento.append(op);
        });

        // ===== RELLENAR SELECT FICHAS =====
        fichas.data.forEach(f => {
            const op = document.createElement("option");
            op.value = f.id;
            op.textContent = f.ficha; // Número de ficha
            selectFicha.append(op);
        });

        /* ================= MANEJO SUBMIT ================= */
        let enviando = false; // Previene doble envío

        form.onsubmit = async (event) => { 
            event.preventDefault();
            if (enviando) return;

            // Valida todos los campos del formulario
            if (!validate.validarCampos(event)) return;

            // Payload con datos validados del formulario
            const payload = { ...validate.datos };

            try {
                enviando = true;

                // POST masivo: crea asistencias para toda la ficha en el evento
                const response = await post("asistencia/events/create", payload);

                // ===== MANEJO DE ERRORES COMPLEJOS =====
                if (!response || !response.success) {
                    cerrarModal(modal);

                    if (response?.errors?.length) {
                        // Errores de validación individuales
                        response.errors.forEach(err => error(err));
                    } else {
                        // Response con created/skipped (importación parcial)
                        if (response?.message && typeof response.message === "object") {
                            const created = response.message.created?.join(', ') || 'Ninguno';
                            const skipped = response.message.skipped?.join(', ') || 'Ninguno';

                            error(`No se pudo crear algunas asistencias.\nIntentadas: ${created}\nOmitidas: ${skipped}`);
                        } else {
                            error(response?.message || "Error al registrar la asistencia");
                        }
                    }

                    enviando = false;
                    return;
                }

                cerrarModal(modal);

                // ===== MANEJO DE ÉXITO COMPLEJO =====
                if (response?.message && typeof response.message === "object") {
                    const created = response.message.created?.join(', ') || 'Ninguno';
                    const skipped = response.message.skipped?.join(', ') || 'Ninguno';

                    // Muestra resumen de creación masiva
                    success(`Asistencias creadas correctamente`)
                } else {
                    success(response.message || "Asistencia registrada correctamente");
                }

                // Limpia y recarga vista
                form.reset();
                asistenciasController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        };
    });
};
