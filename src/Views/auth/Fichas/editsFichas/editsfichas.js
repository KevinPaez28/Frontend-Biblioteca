import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarFicha from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import fichasController from "../FichasController.js";

export const editarmodalFicha = async (ficha) => {
    const modal = mostrarModal(htmlEditarFicha);

    requestAnimationFrame(async () => {

        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formFicha");
        const inputFicha = modal.querySelector("#inputFicha");
        const selectPrograma = modal.querySelector("#inputPrograma");

        // ===== PRECARGAR DATOS =====
        inputFicha.value = ficha.ficha || "";

        // ===== CARGAR PROGRAMAS =====
        const programas = await get("programa");
        if (programas?.data?.length) {
            programas.data.forEach(p => {
                const option = document.createElement("option");
                option.value = p.id;
                option.textContent = p.training_program;
                if (ficha.programa?.id === p.id) option.selected = true;
                selectPrograma.appendChild(option);
            });
        }

        // ===== CERRAR =====
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

        // ===== SUBMIT =====
      form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(e)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true;
                const response = await patch(`ficha/${ficha.id}`, payload);

                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar la ficha");
                    }
                    enviando = false;
                    return;
                }
                
                cerrarModal(modal);
                success(response.message || "Ficha actualizada correctamente");
                form.reset();
                fichasController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        });
    });
};
