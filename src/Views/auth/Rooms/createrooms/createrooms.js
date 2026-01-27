import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearArea from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import AreasController from "../roomsController.js";

export const abrirModalCrearArea = async () => {

    const modal = mostrarModal(htmlCrearArea); 

    requestAnimationFrame(() => {

        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formArea");

        if (!form) return;

        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;
            loading("Registrando Area");
            cerrarModal(modal);
            const payload = {
                ...validate.datos,
                estado_id: 1
            };

            try {
                enviando = true;

                const response = await post("salas/create", payload);

                if (!response || !response.success) {

                    cerrarModal(modal);

                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear el área");
                    }

                    enviando = false;
                    return;
                }
                form.reset();
                cerrarModal(modal);
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
