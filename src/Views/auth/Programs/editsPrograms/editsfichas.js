import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarPrograma from "./index.html?raw"; // tu modal de programas
import { success, error } from "../../../../Helpers/alertas.js";
import programasController from "../ProgramsController.js";

export const editarModalPrograma = async (programa) => {
    mostrarModal(htmlEditarPrograma);

    requestAnimationFrame(async () => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formPrograma");

        // ===== PRECARGAR DATOS =====
        document.querySelector("#inputPrograma").value = programa.training_program  || "";

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false; // evita envíos dobles

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(e)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true;
                const response = await patch(`programa/${programa.id}`, payload);

                if (!response || !response.success) {
                    if (response?.errors?.length) {
                        cerrarModal();
                        response.errors.forEach(err => error(err));
                        cerrarModal();
                    } else {
                        error(response?.message || "Error al actualizar el programa");
                    }
                    enviando = false;
                    return;
                }

                form.reset();
                cerrarModal();
                success(response.message || "Programa actualizado correctamente");
                programasController(); // recarga la tabla
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
