import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import { get, patch } from "../../../../Helpers/api.js";
import html from "./editShifts.html?raw";
import "../../../../Styles/shifts/shiftsModal.css";
import { error, success } from "../../../../Helpers/alertas.js";
import shiftsController from "../shiftsController.js";

export const editarmodalHorario = async (jornada) => {
    console.log(jornada);

    mostrarModal(html);

    const horariosContainer = document.getElementById("horariosContainer");
    const btnCerrarModal = document.getElementById("btnCerrarModal");
    const btnGuardarAsignacion = document.getElementById("btnGuardarAsignacion");

    horariosContainer.innerHTML = "";

    const res = await get("horarios");

    if (res && res.data && res.data.length > 0) {

        res.data.forEach((item) => {

            // ===== CARD =====
            const label = document.createElement("label");
            label.classList.add("horario-card");

            // ===== RADIO =====
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "horario_id";
            radio.classList.add("horario-card__check");
            radio.value = item.id;

            // ===== INFO =====
            const info = document.createElement("div");
            info.classList.add("horario-card__info");

            const nombre = document.createElement("p");
            nombre.classList.add("horario-card__title");
            nombre.textContent = item.name;

            const horas = document.createElement("p");
            horas.classList.add("horario-card__time");
            horas.textContent = `${item.start_time} - ${item.end_time}`;

            info.appendChild(nombre);
            info.appendChild(horas);

            label.appendChild(radio);
            label.appendChild(info);

            horariosContainer.appendChild(label);
        });

    } else {
        const p = document.createElement("p");
        p.textContent = "No hay horarios registrados";
        horariosContainer.appendChild(p);
    }

    // ===== CERRAR =====
    btnCerrarModal.addEventListener("click", cerrarModal);

    // ===== GUARDAR =====
    btnGuardarAsignacion.addEventListener("click", async () => {

        const seleccionado = document.querySelector(
            ".horario-card__check:checked"
        );

        if (!seleccionado) {
            error("Debes seleccionar un horario");
            return;
        }

        try {
            const response = await patch(`jornadas/edit/${jornada.id}`, {
                nombre: jornada.jornada,
                horario_id: seleccionado.value
            });
            if (!response || !response.success) {
                if (response?.errors && response.errors.length > 0) {
                    cerrarModal();
                    response.errors.forEach(err => error(err));
                } else {
                    cerrarModal();
                    error(response?.message || "Error al actualizar la jornada");
                }
                return;
            }

            cerrarModal();
            shiftsController()
            success(response.message);

        } catch (err) {
            console.error(err);
            error("Ocurrió un error inesperado");
        }
    });
};
