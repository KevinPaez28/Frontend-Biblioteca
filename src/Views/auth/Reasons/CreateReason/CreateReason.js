import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearMotivo from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import ReasonController from "../ReasonController.js";

export const abrirModalCrearMotivo = async () => {

    const modal = mostrarModal(htmlCrearMotivo);

    requestAnimationFrame(() => {
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formMotivo");

        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

        form.onsubmit = async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;
            loading("Registrando Motivo");
            cerrarModal(modal);

            const payload = { 
                ...validate.datos,
                estados_id: 1
            };

            try {
                enviando = true;
                const response = await post("motivos/create", payload);
                
                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear el motivo");
                    }
                    enviando = false;
                    return;
                }

                form.reset();
                cerrarModal(modal);
                success(response.message || "Motivo creado correctamente");
                ReasonController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        };
    });
};
