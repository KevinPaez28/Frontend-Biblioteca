import { post, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearFicha from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import fichasController from "../FichasController.js";

export const abrirModalCrearFicha = async () => {
    if (document.querySelector("#formFicha")) return;

    const modal = mostrarModal(htmlCrearFicha);

    requestAnimationFrame(async () => {

        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formFicha");
        const selectPrograma = modal.querySelector("#inputPrograma");

        // ===== CARGAR PROGRAMAS =====
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

        // ===== CERRAR =====
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ===== SUBMIT =====
        let enviando = false;

        form.onsubmit = async (event) => {           
            event.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(event)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true;
                cerrarModal(modal);
                loading("Creando ficha...");

                const response = await post("ficha/create", payload);

                if (!response || !response.success) {
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear la ficha");
                    }
                    enviando = false;
                    return;
                }

                success(response.message || "Ficha creada correctamente");
                form.reset();
                fichasController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        };
    });
};
