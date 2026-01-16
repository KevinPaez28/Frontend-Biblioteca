import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import UsersController from "../UsersController.js";

export const editModalUsuario = (item) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(async () => {

        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formUsuario");

        const inputDocumento = document.querySelector("#modalInputDocumento");
        const inputNombre = document.querySelector("#modalInputNombre");
        const inputApellido = document.querySelector("#modalInputApellido");
        const inputTelefono = document.querySelector("#modalInputTelefono");
        const inputCorreo = document.querySelector("#modalInputCorreo");

        const selectRol = document.querySelector("#modalSelectRol");
        const selectEstado = document.querySelector("#modalSelectEstado");

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

            if (r.name === item.rol) {
                op.selected = true;
            }

            selectRol.append(op);
        });

        const estados = await get("EstadoUsuarios");

        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.status;

            if (e.name === item.estado) {
                op.selected = true;
            }

            selectEstado.append(op);
        });

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false;

        // ===== SUBMIT =====
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
                    if (response?.errors && response.errors.length > 0) {
                        cerrarModal();
                        response.errors.forEach(err => error(err));
                    } else {
                        cerrarModal();
                        error(response?.message || "Error al actualizar el usuario");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal();
                success(response.message || "Usuario actualizado correctamente");
                UsersController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
