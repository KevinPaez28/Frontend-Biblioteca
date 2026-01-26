import { post, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearJornada from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import shiftsController from "../shiftsController.js";

export const abrirModalCrearJornada = async () => {
    // Evitar abrir más de un modal
    if (document.querySelector("#formJornada")) return;

    const modal = mostrarModal(htmlCrearJornada);

    requestAnimationFrame(async () => {

        // ================== CONSTANTES DEL DOM ==================
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formJornada");
        const inputNombre = modal.querySelector("#inputNombre");
        const selectHorario = modal.querySelector("#selectHorario");

        if (!btnCerrar || !form || !inputNombre || !selectHorario) {
            console.error("No se encontraron los elementos necesarios en el modal");
            cerrarModal(modal);
            return;
        }

        // ================== BOTÓN CERRAR MODAL ==================
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Bandera para evitar múltiples envíos
        let enviando = false;

        // ================== EVENTO SUBMIT ==================
        const handleSubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (enviando) return;
            if (!validate.validarCampos(e)) return;
            
            loading("Creando jornada");
            cerrarModal(modal);
            enviando = true;

            const payload = { ...validate.datos };

            try {
                const response = await post("jornadas/create", payload);

                if (!response || !response.success) {
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al crear la jornada");
                    }
                    enviando = false;
                    return;
                }

                form.reset();
                cerrarModal(modal);
                success(response.message || "Jornada creada correctamente");
                shiftsController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        };

        form.removeEventListener("submit", handleSubmit); // limpieza
        form.addEventListener("submit", handleSubmit);

        // ================== CARGA DE DATOS DINÁMICOS ==================
        try {
            const horarios = await get("horarios");
            selectHorario.innerHTML = `<option value="">Seleccione un horario</option>`;
            if (horarios?.data?.length) {
                horarios.data.forEach(h => {
                    const op = document.createElement("option");
                    op.value = h.id;
                    op.textContent = `${h.start_time} - ${h.end_time}`;
                    selectHorario.append(op);
                });
            }
        } catch (err) {
            console.error(err);
            error("No se pudieron cargar los horarios");
        }

        // ================== VALIDACIONES POR CAMPO ==================
        const campos = form.querySelectorAll("input, select");
        campos.forEach(campo => {
            if (campo.type === "text") {
                campo.addEventListener("keydown", e => {
                    validate.validarTexto(e);
                    validate.validarMaximo(e, campo.maxLength || 50);
                });
                campo.addEventListener("blur", e => {
                    validate.validarMinimo(e, campo.minLength || 3);
                    validate.validarCampo(e);
                });
            }
        });

    });
};
