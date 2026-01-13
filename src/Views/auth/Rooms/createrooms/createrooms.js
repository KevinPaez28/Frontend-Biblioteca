import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearArea from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import AreasController from "../roomsController.js";

export const abrirModalCrearArea = async () => {
    mostrarModal(htmlCrearArea);

    requestAnimationFrame(() => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formArea");

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;

            const payload = {
                ...validate.datos,
                estado_id: 1
            };

            try {
                enviando = true;

                const response = await post("salas/create", payload);
                console.log(response);

                if (!response || !response.success) {
                    if (response?.errors && response.errors.length > 0) {
                        cerrarModal();
                        response.errors.forEach(err => error(err));
                    } else {
                        cerrarModal();
                        error(response?.message || "Error al crear el área");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal();
                success(response.message || "Área creada correctamente");
                AreasController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        });
    });
};
