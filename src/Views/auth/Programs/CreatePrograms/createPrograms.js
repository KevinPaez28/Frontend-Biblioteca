import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearPrograma from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import programasController from "../ProgramsController.js";

export const abrirModalCrearPrograma = async () => {

    mostrarModal(htmlCrearPrograma);

    requestAnimationFrame(() => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formPrograma");

        btnCerrar.addEventListener("click", cerrarModal);

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
                        response.errors.forEach(err => error(err));
                        cerrarModal();
                    } else {
                        error(response?.message || "Error al crear el programa");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal();
                success(response.message || "Programa creado correctamente");
                form.reset();
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
