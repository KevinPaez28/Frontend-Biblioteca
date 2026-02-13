import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import reasonsController from "../ReasonController.js";

/**
 * @description Function to display and handle the modal for editing a reason.
 * @param {object} item - The reason object containing the data to be edited.
 */
export const editmodalreason = (item) => {

    // Show the modal using the imported function and HTML content
    const modal = mostrarModal(htmlContent);

    // Use requestAnimationFrame to ensure the modal is rendered before manipulating it
    requestAnimationFrame(async () => {
        // Get references to the modal's elements
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formReason");
        const inputNombre = modal.querySelector("#modalInputNombreMotivo");
        const inputDescripcion = modal.querySelector("#modalInputDescripcion");
        const selectEstado = modal.querySelector("#modalInputActivo");

        // ===== PRECARGAR DATOS =====
        // Preload the data into the input fields
        inputNombre.value = item.name;
        inputDescripcion.value = item.description;

        // ===== RELLENAR SELECT DE ESTADOS =====
        // Fetch the states for the select element
        const estados = await get("estadoMotivos");
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;

            // Select the option if it matches the item's state
            if (e.id === item.state_reason_id) {
                op.selected = true;
            }

            selectEstado.append(op);
        });

        // Add event listener to the close button
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable to prevent multiple form submissions
        let enviando = false;

        // ===== ENVIAR FORM =====
        // Handle the form submission event
        form.onsubmit = async (event) => {
            // Prevent the default form submission behavior
            event.preventDefault();
            // If the form is already submitting, prevent multiple submissions
            if (enviando) return;

            // Validate the form fields
            if (!validate.validarCampos(event)) return;

            // Show a loading message
            loading("Actualizando Motivo");
            // Close the modal
            cerrarModal(modal);

            // Create the payload with the form data and selected state
            const payload = {
                ...validate.datos,
                estados_id: selectEstado.value
            };

            try {
                // Set 'enviando' to true to prevent multiple submissions
                enviando = true;

                // Send a PATCH request to update the reason
                const response = await patch(`motivos/${item.id}`, payload);

                // If the response is not successful
                if (!response || !response.success) {
                    cerrarModal(modal);
                    // Display any errors
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el motivo");
                    }
                    enviando = false;
                    return;
                }

                // If the update is successful
                cerrarModal(modal);
                success(response.message || "Motivo actualizado correctamente");
                form.reset();
                reasonsController();

            } catch (err) {
                // Handle any errors during the update process
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            // Reset 'enviando' to false
            enviando = false;
        };
    });
};
