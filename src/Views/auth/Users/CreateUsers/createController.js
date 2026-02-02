import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearUsuario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import UsersController from "../UsersController.js";

export const abrirModalCrearUsuario = async () => {

    const modal = mostrarModal(htmlCrearUsuario);

    requestAnimationFrame(async () => {

        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formUsuario");
        const selectRol = modal.querySelector("#selectRol");
        const selectEstado = modal.querySelector("#selectEstado");



        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        let enviando = false;

      form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;

            const payload = {
                ...validate.datos,
                contrasena: Math.random().toString(36).slice(-10)
            };

            try {
                enviando = true;

                const response = await post("user/create", payload);

                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear el usuario");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal(modal);
                success(response.message || "Usuario creado correctamente");
                cargarUsuarios();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        });

        // ===== CARGAR ROLES =====
        try {
            selectRol.innerHTML = '<option value="">Seleccione un rol</option>'; 
            const roles = await get("roles");
            roles.data.forEach(r => {
                const op = document.createElement("option");
                op.value = r.id;
                op.textContent = r.name;
                selectRol.append(op);
            });
        } catch (err) {
            console.error(err);
            error("No se pudieron cargar roles");
        }

    });
};

