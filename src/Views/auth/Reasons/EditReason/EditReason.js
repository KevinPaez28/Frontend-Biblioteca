import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import reasonsController from "../ReasonController.js";

export const editmodalreason = (item) => {
    mostrarModal(htmlContent);

    requestAnimationFrame(async () => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formReason"); // 👈 tu form del modal
        const inputNombre = document.querySelector("#modalInputNombreMotivo");
        const inputDescripcion = document.querySelector("#modalInputDescripcion");
        const selectEstado = document.querySelector("#modalInputActivo");

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

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false; // misma bandera

        // ===== ENVIAR FORM =====
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(e)) return;

            const payload = {
                ...validate.datos,
                estados_id: selectEstado.value
            };

            try {
                enviando = true;

                const response = await patch(`motivos/${item.id}`, payload);
                console.log(response);
                
                if (!response || !response.success) {
                    if (response?.errors && response.errors.length > 0) {
                        cerrarModal();
                        response.errors.forEach(err => error(err));
                    } else {
                        cerrarModal();
                        error(response?.message || "Error al actualizar el motivo");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal();
                success(response.message || "Motivo actualizado correctamente");
                form.reset();
                reasonsController(); // refresca tabla
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
