import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearUsuario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import ApprenticesController from "../ApprenticesController.js";

export const abrirModalCrearAprendiz = async () => {

    mostrarModal(htmlCrearUsuario);

    requestAnimationFrame(async () => {

        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formUsuario");
        const selectRol = document.querySelector("#selectRol");
        const selectEstado = document.querySelector("#selectEstado");
        const selectFicha = document.querySelector("#selectFicha");
        const selectPrograma = document.querySelector("#selectPrograma");
        const seccionAprendiz = document.querySelector("#seccionAprendiz");

        btnCerrar.addEventListener("click", cerrarModal);

        // ================= ROLES =================
        const roles = await get("roles");
        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            selectRol.append(op);
        });

        // ================= ESTADOS =================
        const estados = await get("EstadoUsuarios");
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.status;
            selectEstado.append(op);
        });

        // ================= FICHAS =================

        const fichas = await get("ficha");
        fichas.data.forEach(f => {
            const op = document.createElement("option");
            op.value = f.id;
            op.textContent = f.ficha;
            op.dataset.programaId = f.programa.id;
            op.dataset.programaNombre = f.programa.training_program;
            selectFicha.append(op);
        });
        console.log(fichas);

        // ================= FICHA → PROGRAMA =================
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
        });

        // ================= MOSTRAR SOLO SI ES APRENDIZ =================
        selectRol.addEventListener("change", () => {
            const esAprendiz = selectRol.selectedOptions[0]?.textContent === "Aprendiz";
            seccionAprendiz.style.display = esAprendiz ? "block" : "none";
        });

        let enviando = false;

        // ================= SUBMIT =================
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(event)) return;

            const esAprendiz = selectRol.selectedOptions[0]?.textContent === "Aprendiz";

            if (esAprendiz && (!selectFicha.value || !selectPrograma.value)) {
                error("Ficha y programa son obligatorios para Aprendices");
                return;
            }

            const payload = {
                documento: validate.datos.documento,
                nombres: validate.datos.nombres,
                apellidos: validate.datos.apellidos,
                telefono: validate.datos.telefono,
                correo: validate.datos.correo,
                rol: validate.datos.rol,
                estado_id: validate.datos.estado,
                contrasena: Math.random().toString(36).slice(-10)
            };

            if (esAprendiz) {
                payload.ficha_id = selectFicha.value;
                payload.programa_id = selectPrograma.value;
            }

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

            form.reset();
            cerrarModal();
            success(response.message || "Aprendiz creado correctamente");
            ApprenticesController();


            enviando = false;
        });
    });
};
