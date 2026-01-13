import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearUsuario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import UsersController from "../UsersController.js";

export const abrirModalCrearUsuario = async () => {

    mostrarModal(htmlCrearUsuario);

    requestAnimationFrame(async () => {

        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formUsuario");
        const selectRol = document.querySelector("#selectRol");
        const selectEstado = document.querySelector("#selectEstado");

        btnCerrar.addEventListener("click", cerrarModal);

        // ================= CARGAR ROLES =================
        const roles = await get("roles");
        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            selectRol.append(op);
        });

        // ================= CARGAR ESTADOS =================
        
        let enviando = false;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(event)) return;

            const payload = {
                ...validate.datos,
                contrasena: Math.random().toString(36).slice(-10)
            };
            console.log(payload);
            
            try {
                enviando = true;

                const response = await post("user/create", payload);

                if (!response || !response.success) {
                    if (response?.errors && response.errors.length > 0) {
                        cerrarModal();
                        response.errors.forEach(err => error(err));
                    } else {
                        cerrarModal();
                        error(response?.message || "Error al crear el usuario");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal();
                success(response.message || "Usuario creado correctamente");
                UsersController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        });
    });
};
