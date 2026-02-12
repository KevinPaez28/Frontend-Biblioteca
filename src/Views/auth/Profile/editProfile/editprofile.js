import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlUserModal from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import profileController from "../profileController.js"

/**
 * @description Función para mostrar y manejar el modal de edición de usuario.
 * @param {object} user - El objeto de usuario que contiene la información del usuario.
 */
export const editUserModal = (user) => {
    // Muestra el modal con el contenido HTML proporcionado
    const modal = mostrarModal(htmlUserModal);

    // Usa requestAnimationFrame para asegurar que el modal se renderice completamente antes de manipularlo
    requestAnimationFrame(async () => {
        // Obtiene referencias a varios elementos dentro del modal
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
        // Pre-poblar los campos de entrada con los datos existentes del usuario
        inputDocumento.value = user.document || "";
        inputNombres.value = user.first_name || "";
        inputApellidos.value = user.last_name || "";
        inputCorreo.value = user.email || "";
        inputTelefono.value = user.phone_number || "";

        // ===== RELLENAR SELECT DE ROLES =====
        // Obtiene la lista de roles desde la API

        const tipo = await get("Tipo_documento")

        // Agrega cada tipo de documento al <select>
        tipo.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            Tdocumento.append(op);
        });

        const roles = await get("roles"); // Endpoint para roles
        // Itera sobre cada rol y crea un elemento option para él
        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            // Si el ID del rol coincide con el ID del rol del usuario, lo marca como seleccionado
            if (r.id === user.rol_id) op.selected = true;
            selectRol.append(op);
        });

        // ===== RELLENAR SELECT DE ESTADOS =====


        // CIERRE DEL MODAL
        // Agrega un event listener al botón de cerrar para cerrar el modal
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable para prevenir el envío múltiple del formulario
        let enviando = false;

        // Maneja el envío del formulario
        form.onsubmit = async (event) => {
            // Previene el comportamiento de envío del formulario por defecto
            event.preventDefault();
            // Si el formulario ya está en proceso de envío, previene otro envío
            if (enviando) return;
            // Valida los campos del formulario
            if (!validate.validarCampos(event)) return;

            // Muestra un mensaje de carga
            loading("Modificando Usuario");
            // Cierra el modal
            cerrarModal(modal);

            // Crea un objeto de carga útil con los datos que se enviarán a la API
            const payload = {
                ...validate.datos,
                usuario: user.id,
                rol_id: selectRol.value,
                tipo_documento: validate.datos.tipo_documento,
                status_id: 1
            };

            try {
                // Establece 'enviando' en true para prevenir el envío múltiple
                enviando = true;
                // Envía una solicitud PATCH para actualizar el usuario
                const response = await patch(`user/${user.id}`, payload);

                // Si la respuesta no es exitosa
                if (!response || !response.success) {
                    cerrarModal(modal);
                    // Muestra cualquier error
                    if (response?.errors && response.errors.length > 0) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el usuario");
                    }
                    enviando = false;
                    return;
                }

                // Si la actualización es exitosa
                cerrarModal(modal);
                success(response.message || "Usuario actualizado correctamente");
                form.reset();
                profileController();
                enviando = false;

            } catch (err) {
                // Maneja cualquier error que ocurra durante el proceso de actualización
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        };
    });
};
