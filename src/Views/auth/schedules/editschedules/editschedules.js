import { patch } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import"../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarHorario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import schedulesController from "../schedulesController.js";

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

        let enviando = false; // bandera para evitar envíos dobles

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return; 

            if (!validate.validarCampos(e)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true; // activamos bandera
                const response = await patch(`horarios/${horario.id}`, payload);

                if (!response || !response.success) {
                    if (response?.errors && response.errors.length > 0) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el horario");
                    }
                    enviando = false; // desbloqueamos si hay error
                    return;
                }

                cerrarModal();
                success(response.message || "Horario actualizado correctamente");
                form.reset();
                schedulesController();
                enviando = false; // desbloqueamos al terminar

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false; // desbloqueamos en caso de fallo
            }
        });
    });
};
