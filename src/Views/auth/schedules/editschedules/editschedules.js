import { patch } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarHorario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import schedulesController from "../schedulesController.js";

export const editarmodalHorario = (horario) => {
    // Evitar abrir múltiples modales
    if (document.querySelector("#formHorario")) return;

    const modal = mostrarModal(htmlEditarHorario);

    requestAnimationFrame(() => {
        // ================== ELEMENTOS DEL MODAL ==================
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formHorario");
        const inputNombre = modal.querySelector("#inputNombre");
        const inputInicio = modal.querySelector("#inputInicio");
        const inputFin = modal.querySelector("#inputFin");
        const inputJornada = modal.querySelector("#inputJornada");

        if (!btnCerrar || !form || !inputNombre || !inputInicio || !inputFin || !inputJornada) {
            console.error("No se encontraron todos los elementos del modal");
            cerrarModal(modal);
            return;
        }

        // ================== PRECARGAR DATOS ==================
        inputNombre.value = horario.horario;
        inputInicio.value = horario.start_time_24 ?? horario.start_time;
        inputFin.value = horario.end_time_24 ?? horario.end_time;
        inputJornada.value = horario.jornada;

        // ================== CERRAR MODAL ==================
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ================== SUBMIT ==================
        let enviando = false;

        const handleSubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (enviando) return;
            if (!validate.validarCampos(e)) return;

            enviando = true;

            const payload = { ...validate.datos };

            try {
                const response = await patch(`horarios/${horario.id}`, payload);

                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el horario");
                    }
                    enviando = false;
                    return;
                }
                

                form.reset();
                cerrarModal(modal);
                success(response.message || "Horario actualizado correctamente");
                schedulesController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        };

        form.removeEventListener("submit", handleSubmit); // limpieza por seguridad
        form.addEventListener("submit", handleSubmit);
    });
};
