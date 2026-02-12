import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearUsuario from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import ApprenticesController from "../ApprenticesController.js";


// ============================================================================
// FUNCIÓN PRINCIPAL: abrirModalCrearAprendiz
// ============================================================================
// - Abre una ventana modal para crear un nuevo aprendiz o usuario.
// - Realiza validaciones, carga datos dinámicos (roles, estados, fichas, etc.)
// - Envía los datos al backend usando la función "post".
// ============================================================================
export const abrirModalCrearAprendiz = async () => {

    // Evita abrir múltiples modales de creación a la vez
    if (document.querySelector("#formUsuario")) return;

    // Muestra el modal y carga la plantilla HTML del formulario
    const modal = mostrarModal(htmlCrearUsuario);

    // ====== REFERENCIAS A ELEMENTOS DEL MODAL ======
    const btnCerrar = modal.querySelector("#btnCerrarModal");
    const form = modal.querySelector("#formUsuario");
    const selectRol = modal.querySelector("#selectRol");
    const selectEstado = modal.querySelector("#selectEstado");
    const selectFicha = modal.querySelector("#selectFicha");
    const selectPrograma = modal.querySelector("#selectPrograma");
    const seccionAprendiz = modal.querySelector("#seccionAprendiz");
    const Tdocumento = modal.querySelector("#tipodocumento");

    // ====== BOTÓN CERRAR ======
    // Cierra el modal al presionar el botón "Cerrar"
    btnCerrar.addEventListener("click", () => cerrarModal(modal));

    // ====== EVENTOS DINÁMICOS ======

    // Cuando cambia la ficha, se actualiza el programa asociado dinámicamente
    selectFicha.addEventListener("change", () => {
        // Limpia las opciones anteriores del programa
        selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
        selectPrograma.disabled = true;
        if (!selectFicha.value) return;

        // Crea una opción para el programa vinculado a la ficha seleccionada
        const selected = selectFicha.selectedOptions[0];
        const op = document.createElement("option");
        op.value = selected.dataset.programaId;
        op.textContent = selected.dataset.programaNombre;
        selectPrograma.append(op);
        selectPrograma.value = selected.dataset.programaId;
        selectPrograma.disabled = false;
    });

    // Muestra u oculta la sección de aprendiz según el rol elegido
    selectRol.addEventListener("change", () => {
        const esAprendiz = selectRol.selectedOptions[0]?.textContent === "Aprendiz";
        seccionAprendiz.style.display = esAprendiz ? "block" : "none";
    });

    // ====== CARGA DE DATOS DINÁMICOS ======
    // Carga desde el backend los tipos de documento, roles, estados y fichas
    try {

        // Carga los tipos de documento
        const tipo = await get("Tipo_documento")

        // Agrega cada tipo de documento al <select>
        tipo.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            Tdocumento.append(op);
        });

        // Carga simultáneamente roles, estados y fichas
        const [roles, estados, fichas] = await Promise.all([
            get("roles"),
            get("EstadoUsuarios"),
            get("ficha")
        ]);

        // Llena el <select> de roles
        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            selectRol.append(op);
        });

        // Llena el <select> de estados de usuario
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.status;
            selectEstado.append(op);
        });

        // Llena el <select> de fichas y asocia los datos de programa como atributos
        fichas.data.forEach(f => {
            const op = document.createElement("option");
            op.value = f.id;
            op.textContent = f.ficha;
            op.dataset.programaId = f.programa.id;
            op.dataset.programaNombre = f.programa.training_program;
            selectFicha.append(op);
        });

    } catch (err) {
        // Muestra un mensaje de error si la carga falla
        console.error(err);
        error("No se pudieron cargar roles, estados o fichas");
    }

    // ====== ENVÍO DEL FORMULARIO ======
    let enviando = false; // Previene envíos múltiples simultáneos

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita recargar la página
        e.stopPropagation();
        if (enviando) return; // Bloquea doble envío
        if (!validate.validarCampos(e)) return; // Verifica campos del formulario

        // Si el rol es "Aprendiz", ficha y programa deben estar seleccionados
        const esAprendiz = selectRol.selectedOptions[0]?.textContent === "Aprendiz";
        if (esAprendiz && (!selectFicha.value || !selectPrograma.value)) {
            error("Ficha y programa son obligatorios para Aprendices");
            return;
        }

        // Muestra alerta de carga
        loading("Creando aprendiz");
        cerrarModal(modal);
        enviando = true;

        // Crea el objeto de datos a enviar
        const payload = {
            documento: validate.datos.documento,
            nombres: validate.datos.nombres,
            apellidos: validate.datos.apellidos,
            telefono: validate.datos.telefono,
            correo: validate.datos.correo,
            rol: validate.datos.rol,
            tipo_documento: validate.datos.tipo_documento,
            estado_id: validate.datos.estado,
            contrasena: Math.random().toString(36).slice(-10)
        };

        // Agrega ficha y programa si es aprendiz
        if (esAprendiz) {
            payload.ficha_id = selectFicha.value;
            payload.programa_id = selectPrograma.value;
        }

        // Muestra en consola los datos a enviar (solo para depuración)
        console.log(payload);

        try {
            // Envía los datos al endpoint "user/create"
            const response = await post("user/create", payload);

            // Manejo de errores desde el backend
            if (!response || !response.success) {
                cerrarModal(modal);
                if (response?.errors?.length) {
                    // Si hay varios errores, los muestra individualmente
                    response.errors.forEach(err => error(err));
                } else {
                    error(response?.message || "Error al crear el usuario");
                }
                enviando = false;
                return;
            }

            // Si todo va bien, limpia el formulario y actualiza la vista
            form.reset();
            cerrarModal(modal);
            ApprenticesController(); // Recarga el listado de aprendices
            success(response.message || "Aprendiz creado correctamente");

        } catch (err) {
            // Muestra error si falla la solicitud
            console.error(err);
            error("Ocurrió un error inesperado");
        }

        enviando = false; // Permite reenviar nuevamente tras finalizar
    };

    // Asegura que solo haya un listener activo en el formulario
    form.removeEventListener("submit", handleSubmit);
    form.addEventListener("submit", handleSubmit);
};
