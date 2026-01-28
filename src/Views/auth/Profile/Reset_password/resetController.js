import "../../../../Components/Formulario/formulario.css";
import { patch } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import htmlCambiarPassword from "./index.html?raw";

export const abrirModalCambiarPassword = (item) => {
    const modal = mostrarModal(htmlCambiarPassword);

    requestAnimationFrame(() => {
        const form = modal.querySelector("#formCambiarPassword");
        if (!form) return console.error("Formulario no encontrado");

        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const inputActual = form.querySelector('input[name="current_password"]');
        const inputNueva = form.querySelector('input[name="newPassword"]');
        const inputConfirmar = form.querySelector('input[name="confirmPassword"]');

        const inputs = [inputActual, inputNueva, inputConfirmar];

        // ================= VALIDACIÓN VISUAL POR CAMPO =================
        inputs.forEach(campo => {
            campo.addEventListener("blur", () => {
                if (campo.name === "current_password") {
                    validate.validarCampo({ target: campo });
                } else {
                    const valido = validate.validarPassword({ target: campo });
                    if (valido) {
                        campo.closest(".form__grupo").classList.remove("error");
                    }
                }
            });
        });

        // ================= BOTÓN CERRAR =================
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ================= SUBMIT =================
        let enviando = false;
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;

            // Validar todos los campos
            if (!validate.validarCampos(e)) {
                console.log("Campos inválidos");
                return;
            }     
            loading("Actualizando contraseña...");
            cerrarModal(modal);
            enviando = true;

            const payload = {
                current_password: inputActual.value,
                new_password: inputNueva.value,
                new_password_confirmation: inputConfirmar.value, 

            };  

            

            try {
                const response = await patch(`user/newpassword/${item.id}`, payload);

                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al cambiar la contraseña");
                    }
                    return;
                }

                success(response.message || "Contraseña actualizada correctamente");
                form.reset();
                cerrarModal(modal);

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            } finally {
                enviando = false;
            }
        });
    });
};
