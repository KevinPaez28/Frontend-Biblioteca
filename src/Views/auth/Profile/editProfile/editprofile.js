import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlUserModal from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import profileController from "../profileController.js"

/**
 * @description Function to display and handle the user editing modal.
 * @param {object} user - The user object containing user information.
 */
export const editUserModal = (user) => {
    // Display the modal with the provided HTML content
    const modal = mostrarModal(htmlUserModal);

    // Use requestAnimationFrame to ensure the modal is fully rendered before manipulating it
    requestAnimationFrame(async () => {
        // Get references to various elements within the modal
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formUser");

        const inputDocumento = modal.querySelector("#modalInputDocumento");
        const inputNombres = modal.querySelector("#modalInputNombres");
        const inputApellidos = modal.querySelector("#modalInputApellidos");
        const inputCorreo = modal.querySelector("#modalInputCorreo");
        const inputTelefono = modal.querySelector("#modalInputTelefono");
        const selectRol = modal.querySelector("#modalSelectRol");
        const selectEstado = modal.querySelector("#modalSelectEstado");
        const Tdocumento = modal.querySelector("#tipodocumento");

        // ===== PRECARGAR DATOS =====
        // Pre-populate the input fields with the user's existing data
        inputDocumento.value = user.document || "";
        inputNombres.value = user.first_name || "";
        inputApellidos.value = user.last_name || "";
        inputCorreo.value = user.email || "";
        inputTelefono.value = user.phone_number || "";

        // ===== RELLENAR SELECT DE ROLES =====
        // Fetch the list of roles from the API

        const tipo = await get("Tipo_documento")

        // Agrega cada tipo de documento al <select>
        tipo.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            Tdocumento.append(op);
        });

        const roles = await get("roles"); // Endpoint para roles
        // Iterate over each role and create an option element for it
        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            // If the role ID matches the user's role ID, mark it as selected
            if (r.id === user.rol_id) op.selected = true;
            selectRol.append(op);
        });

        // ===== RELLENAR SELECT DE ESTADOS =====


        // CIERRE DEL MODAL
        // Add an event listener to the close button to close the modal
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable to prevent multiple form submissions
        let enviando = false;

        // Handle the form submission
        form.onsubmit = async (event) => {
            // Prevent the default form submission behavior
            event.preventDefault();
            // If the form is already submitting, prevent another submission
            if (enviando) return;
            // Validate the form fields
            if (!validate.validarCampos(event)) return;

            // Display a loading message
            loading("Modificando Usuario");
            // Close the modal
            cerrarModal(modal);

            // Create a payload object with the data to be sent to the API
            const payload = {
                ...validate.datos,
                usuario: user.id,
                rol_id: selectRol.value,
                tipo_documento: validate.datos.tipo_documento,
                status_id: 1
            };

            try {
                // Set 'enviando' to true to prevent multiple submissions
                enviando = true;
                // Send a PATCH request to update the user
                const response = await patch(`user/${user.id}`, payload);

                // If the response is not successful
                if (!response || !response.success) {
                    cerrarModal(modal);
                    // Display any errors
                    if (response?.errors && response.errors.length > 0) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el usuario");
                    }
                    enviando = false;
                    return;
                }

                // If the update is successful
                cerrarModal(modal);
                success(response.message || "Usuario actualizado correctamente");
                form.reset();
                profileController();
                enviando = false;

            } catch (err) {
                // Handle any errors that occur during the update process
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        };
    });
};
