import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearUsuario from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import ApprenticesController from "../ApprenticesController.js";

export const abrirModalCrearAprendiz = async () => {
    // Evitar abrir más de un modal de crear usuario
    if (document.querySelector("#formUsuario")) return;
    
    const modal = mostrarModal(htmlCrearUsuario);
    
    // ====== REFERENCIAS LOCALES AL MODAL ======
    const btnCerrar = modal.querySelector("#btnCerrarModal");
    const form = modal.querySelector("#formUsuario");
    const selectRol = modal.querySelector("#selectRol");
    const selectEstado = modal.querySelector("#selectEstado");
    const selectFicha = modal.querySelector("#selectFicha");
    const selectPrograma = modal.querySelector("#selectPrograma");
    const seccionAprendiz = modal.querySelector("#seccionAprendiz");
    const Tdocumento = modal.querySelector("#tipodocumento");
    
    // ====== BOTÓN CERRAR ======
    btnCerrar.addEventListener("click", () => cerrarModal(modal));

    // ====== EVENTOS DINÁMICOS ======
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
        selectPrograma.disabled = false;
    });

    selectRol.addEventListener("change", () => {
        const esAprendiz = selectRol.selectedOptions[0]?.textContent === "Aprendiz";
        seccionAprendiz.style.display = esAprendiz ? "block" : "none";
    });

    // ====== CARGA DE DATOS DINÁMICOS ======
    try {

        const tipo = await get("Tipo_documento")
       
                   tipo.data.forEach(r => {
                       const op = document.createElement("option");
                       op.value = r.id;
                       op.textContent = r.name;
                       Tdocumento.append(op);
                   });
        const [roles, estados, fichas] = await Promise.all([
            get("roles"),
            get("EstadoUsuarios"),
            get("ficha")
        ]);

        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            selectRol.append(op);
        });

        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.status;
            selectEstado.append(op);
        });

        fichas.data.forEach(f => {
            const op = document.createElement("option");
            op.value = f.id;
            op.textContent = f.ficha;
            op.dataset.programaId = f.programa.id;
            op.dataset.programaNombre = f.programa.training_program;
            selectFicha.append(op);
        });

    } catch (err) {
        console.error(err);
        error("No se pudieron cargar roles, estados o fichas");
    }

    // ====== SUBMIT ======
    let enviando = false;
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (enviando) return;
        if (!validate.validarCampos(e)) return;

        const esAprendiz = selectRol.selectedOptions[0]?.textContent === "Aprendiz";
        if (esAprendiz && (!selectFicha.value || !selectPrograma.value)) {
            error("Ficha y programa son obligatorios para Aprendices");
            return;
        }

        loading("Creando aprendiz");
        cerrarModal(modal);
        enviando = true;

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

        try {
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

            form.reset();
            cerrarModal(modal);
            success(response.message || "Aprendiz creado correctamente");
            ApprenticesController();

        } catch (err) {
            console.error(err);
            error("Ocurrió un error inesperado");
        }

        enviando = false;
    };

    form.removeEventListener("submit", handleSubmit); // limpieza por seguridad
  form.addEventListener("submit", handleSubmit);
};
