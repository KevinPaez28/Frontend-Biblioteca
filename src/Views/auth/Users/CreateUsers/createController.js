import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearUsuario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import UsersController from "../UsersController.js";

export const abrirModalCrearUsuario = async () => {

    // ================== MOSTRAR MODAL ==================
    mostrarModal(htmlCrearUsuario);

    requestAnimationFrame(async () => {

        // ================== CONSTANTES DEL DOM ==================
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formUsuario");
        const selectRol = document.querySelector("#selectRol");
        const selectEstado = document.querySelector("#selectEstado");

        // ================== BOTÓN CERRAR ==================
        btnCerrar.addEventListener("click", cerrarModal);

        // ================== BANDERA DE ENVÍO ==================
        let enviando = false;

        // ================== EVENTO SUBMIT ==================
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
                    cerrarModal();
                    if (response?.errors && response.errors.length > 0) {
                        response.errors.forEach(err => error(err));
                    } else {
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

        // ================== CARGA DE DATOS DINÁMICOS ==================
        try {
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
