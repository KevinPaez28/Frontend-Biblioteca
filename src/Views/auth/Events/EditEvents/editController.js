import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import EventsController from "../eventsController.js";

export const editModalEvento = (item) => {
    mostrarModal(htmlContent);

    requestAnimationFrame(async () => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formEvento");

        const inputNombre = document.querySelector("#modalInputNombreEvento");
        const inputEncargado = document.querySelector("#modalInputEncargado");
        const inputFecha = document.querySelector("#modalInputFecha");
        const inputHoraInicio = document.querySelector("#modalInputHoraInicio");
        const inputHoraFin = document.querySelector("#modalInputHoraFin");
        const selectArea = document.querySelector("#modalSelectArea");
        const selectEstado = document.querySelector("#modalSelectEstado");

        // ===== PRECARGAR DATOS =====
        inputNombre.value = item.name;
        inputEncargado.value = item.mandated;
        inputFecha.value = item.date;
        inputHoraInicio.value = item.start_time;
        inputHoraFin.value = item.end_time;

        // ===== RELLENAR ÁREAS =====
        const areas = await get("salas");
        areas.data.forEach(a => {
            const op = document.createElement("option");
            op.value = a.id;
            op.textContent = a.name;

            if (a.id === item.room?.id) op.selected = true;
            selectArea.append(op);
        });

        // ===== RELLENAR ESTADOS =====
        const estados = await get("estadoEventos");
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;

            if (e.id === item.state?.id) op.selected = true;
            selectEstado.append(op);
        });

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false;

        // ===== SUBMIT =====
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(e)) return;

            const payload = {
                ...validate.datos,
                hora_inicio: inputHoraInicio.value,
                hora_fin: inputHoraFin.value,
                sala_id: selectArea.value,
                estado_id: selectEstado.value
            };

            try {
                enviando = true;

                const response = await patch(`eventos/${item.id}`, payload);

                if (!response || response.error) {
                    error(response?.message || "Error al actualizar el evento");
                    enviando = false;
                    return;
                }

                cerrarModal();
                success(response.message || "Evento actualizado correctamente");
                EventsController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        });
    });
};
