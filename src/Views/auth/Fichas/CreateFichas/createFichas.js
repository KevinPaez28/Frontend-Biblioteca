import { post, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearFicha from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import fichasController from "../FichasController.js";

export const abrirModalCrearFicha = async () => {

    mostrarModal(htmlCrearFicha);

    requestAnimationFrame(async () => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formFicha");
        const inputFicha = document.querySelector("#inputFicha");
        const selectPrograma = document.querySelector("#inputPrograma");

        // ===== CARGAR PROGRAMAS DINÁMICAMENTE =====
        const programas = await get("programa");
        selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
        if (programas?.data?.length) {
            programas.data.forEach(p => {
                const op = document.createElement("option");
                op.value = p.id;
                op.textContent = p.training_program;
                selectPrograma.append(op);
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
                const response = await post("ficha/create", payload);

                if (!response || !response.success) {
                    cerrarModal();
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear la ficha");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal();
                success(response.message || "Ficha creada correctamente");
                form.reset();
                fichasController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
