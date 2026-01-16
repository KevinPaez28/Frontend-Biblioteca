import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearMotivo from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import ReasonController from "../ReasonController.js";

export const abrirModalCrearMotivo = async () => {
    mostrarModal(htmlCrearMotivo);

    requestAnimationFrame(() => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formMotivo");

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;

            const payload = { 
                ...validate.datos,
                estados_id: 1
             };


            try {
                enviando = true;
                const response = await post("motivos/create", payload);
                
                if (!response || !response.success) {
                    cerrarModal();
                    if (response?.errors && response.errors.length > 0) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear el motivo");
                    }
                    enviando = false; // desbloqueamos si hay error
                    return;
                }
                form.reset();
                cerrarModal();
                success(response.message || "Motivo creado correctamente");
                ReasonController()
            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        });
    });
};
