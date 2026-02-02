import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearPrograma from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import programasController from "../ProgramsController.js";

export const abrirModalCrearPrograma = async () => {

    const modal = mostrarModal(htmlCrearPrograma);

    requestAnimationFrame(() => {
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formPrograma");

        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

      form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true;
                const response = await post("programa/create", payload);

                if (!response || !response.success) {
                    if (response?.errors?.length) {
                        cerrarModal(modal);
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear el programa");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal(modal);
                form.reset();
                success(response.message || "Programa creado correctamente");
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
