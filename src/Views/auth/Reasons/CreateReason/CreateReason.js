import { post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearMotivo from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import ReasonController from "../ReasonController.js";

/**
 * @description Abre un modal para crear un nuevo motivo.
 */
export const abrirModalCrearMotivo = async () => {

    // Muestra el modal utilizando la función y el contenido HTML importados.
    const modal = mostrarModal(htmlCrearMotivo);

    // Utiliza requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(() => {
        // Obtiene referencias al botón de cerrar y al formulario dentro del modal.
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formMotivo");

        // Agrega un event listener al botón de cerrar para cerrar el modal.
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable para prevenir el envío múltiple del formulario.
        let enviando = false;

        // Maneja el evento de envío del formulario.
        form.onsubmit = async (event) => {
            // Previene el comportamiento de envío del formulario por defecto.
            event.preventDefault();
            // Si ya se está enviando, previene otro envío.
            if (enviando) return;

            // Valida los campos del formulario.
            if (!validate.validarCampos(event)) return;

            // Muestra un mensaje de carga.
            loading("Registrando Motivo");
            // Cierra el modal.
            cerrarModal(modal);

            // Crea un objeto payload con los datos del formulario y el estado por defecto.
            const payload = {
                ...validate.datos,
                estados_id: 1
            };

            try {
                // Establece la variable enviando a true para prevenir el envío múltiple.
                enviando = true;
                // Envía la petición a la API para crear el motivo.
                const response = await post("motivos/create", payload);

                // Si la respuesta no es exitosa.
                if (!response || !response.success) {
                    // Cierra el modal.
                    cerrarModal(modal);
                    // Si hay errores en la respuesta, los muestra.
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        // Si no hay errores específicos, muestra un mensaje genérico.
                        error(response?.message || "Error al crear el motivo");
                    }
                    // Restablece la variable enviando a false para permitir futuros envíos.
                    enviando = false;
                    return;
                }

                // Limpia el formulario.
                form.reset();
                // Cierra el modal.
                cerrarModal(modal);
                // Muestra un mensaje de éxito.
                success(response.message || "Motivo creado correctamente");
                // Refresca la lista de motivos.
                ReasonController();

            } catch (err) {
                // Captura y muestra los errores.
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            // Restablece la variable enviando a false.
            enviando = false;
        };
    });
};
