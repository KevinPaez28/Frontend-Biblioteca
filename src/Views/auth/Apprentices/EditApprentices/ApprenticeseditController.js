import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import ApprenticesController from "../ApprenticesController.js";

export const editModalAprendiz = (item) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(async () => {

        const form = document.querySelector("#formAprendiz");
        const btnCerrar = document.querySelector("#btnCerrarModal");
        btnCerrar.addEventListener("click", cerrarModal);
        
        const inputDocumento = document.querySelector("#modalInputDocumento");
        const inputNombre = document.querySelector("#modalInputNombre");
        const inputApellido = document.querySelector("#modalInputApellido");
        const inputTelefono = document.querySelector("#modalInputTelefono");
        const inputCorreo = document.querySelector("#modalInputCorreo");

        const inputFicha = document.querySelector("#modalInputFicha");
        const inputPrograma = document.querySelector("#modalInputPrograma");

        const selectEstado = document.querySelector("#modalSelectEstado");

        // ===== PRECARGA =====
        inputDocumento.value = item.document;
        inputNombre.value = item.first_name;
        inputApellido.value = item.last_name;
        inputTelefono.value = item.phone_number;
        inputCorreo.value = item.email;

        inputFicha.value = item.ficha|| "—";
        inputPrograma.value = item.programa|| "—";

        // ===== ESTADOS =====
        const estados = await get("EstadoAprendices");

        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;

            if (e.name === item.estado) {
                op.selected = true;
            }

            selectEstado.append(op);
        });


        let enviando = false;

        // ===== SUBMIT =====
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(e)) return;

            const payload = {
                ...validate.datos,
                status_id: selectEstado.value
            };

            try {
                enviando = true;

                const response = await patch(`user/${item.id}`, payload);

                if (!response || !response.success) {
                    if (response?.errors && response.errors.length > 0) {
                        cerrarModal();
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar la sala");
                    }
                    enviando = false;
                    return;
                }
                cerrarModal();
                success("Aprendiz actualizado correctamente");
                ApprenticesController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Error inesperado");
                enviando = false;
            }
        });
    });
};
