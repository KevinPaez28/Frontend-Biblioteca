import { post, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearJornada from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import shiftsController from "../shiftsController.js";

export const abrirModalCrearJornada = async () => {

    mostrarModal(htmlCrearJornada);

    requestAnimationFrame(async () => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formJornada");
        const inputNombre = document.querySelector("#inputNombre");
        const selectHorario = document.querySelector("#selectHorario");

        // ===== CARGAR HORARIOS DINÁMICAMENTE =====
        const horarios = await get("horarios");
        console.log(horarios);
        
        selectHorario.innerHTML = `<option value="">Seleccione un horario</option>`;

        if (horarios?.data?.length) {
            horarios.data.forEach(h => {
                const op = document.createElement("option");
                op.value = h.id;
                op.textContent = `${h.start_time} - ${h.end_time}`;
                selectHorario.append(op);
            });
        }

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true;
                const response = await post("jornadas/create", payload);

                if (!response || !response.success) {
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                        cerrarModal();
                    } else {
                        error(response?.message || "Error al crear la jornada");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal();
                success(response.message || "Jornada creada correctamente");
                form.reset();
                shiftsController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
