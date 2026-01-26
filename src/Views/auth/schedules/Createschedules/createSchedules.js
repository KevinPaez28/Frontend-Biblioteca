import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearHorario from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";

export const abrirModalCrearHorario = async () => {
    // Evitar abrir más de un modal de crear horario
    if (document.querySelector("#formHorario")) return;

    const modal = mostrarModal(htmlCrearHorario);

    // ====== REFERENCIAS LOCALES AL MODAL ======
    const btnCerrar = modal.querySelector("#btnCerrarModal");
    const form = modal.querySelector("#formHorario");
    const selectDia = modal.querySelector("#selectDia");
    const selectTurno = modal.querySelector("#selectTurno");
    const seccionOpcional = modal.querySelector("#seccionOpcional"); // sección dinámica opcional

    // ====== BOTÓN CERRAR ======
    btnCerrar.addEventListener("click", () => cerrarModal(modal));

    // ====== EVENTOS DINÁMICOS ======
    selectTurno?.addEventListener("change", () => {
        if (seccionOpcional) {
            seccionOpcional.style.display = selectTurno.value === "Especial" ? "block" : "none";
        }
    });
    // ====== SUBMIT ======
    let enviando = false;

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (enviando) return;
        if (!validate.validarCampos(e)) return;

        enviando = true;

        const payload = { ...validate.datos };


        try {
            const response = await post("horarios/create", payload);

            if (!response || !response.success) {
                if (response?.errors?.length) {
                    response.errors.forEach(err => error(err));
                } else {
                    error(response?.message || "Error al crear el horario");
                }
                enviando = false;
                return;
            }

            form.reset();
            cerrarModal(modal);
            success(response.message || "Horario creado correctamente");

        } catch (err) {
            console.error(err);
            error("Ocurrió un error inesperado");
        }

        enviando = false;
    };

    form.removeEventListener("submit", handleSubmit); // limpieza por seguridad
    form.addEventListener("submit", handleSubmit);
};
