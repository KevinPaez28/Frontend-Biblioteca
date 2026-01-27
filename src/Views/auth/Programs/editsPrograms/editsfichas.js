import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarPrograma from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import programasController from "../ProgramsController.js";

export const editarModalPrograma = async (programa) => {

    const modal = mostrarModal(htmlEditarPrograma);

    requestAnimationFrame(async () => {
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formPrograma");

        // ===== PRECARGAR DATOS =====
        modal.querySelector("#inputPrograma").value =
            programa.training_program || "";

        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(e)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true;
                const response = await patch(`programa/${programa.id}`, payload);

                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el programa");
                    }
                    enviando = false;
                    return;
                }

                form.reset();
                cerrarModal(modal);
                success(response.message || "Programa actualizado correctamente");
                programasController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
