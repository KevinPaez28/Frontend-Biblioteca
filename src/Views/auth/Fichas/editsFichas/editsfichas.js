import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarFicha from "./index.html?raw"; // tu modal de fichas
import { success, error } from "../../../../Helpers/alertas.js";
import fichasController from "../FichasController.js";

export const editarmodalFicha = async (ficha) => {
    mostrarModal(htmlEditarFicha);

    requestAnimationFrame(async () => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formFicha");

        // ===== PRECARGAR DATOS =====
        document.querySelector("#inputFicha").value = ficha.ficha || "";
        
        // ===== PRECARGAR PROGRAMAS DINÁMICAMENTE =====
        const selectPrograma = document.querySelector("#inputPrograma");
        const programas = await get("programa");
        if (programas?.data?.length) {
            programas.data.forEach(p => {
                const option = document.createElement("option");
                option.value = p.id;
                option.textContent = p.training_program;
                if (ficha.programa?.id === p.id) option.selected = true;
                selectPrograma.appendChild(option);
            });
        }

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false; // evita envíos dobles

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;

            if (!validate.validarCampos(e)) return;

            const payload = { ...validate.datos };

            try {
                enviando = true;
                const response = await patch(`ficha/${ficha.id}`, payload);

                if (!response || !response.success) {
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                        cerrarModal();
                    } else {
                        error(response?.message || "Error al actualizar la ficha");
                    }
                    enviando = false;
                    return;
                }

                cerrarModal();
                success(response.message || "Ficha actualizada correctamente");
                form.reset();
                fichasController(); // recarga la tabla
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
