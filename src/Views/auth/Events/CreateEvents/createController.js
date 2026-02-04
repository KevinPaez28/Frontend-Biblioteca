import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearEvento from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import EventsController from "../eventsController.js";

export const abrirModalCrearEvento = async () => {

    // ================== MOSTRAR MODAL ==================
    const modal = mostrarModal(htmlCrearEvento);

    requestAnimationFrame(async () => {

        // ================== CONSTANTES DEL MODAL ==================
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formEvento");
        const selectArea = modal.querySelector("#selectArea");

        // ================== BOTÓN CERRAR ==================
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ================== BANDERA DE ENVÍO ==================
        let enviando = false;

        // ================== EVENTO SUBMIT ==================
        form.onsubmit = async (event) => {           
            event.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(event)) return;

            loading("Creando evento");
            cerrarModal(modal);

            const { fecha, hora, ...resto } = validate.datos;

            const payload = {
                ...resto,
                fecha: `${fecha}`,
                hora: `${hora}`,
                estado_id: 1
            };

            try {
                enviando = true;
                const response = await post("eventos/create", payload);

                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear el evento");
                    }
                    enviando = false;
                    return;
                }

                form.reset();
                cerrarModal(modal);
                success(response.message || "Evento creado correctamente");
                EventsController();
            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        };

        // ================== CARGA DE DATOS DINÁMICOS ==================
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

    });
};
