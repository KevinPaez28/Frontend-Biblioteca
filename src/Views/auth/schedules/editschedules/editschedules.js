import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Schedules/SchedulesModal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarHorario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";

export const editarmodalHorario = (horario) => {

    mostrarModal(htmlEditarHorario);

    requestAnimationFrame(() => {

        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formHorario");

        // ===== PRECARGAR DATOS =====
        document.querySelector("#inputNombre").value = horario.horario;
        document.querySelector("#inputInicio").value = horario.start_time_24 ?? horario.start_time;
        document.querySelector("#inputFin").value = horario.end_time_24 ?? horario.end_time;
        document.querySelector("#inputJornada").value = horario.jornada;


        btnCerrar.addEventListener("click", cerrarModal);
        form.addEventListener("submit", (e) => editarHorario(e, horario.id));
    });
};

/* ===== EDITAR HORARIO ===== */
const editarHorario = async (event, id) => {
    event.preventDefault();

    if (!validate.validarCampos(event)) return;

    const payload = {
        ...validate.datos,
        id
    };

    const response = await pacth("horarios/{id}", payload);

    if (!response.ok) {
        error(response.message);
        return;
    }

    cerrarModal();
    success("Horario actualizado correctamente");
};
