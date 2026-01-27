import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import roomsController from "../roomsController.js";

export const editmodalreason = (item) => {
    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(async () => {
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formRoom");
        const inputNombre = modal.querySelector("#modalInputNombreSala");
        const inputDescripcion = modal.querySelector("#modalInputDescripcion");
        const selectEstado = modal.querySelector("#modalInputActivo");

        // ===== PRECARGAR DATOS =====
        inputNombre.value = item.name;
        inputDescripcion.value = item.description;

        // ===== RELLENAR SELECT DE ESTADOS =====
        const estados = await get("estadosalas");
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;

            if (e.id === item.state_room_id) {
                op.selected = true;
            }

            selectEstado.append(op);
        });

        // CIERRE CORRECTO DEL MODAL
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(e)) return;
            loading("Modificando Motivo");
            cerrarModal(modal);
            const payload = {
                ...validate.datos,
                estado_sala: selectEstado.value
            };

            try {
                enviando = true;

                const response = await patch(`salas/${item.id}`, payload);

                if (!response || !response.success) {
                    if (response?.errors && response.errors.length > 0) {
                        response.errors.forEach(err => error(err));
                        cerrarModal(modal);
                    } else {
                        error(response?.message || "Error al actualizar el horario");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal(modal);
                success(response.message || "Sala actualizada correctamente");
                form.reset();
                roomsController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
