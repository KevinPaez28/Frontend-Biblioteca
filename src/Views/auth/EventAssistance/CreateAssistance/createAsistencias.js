import { post, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearAsistencia from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import asistenciasController from "../AssitanceController.js";

export const abrirModalCrearAsistenciaEvento = async () => {

    mostrarModal(htmlCrearAsistencia);

    requestAnimationFrame(async () => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formAsistenciaEvento");

        const selectEvento = document.querySelector("#selectEvento");
        const selectFicha = document.querySelector("#selectFicha");

        btnCerrar.addEventListener("click", cerrarModal);

        /* ================= OBTENER DATOS ================= */

        const eventos = await get("eventos");
        const fichas = await get("ficha");

        // ===== RELLENAR SELECT EVENTOS =====
        eventos.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;
            selectEvento.append(op);
        });

        // ===== RELLENAR SELECT FICHAS =====
        fichas.data.forEach(f => {
            const op = document.createElement("option");
            op.value = f.id;
            op.textContent = f.ficha;
            selectFicha.append(op);
        });



        /* ================= SUBMIT ================= */
        let enviando = false;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true;

                const response = await post("asistencia/events/create", payload);

                if (!response || !response.success) {
                    cerrarModal();

                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        // Si message es un objeto con created/skipped
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

                cerrarModal();

                // Manejo correcto del success si message es objeto
                if (response?.message && typeof response.message === "object") {
                    const created = response.message.created?.join(', ') || 'Ninguno';
                    const skipped = response.message.skipped?.join(', ') || 'Ninguno';

                    success(`Asistencias creadas correctamente.\nUsuarios añadidos: ${created}\nUsuarios omitidos: ${skipped}`);
                } else {
                    success(response.message || "Asistencia registrada correctamente");
                }

                form.reset();
                asistenciasController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });

    });
};
