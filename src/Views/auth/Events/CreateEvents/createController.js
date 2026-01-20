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

        // ================= OBTENER ÁREAS =================
        try {
            const areas = await get("salas");

            areas.data.forEach(area => {
                const option = document.createElement("option");
                option.value = area.id;
                option.textContent = area.name;
                selectArea.append(option);
            });

        } catch (err) {
            console.error(err);
            error("No se pudieron cargar las áreas");
        }

        let enviando = false;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;

            const { fecha, hora, ...resto } = validate.datos;

            // 👉 Unimos fecha + hora (formato datetime)
            const payload = {
                ...resto,
                fecha: `${fecha}`,
                hora: `${hora}`,
                estado_id: 1
            };
            console.log(payload);
            
            try {
                enviando = true;

                const response = await post("eventos/create", payload);

                if (!response || !response.success) {
                    cerrarModal();
                    if (response?.errors?.length) {
                        response.errors.forEach(e => error(e));
                    } else {
                        cerrarModal();
                        error(response?.message || "Error al crear el evento");
                    }
                    enviando = false;
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
