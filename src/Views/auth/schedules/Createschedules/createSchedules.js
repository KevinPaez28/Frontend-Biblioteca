import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import"../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearHorario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";

export const abrirModalCrearHorario = async () => {

    mostrarModal(htmlCrearHorario);

    // ESPERAMOS a que el modal ya esté pintado
    requestAnimationFrame(() => {

        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formHorario");

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false; // bandera para evitar envíos dobles

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (enviando) return; // si ya se está enviando, no hacemos nada

            if (!validate.validarCampos(event)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true; // activamos bandera
                const response = await post("horarios/create", payload);
                console.log(response);
                
                // ===== Manejo de respuesta según success =====
                if (!response.success) {
                    cerrarModal();
                    error(response.message || "Error al crear el horario");
                    enviando = false;
                    return;
                }
                
                cerrarModal();
                success(response.message || "Horario creado correctamente");
            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false; // liberamos bandera
        });
    });
};
