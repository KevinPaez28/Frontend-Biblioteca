import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlUserModal from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";

export const editUserModal = (user) => {
    const modal = mostrarModal(htmlUserModal);

    requestAnimationFrame(async () => {
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formUser");

        const inputNombres = modal.querySelector("#modalInputNombres");
        const inputApellidos = modal.querySelector("#modalInputApellidos");
        const inputCorreo = modal.querySelector("#modalInputCorreo");
        const inputTelefono = modal.querySelector("#modalInputTelefono");
        const selectRol = modal.querySelector("#modalSelectRol");
        const selectEstado = modal.querySelector("#modalSelectEstado");

        // ===== PRECARGAR DATOS =====
        inputNombres.value = user.nombres;
        inputApellidos.value = user.apellidos;
        inputCorreo.value = user.correo;
        inputTelefono.value = user.telefono;

        // ===== RELLENAR SELECT DE ROLES =====
        const roles = await get("roles"); // Endpoint para roles
        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            if (r.id === user.rol_id) op.selected = true;
            selectRol.append(op);
        });

        // ===== RELLENAR SELECT DE ESTADOS =====
        const estados = await get("estadosUsuarios"); // Endpoint para estados de usuario
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.name;
            if (e.id === user.estado_id) op.selected = true;
            selectEstado.append(op);
        });

        // CIERRE DEL MODAL
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(e)) return;

            loading("Modificando Usuario");

            const payload = {
                ...validate.datos,
                rol_id: selectRol.value,
                estado_id: selectEstado.value
            };

            try {
                enviando = true;
                const response = await patch(`usuarios/${user.id}`, payload);

                if (!response || !response.success) {
                    if (response?.errors && response.errors.length > 0) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el usuario");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal(modal);
                success(response.message || "Usuario actualizado correctamente");
                form.reset();
                // Recargar la lista de usuarios
                usersController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
