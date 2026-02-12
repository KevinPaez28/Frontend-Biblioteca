import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlContent from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import ApprenticesController from "../ApprenticesController.js";


// ============================================================================
// FUNCIÓN: editModalAprendiz
// ============================================================================
// - Recibe un objeto "item" con los datos del aprendiz a editar.
// - Abre un modal con el formulario prellenado con datos actuales.
// - Carga dinámicamente estados y fichas desde el backend.
// - Maneja la lógica de ficha → programa.
// - Envía actualización usando PATCH al endpoint `user/{id}`.
// ============================================================================
export const editModalAprendiz = (item) => {

    // Abre el modal con la plantilla HTML del formulario de edición
    const modal = mostrarModal(htmlContent);

    // Espera al siguiente frame para asegurar que el DOM esté renderizado
    requestAnimationFrame(async () => {

        // Referencias a elementos del modal
        const form = modal.querySelector("#formAprendiz");
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ===== INPUTS DE TEXTO =====
        const inputDocumento = modal.querySelector("#modalInputDocumento");
        const inputNombre = modal.querySelector("#modalInputNombre");
        const inputApellido = modal.querySelector("#modalInputApellido");
        const inputTelefono = modal.querySelector("#modalInputTelefono");
        const inputCorreo = modal.querySelector("#modalInputCorreo");

        // ===== SELECTS =====
        const selectFicha = modal.querySelector("#modalSelectFicha");
        const selectPrograma = modal.querySelector("#modalSelectPrograma");
        const selectEstado = modal.querySelector("#modalSelectEstado");
        const Tdocumento = modal.querySelector("#tipodocumento");

        // ===== PRECARGA DE DATOS DEL USUARIO =====
        // Llena todos los campos con los datos actuales del aprendiz
        inputDocumento.value = item.document;
        inputNombre.value = item.first_name;
        inputApellido.value = item.last_name;
        inputTelefono.value = item.phone_number;
        inputCorreo.value = item.email;

        // ===== CARGA DE ESTADOS =====
        const estados = await get("EstadoUsuarios");
        selectEstado.innerHTML = `<option value="">Seleccione un estado</option>`;
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.status;
            // Selecciona automáticamente el estado actual del aprendiz
            if (e.status === item.estado) op.selected = true;
            selectEstado.append(op);
        });

        const tipo = await get("Tipo_documento")

        // Agrega cada tipo de documento al <select>
        tipo.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            Tdocumento.append(op);
        });

        // ===== CARGA DE FICHAS Y PROGRAMAS =====
        const fichas = await get("ficha");
        selectFicha.innerHTML = `<option value="">Seleccione una ficha</option>`;
        selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
        selectPrograma.disabled = true; // Deshabilitado hasta seleccionar ficha

        fichas.data.forEach(f => {
            const op = document.createElement("option");
            op.value = f.id;
            op.textContent = f.ficha;
            op.dataset.programaId = f.programa.id;
            op.dataset.programaNombre = f.programa.training_program;

            // Si esta es la ficha actual del aprendiz:
            if (f.ficha == item.ficha) {
                op.selected = true;

                // Precarga también el programa asociado
                const prog = document.createElement("option");
                prog.value = f.programa.id;
                prog.textContent = f.programa.training_program;

                selectPrograma.append(prog);
                selectPrograma.value = f.programa.id;
                selectPrograma.disabled = false;
            }

            selectFicha.append(op);
        });

        // ===== EVENTO FICHA → PROGRAMA (dinámico) =====
        // Cuando cambia la ficha, se actualiza el programa correspondiente
        selectFicha.addEventListener("change", () => {
            selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
            selectPrograma.disabled = true;

            if (!selectFicha.value) return;

            // Crea la opción del programa usando los datos del dataset
            const selected = selectFicha.selectedOptions[0];
            const op = document.createElement("option");
            op.value = selected.dataset.programaId;
            op.textContent = selected.dataset.programaNombre;

            selectPrograma.append(op);
            selectPrograma.value = selected.dataset.programaId;
            selectPrograma.disabled = false;
        });

        let enviando = false; // Previene múltiples envíos simultáneos

        // ===== MANEJO DEL ENVÍO DEL FORMULARIO =====
        form.onsubmit = async (event) => {
            event.preventDefault(); // Evita recarga de página
            if (enviando) return; // Bloquea doble envío
            if (!validate.validarCampos(event)) return; // Valida campos requeridos

            // Crea el payload con datos validados + ficha/programa + rol fijo (2=Aprendiz)
            const payload = {
                ...validate.datos, // Datos de los inputs validados
                ficha_id: selectFicha.value || null,
                programa_id: selectPrograma.value || null,
                rol_id: 2 // ID fijo para rol "Aprendiz"
            };

            try {
                enviando = true;
                // Envía PATCH al endpoint específico del usuario
                const response = await patch(`user/${item.id}`, payload);

                // Manejo de errores del backend
                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        // Muestra errores específicos uno por uno
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar aprendiz");
                    }
                    enviando = false;
                    return;
                }

                // Éxito: cierra modal, muestra mensaje y recarga la lista
                cerrarModal(modal);
                success("Aprendiz actualizado correctamente");
                ApprenticesController();

            } catch (err) {
                // Errores inesperados (red, servidor caído, etc.)
                console.error(err);
                error("Error inesperado");
            }

            enviando = false; // Permite reenviar después de finalizar
        };
    });
};
