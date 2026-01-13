import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearEvento from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import EventsController from "../eventsController.js";

export const abrirModalCrearEvento = async () => {

    mostrarModal(htmlCrearEvento);

    requestAnimationFrame(async () => {

        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formEvento");
        const selectArea = document.querySelector("#selectArea");

        btnCerrar.addEventListener("click", cerrarModal);

        const areas = await get("salas");
        console.log(areas);

        // ================= RELLENAR SELECT DE ÁREAS =================
        areas.data.forEach(a => {
            const op = document.createElement("option");
            op.value = a.id;
            op.textContent = a.name;
            selectArea.append(op);
        });

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

                const response = await post("eventos/create", payload);
                console.log(response);

                if (!response || !response.success) {
                    if (response?.errors && response.errors.length > 0) {
                        cerrarModal();
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear el usuario");
                    }
                    enviando = false; // desbloqueamos si hay error
                    return;
                }
        
                cerrarModal();
                success(response.message || "Evento creado correctamente");
                EventsController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        });
    });
};
