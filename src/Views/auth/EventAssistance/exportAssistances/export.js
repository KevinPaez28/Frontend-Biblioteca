import { post, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearAsistencia from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import asistenciasController from "../AssitanceController.js";


// ============================================================================
// FUNCIÓN PRINCIPAL: abrirModalCrearAsistenciaEvento
// ============================================================================
// Abre modal para crear asistencias masivas asociadas a un evento y ficha.
// Carga dinámicamente los select de eventos y fichas desde la API.
// Envía POST a endpoint asistencia/events/create.
// Maneja respuestas complejas con arrays created[] y skipped[].
// ============================================================================
export const abrirModalCrearAsistenciaEvento = async () => {

    const modal = mostrarModal(htmlCrearAsistencia);

    requestAnimationFrame(async () => {
        // Referencias a elementos del DOM
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formAsistenciaEvento");
        const selectEvento = modal.querySelector("#selectEvento");
        const selectFicha = modal.querySelector("#selectFicha");

        // Event listener para cerrar modal
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ================= OBTENER DATOS DINÁMICOS =================
        // Carga paralela de eventos y fichas
        const eventos = await get("eventos");
        const fichas = await get("ficha");

        // Rellenar select de eventos
        eventos.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;
            selectEvento.append(op);
        });

        // Rellenar select de fichas
        fichas.data.forEach(f => {
            const op = document.createElement("option");
            op.value = f.id;
            op.textContent = f.ficha;
            selectFicha.append(op);
        });

        // ================= MANEJO DEL FORMULARIO =================
        let enviando = false;

        form.onsubmit = async (event) => {           
            event.preventDefault();
            if (enviando) return;

            // Validación de campos requeridos
            if (!validate.validarCampos(event)) return;

            // Payload con datos validados del formulario
            const payload = { ...validate.datos };

            try {
                enviando = true;

                // Envía creación masiva de asistencias
                const response = await post("asistencia/events/create", payload);

                // Manejo de errores del backend
                if (!response || !response.success) {
                    cerrarModal(modal);

                    if (response?.errors?.length) {
                        // Errores de validación específicos
                        response.errors.forEach(err => error(err));
                    } else {
                        // Maneja mensaje complejo con created/skipped
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

                // Manejo de éxito complejo
                if (response?.message && typeof response.message === "object") {
                    const created = response.message.created?.join(', ') || 'Ninguno';
                    const skipped = response.message.skipped?.join(', ') || 'Ninguno';
                    success(`Asistencias creadas correctamente`);
                } else {
                    success(response.message || "Asistencia registrada correctamente");
                }

                // Reset formulario y recarga controlador
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
