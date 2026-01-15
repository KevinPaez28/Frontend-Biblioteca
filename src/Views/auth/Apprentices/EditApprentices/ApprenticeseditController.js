import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import ApprenticesController from "../ApprenticesController.js";

export const editModalAprendiz = (item) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(async () => {

        const form = document.querySelector("#formAprendiz");
        const btnCerrar = document.querySelector("#btnCerrarModal");
        btnCerrar.addEventListener("click", cerrarModal);

        // ===== INPUTS =====
        const inputDocumento = document.querySelector("#modalInputDocumento");
        const inputNombre = document.querySelector("#modalInputNombre");
        const inputApellido = document.querySelector("#modalInputApellido");
        const inputTelefono = document.querySelector("#modalInputTelefono");
        const inputCorreo = document.querySelector("#modalInputCorreo");

        // ===== SELECTS =====
        const selectFicha = document.querySelector("#modalSelectFicha");
        const selectPrograma = document.querySelector("#modalSelectPrograma");
        const selectEstado = document.querySelector("#modalSelectEstado");

        // ===== PRECARGA =====
        inputDocumento.value = item.document;
        inputNombre.value = item.first_name;
        inputApellido.value = item.last_name;
        inputTelefono.value = item.phone_number;
        inputCorreo.value = item.email;

        // ===== ESTADOS =====
        const estados = await get("EstadoUsuarios");
        selectEstado.innerHTML = `<option value="">Seleccione un estado</option>`;
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.status;
            if (e.status === item.estado) op.selected = true;
            selectEstado.append(op);
        });

        // ===== FICHAS =====
        const fichas = await get("ficha");

        selectFicha.innerHTML = `<option value="">Seleccione una ficha</option>`;
        selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
        selectPrograma.disabled = true;

        fichas.data.forEach(f => {
            const op = document.createElement("option");
            op.value = f.id;
            op.textContent = f.ficha;
            op.dataset.programaId = f.programa.id;
            op.dataset.programaNombre = f.programa.training_program;

            // precarga ficha actual
            if (f.ficha == item.ficha) {
                op.selected = true;

                const prog = document.createElement("option");
                prog.value = f.programa.id;
                prog.textContent = f.programa.training_program;

                selectPrograma.append(prog);
                selectPrograma.value = f.programa.id;
                selectPrograma.disabled = false;
            }

            selectFicha.append(op);
        });

        // ===== FICHA → PROGRAMA =====
        selectFicha.addEventListener("change", () => {
            selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
            selectPrograma.disabled = true;

            if (!selectFicha.value) return;

            const selected = selectFicha.selectedOptions[0];

            const op = document.createElement("option");
            op.value = selected.dataset.programaId;
            op.textContent = selected.dataset.programaNombre;

            selectPrograma.append(op);
            selectPrograma.value = selected.dataset.programaId;
            // selectPrograma.disabled = false;
        });

        let enviando = false;

        // ===== SUBMIT =====
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(e)) return;

            
            const payload = {
                ...validate.datos,
                rol_id: 2
            };
            
            try {
                enviando = true;

                const response = await patch(`user/${item.id}`, payload);
                
                console.log(response);
                if (!response || !response.success) {
                    if (response?.errors?.length) {
                        cerrarModal();
                        response.errors.forEach(err => error(err));
                    } else {
                        cerrarModal();
                        error(response?.message || "Error al crear aprendiz");
                    }
                    enviando = false;
                    return;
                }   

                cerrarModal();
                success("Aprendiz actualizado correctamente");
                ApprenticesController();

            } catch (err) {
                console.error(err);
                error("Error inesperado");
            }

            enviando = false;
        });
    });
};
