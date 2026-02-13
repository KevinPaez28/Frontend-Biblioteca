import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules.js";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearUsuario from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import UsersController from "../UsersController.js";

/**
 * @description Función asíncrona para mostrar un modal y crear un nuevo usuario.
 */
export const modalCrearUser = async () => {
    // Evitar abrir más de un modal de crear usuario
    if (document.querySelector("#formUsuario")) return;

    // Muestra el modal utilizando la función mostrarModal y el HTML importado.
    const modal = mostrarModal(htmlCrearUsuario);

    // ====== REFERENCIAS LOCALES AL MODAL ======
    // Obtiene referencias a los elementos del DOM dentro del modal.
    const btnCerrar = modal.querySelector("#btnCerrarModal");
    const form = modal.querySelector("#formUsuario");
    const selectRol = modal.querySelector("#selectRol");
    const selectEstado = modal.querySelector("#selectEstado");
    const selectFicha = modal.querySelector("#selectFicha");
    const selectPrograma = modal.querySelector("#selectPrograma");
    const seccionAprendiz = modal.querySelector("#seccionAprendiz");
    const Tdocumento = modal.querySelector("#tipodocumento");

    // ====== BOTÓN CERRAR ======
    // Agrega un event listener al botón de cerrar para cerrar el modal cuando se hace clic.
    btnCerrar.addEventListener("click", () => cerrarModal(modal));

    // ====== EVENTOS DINÁMICOS ======
    // Agrega un event listener al select de fichas para cargar dinámicamente el programa correspondiente.
    selectFicha.addEventListener("change", () => {
        // Limpia el select de programas y deshabilítalo.
        selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
        selectPrograma.disabled = true;
        // Si no se ha seleccionado una ficha, sale de la función.
        if (!selectFicha.value) return;

        // Obtiene la opción seleccionada.
        const selected = selectFicha.selectedOptions[0];
        // Crea una nueva opción con el programa correspondiente.
        const op = document.createElement("option");
        op.value = selected.dataset.programaId;
        op.textContent = selected.dataset.programaNombre;
        // Agrega la opción al select de programas.
        selectPrograma.append(op);
        // Establece el valor y habilita el select de programas.
        selectPrograma.value = selected.dataset.programaId;
        selectPrograma.disabled = false;
    });

    // Agrega un event listener al select de roles para mostrar u ocultar la sección de aprendiz según el rol seleccionado.
    selectRol.addEventListener("change", () => {
        // Comprueba si el rol seleccionado es "Aprendiz".
        const esAprendiz = selectRol.selectedOptions[0]?.textContent === "Aprendiz";
        // Muestra u oculta la sección de aprendiz según el rol seleccionado.
        seccionAprendiz.style.display = esAprendiz ? "block" : "none";
    });

    // ====== CARGA DE DATOS DINÁMICOS ======
    try {
        // Realiza múltiples peticiones a la API de forma concurrente para obtener los datos necesarios.
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

        // Itera sobre los roles obtenidos y crea las opciones del select.
        roles.data.forEach(r => {
            const op = document.createElement("option");
            op.value = r.id;
            op.textContent = r.name;
            selectRol.append(op);
        });

        // Itera sobre los estados obtenidos y crea las opciones del select.
        estados.data.forEach(e => {
            const op = document.createElement("option");
            op.value = e.id;
            op.textContent = e.status;
            selectEstado.append(op);
        });

        // Itera sobre las fichas obtenidas y crea las opciones del select.
        fichas.data.forEach(f => {
            const op = document.createElement("option");
            op.value = f.id;
            op.textContent = f.ficha;
            op.dataset.programaId = f.programa.id;
            op.dataset.programaNombre = f.programa.training_program;
            selectFicha.append(op);
        });

    } catch (err) {
        // Si ocurre un error al cargar los datos, lo registra en la consola y muestra un mensaje de error.
        console.error(err);
        error("No se pudieron cargar roles, estados o fichas");
    }

    // ====== SUBMIT ======
    // Variable para controlar el envío múltiple del formulario.
    let enviando = false;
    /**
     * @description Función asíncrona para manejar el envío del formulario.
     * @param {Event} e Objeto de evento del formulario.
     */
    const handleSubmit = async (e) => {
        // Previene el comportamiento por defecto del formulario (recargar la página).
        e.preventDefault();
        // Detiene la propagación del evento para evitar que se disparen otros eventos.
        e.stopPropagation();
        // Si ya se está enviando el formulario, sale de la función.
        if (enviando) return;
        // Valida los campos del formulario utilizando la función validarCampos.
        if (!validate.validarCampos(e)) return;

        // Comprueba si el rol seleccionado es "Aprendiz".
        const esAprendiz = selectRol.selectedOptions[0]?.textContent === "Aprendiz";
        // Si es aprendiz y no se han seleccionado la ficha y el programa, muestra un mensaje de error y sale de la función.
        if (esAprendiz && (!selectFicha.value || !selectPrograma.value)) {
            error("Ficha y programa son obligatorios para Aprendices");
            return;
        }

        // Muestra un mensaje de carga.
        loading("Creando aprendiz");
        // Cierra el modal.
        cerrarModal(modal);
        // Establece la variable enviando a true para evitar el envío múltiple.
        enviando = true;

        // Crea un objeto payload con los datos del formulario.
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

        // Si es aprendiz, agrega los datos de la ficha y el programa al payload.
        if (esAprendiz) {
            payload.ficha_id = selectFicha.value;
            payload.programa_id = selectPrograma.value;
        }

        console.log(payload);

        try {
            // Envía la petición a la API para crear el usuario.
            const response = await post("user/create", payload);

            // Si la respuesta no es exitosa.
            if (!response || !response.success) {
                // Cierra el modal.
                cerrarModal(modal);
                // Si hay errores en la respuesta, los muestra.
                if (response?.errors?.length) {
                    response.errors.forEach(err => error(err));
                } else {
                    // Si no hay errores específicos, muestra un mensaje de error genérico.
                    error(response?.message || "Error al crear el usuario");
                }
                // Restablece la variable enviando a false para permitir futuros envíos.
                enviando = false;
                return;
            }

            // Limpia el formulario.
            form.reset();
            // Cierra el modal.
            cerrarModal(modal);
            // Refresca la lista de usuarios.
            UsersController();
            // Muestra un mensaje de éxito.
            success(response.message || "Aprendiz creado correctamente");

        } catch (err) {
            // Si ocurre un error inesperado, lo registra en la consola y muestra un mensaje de error.
            console.error(err);
            error("Ocurrió un error inesperado");
        }

        // Restablece la variable enviando a false para permitir futuros envíos.
        enviando = false;
    };

    // Elimina el event listener anterior para evitar la acumulación de eventos.
    form.removeEventListener("submit", handleSubmit);
    // Agrega un event listener al formulario para manejar el envío del formulario.
    form.addEventListener("submit", handleSubmit);
};
