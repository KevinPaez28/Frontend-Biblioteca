import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import reasonsController from "../ReasonController.js";

export const editmodalreason = (item) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(async () => {
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formReason");
        const inputNombre = modal.querySelector("#modalInputNombreMotivo");
        const inputDescripcion = modal.querySelector("#modalInputDescripcion");
        const selectEstado = modal.querySelector("#modalInputActivo");

        // ===== PRECARGAR DATOS =====
        inputNombre.value = item.name;
        inputDescripcion.value = item.description;

        // ===== RELLENAR SELECT DE ESTADOS =====
        const estados = await get("estadoMotivos");
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;

            if (e.id === item.state_reason_id) {
                op.selected = true;
            }

            selectEstado.append(op);
        });

        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

        // ===== ENVIAR FORM =====
        form.onsubmit = async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;

            loading("Actualizando Motivo");
            cerrarModal(modal);
            const payload = {
                ...validate.datos,
                estados_id: selectEstado.value
            };
            
            try {
                enviando = true;
                
                const response = await patch(`motivos/${item.id}`, payload);
                
                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el motivo");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal(modal);
                success(response.message || "Motivo actualizado correctamente");
                form.reset();
                reasonsController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        };
    });
};
