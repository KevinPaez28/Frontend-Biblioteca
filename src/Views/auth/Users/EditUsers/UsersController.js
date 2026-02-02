import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import UsersController from "../UsersController.js";

export const editModalUsuario = (item) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(async () => {

        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formUsuario");

        const inputDocumento = modal.querySelector("#modalInputDocumento");
        const inputNombre = modal.querySelector("#modalInputNombre");
        const inputApellido = modal.querySelector("#modalInputApellido");
        const inputTelefono = modal.querySelector("#modalInputTelefono");
        const inputCorreo = modal.querySelector("#modalInputCorreo");

        const selectRol = modal.querySelector("#modalSelectRol");
        const selectEstado = modal.querySelector("#modalSelectEstado");

        if (!btnCerrar || !form) {
            console.error("Elementos del modal no encontrados");
            cerrarModal(modal);
            return;
        }

        // ===== PRECARGAR DATOS =====
        inputDocumento.value = item.document;
        inputNombre.value = item.first_name;
        inputApellido.value = item.last_name;
        inputTelefono.value = item.phone_number;
        inputCorreo.value = item.email;

        // ===== RELLENAR ROLES =====
        const roles = await get("roles");
        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;

            if (r.name === item.rol) op.selected = true;

            selectRol.append(op);
        });

        // ===== RELLENAR ESTADOS =====
        const estados = await get("EstadoUsuarios");

        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.status;

            if (e.name === item.estado) op.selected = true;

            selectEstado.append(op);
        });

        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

      form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(e)) return;

            const payload = {
                ...validate.datos,
                rol_id: selectRol.value,
                status_id: selectEstado.value
            };

            try {
                enviando = true;

                const response = await patch(`user/${item.id}`, payload);

                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el usuario");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal(modal);
                success(response.message || "Usuario actualizado correctamente");
                UsersController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        });
    });
};
