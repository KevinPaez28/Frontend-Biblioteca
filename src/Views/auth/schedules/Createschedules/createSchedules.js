import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Styles/Schedules/SchedulesModal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearHorario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";

export const abrirModalCrearHorario = async () => {

    mostrarModal(htmlCrearHorario);

    // ESPERAMOS a que el modal ya esté pintado
    requestAnimationFrame(() => {

        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formHorario");

        btnCerrar.addEventListener("click", cerrarModal);
        form.addEventListener("submit", crearHorario);
    });
};

/* ===== CREAR HORARIO ===== */
const crearHorario = async (event) => {
    event.preventDefault();

    if (!validate.validarCampos(event)) return;

    const payload = { ...validate.datos };

    const response = await post("horarios/create", payload);

    if (!response.ok) {
        cerrarModal();
        error(response.message);
        return;
    }

    cerrarModal();
    success("Horario creado correctamente");
};
