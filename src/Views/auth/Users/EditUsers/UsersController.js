import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import UsersController from "../UsersController.js";

/**
 * @description Función para mostrar y manejar el modal de edición de un usuario.
 * @param {object} item - El objeto del usuario que se va a editar.
 */
export const editModalUsuario = (item) => {

    // Muestra el modal utilizando la función mostrarModal y el HTML importado.
    const modal = mostrarModal(htmlContent);

    // Utiliza requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(async () => {

        // Obtiene referencias a los elementos del DOM dentro del modal.
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formUsuario");

        const inputDocumento = modal.querySelector("#modalInputDocumento");
        const inputTipoDocumento = modal.querySelector("#modalInputtipoDocumento");
        const inputNombre = modal.querySelector("#modalInputNombre");
        const inputApellido = modal.querySelector("#modalInputApellido");
        const inputTelefono = modal.querySelector("#modalInputTelefono");
        const inputCorreo = modal.querySelector("#modalInputCorreo");

        const selectRol = modal.querySelector("#modalSelectRol");
        const selectEstado = modal.querySelector("#modalSelectEstado");

        // Si no se encuentran los elementos del modal, registra un error y cierra el modal.
        if (!btnCerrar || !form) {
            console.error("Elementos del modal no encontrados");
            cerrarModal(modal);
            return;
        }

        // ===== PRECARGAR DATOS =====
        // Precarga los datos del usuario en los campos del formulario.
        inputDocumento.value = item.document;
        inputNombre.value = item.first_name;
        inputApellido.value = item.last_name;
        inputTelefono.value = item.phone_number;
        inputCorreo.value = item.email;

        console.log(item);


        // ===== RELLENAR ROLES =====
        // Obtiene los roles desde la API.
        const roles = await get("roles");
        // Itera sobre los roles y crea las opciones del select.
        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            // Selecciona el rol del usuario, si coincide.
            if (r.name === item.rol) op.selected = true;
            selectRol.append(op);
        });

        // ===== RELLENAR ESTADOS =====
        // Obtiene los estados desde la API.
        const estados = await get("EstadoUsuarios");
        // Itera sobre los estados y crea las opciones del select.
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.status;
            // Selecciona el estado del usuario, si coincide.
            if (e.name === item.estado) op.selected = true;
            selectEstado.append(op);
        });

         // ===== RELLENAR TIPO DE DOCUMENTO =====
         const tipo = await get("Tipo_documento");
            tipo.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;              
            op.textContent = e.acronym;  
            if (e.id == item.document_type_id) op.selected = true;
            inputTipoDocumento.append(op);
        });

        // Agrega un event listener al botón de cerrar para cerrar el modal.
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable para controlar el envío múltiple del formulario.
        let enviando = false;

        // Manejador del evento submit del formulario.
        form.onsubmit = async (event) => {
            // Previene el comportamiento por defecto del formulario.
            event.preventDefault();
            // Si ya se está enviando, no hacer nada.
            if (enviando) return;

            // Valida los campos del formulario.
            if (!validate.validarCampos(event)) return;

            // Crea un objeto payload con los datos del formulario.
            const payload = {
                ...validate.datos,
                rol_id: selectRol.value,
                status_id: selectEstado.value
            };

            try {
                // Establece la variable enviando a true para evitar el envío múltiple.
                enviando = true;

                // Realiza la petición a la API para actualizar el usuario.
                const response = await patch(`user/${item.id}`, payload);

                // Si la respuesta no es exitosa.
                if (!response || !response.success) {
                    // Cierra el modal.
                    cerrarModal(modal);
                    // Muestra los errores o un mensaje genérico.
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el usuario");
                    }
                    // Restablece la variable enviando a false.
                    enviando = false;
                    return;
                }

                // Cierra el modal.
                cerrarModal(modal);
                // Muestra un mensaje de éxito.
                success(response.message || "Usuario actualizado correctamente");
                // Actualiza la lista de usuarios.
                UsersController();

            } catch (err) {
                // Si ocurre un error inesperado, lo registra y muestra un mensaje de error.
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            // Restablece la variable enviando a false.
            enviando = false;
        };
    });
};
