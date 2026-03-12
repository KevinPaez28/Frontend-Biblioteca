import { patch, get } from "../../../../helpers/api.js";
import * as validate from "../../../../helpers/modules/modules.js";
import "../../../../components/models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../helpers/modalManagement.js";
import htmlEditarRol from "./index.html?raw";
import { success, error } from "../../../../helpers/alertas.js";
import rolescontroller from "../rolescontroller.js";

/**
 * @description Mapa de permisos con etiquetas amigables para la interfaz de usuario.
 * Cada clave representa un permiso y el valor es su descripción legible.
 */
const permisoLabels = {
   "auth.login": "Iniciar sesión",
    "auth.reset-password": "Recuperar contraseña",
    "auth.reset-password.change": "Cambiar contraseña",
    "auth.validate-token": "Verificar token",

    // ESTADOS DE USUARIO
    "user-status.index": "Ver estados de usuario",
    "user-status.store": "Crear estado de usuario",
    "user-status.update": "Actualizar estado de usuario",
    "user-status.destroy": "Eliminar estado de usuario",

    // USUARIOS
    "users.index": "Ver usuarios",
    "users.search": "Buscar usuarios",
    "users.store": "Crear usuario",
    "users.update": "Actualizar usuario",
    "users.destroy": "Eliminar usuario",

    // ROLES
    "roles.index": "Ver roles",
    "roles.store": "Crear rol",
    "roles.update": "Actualizar rol",
    "roles.destroy": "Eliminar rol",

    // PROGRAMAS
    "programs.index": "Ver programas",
    "programs.store": "Crear programa",
    "programs.update": "Actualizar programa",
    "programs.destroy": "Eliminar programa",

    // PERFILES
    "profiles.index": "Ver perfiles",
    "profiles.store": "Crear perfil",
    "profiles.update": "Actualizar perfil",
    "profiles.destroy": "Eliminar perfil",

    // FICHAS
    "fichas.index": "Ver fichas",
    "fichas.store": "Crear ficha",
    "fichas.update": "Actualizar ficha",
    "fichas.destroy": "Eliminar ficha",

    // DOCUMENTOS
    "documents.index": "Ver documentos",
    "documents.store": "Crear documento",
    "documents.update": "Actualizar documento",
    "documents.destroy": "Eliminar documento",

    // TIPO DE DOCUMENTO
    "document.index": "Ver tipos de documento",
    "document.store": "Crear tipo de documento",
    "document.update": "Actualizar tipo de documento",
    "document.destroy": "Eliminar tipo de documento",

    // ACCIONES
    "actions.index": "Ver acciones",
    "actions.store": "Crear acción",
    "actions.update": "Actualizar acción",
    "actions.destroy": "Eliminar acción",

    // HISTORIAL
    "history.index": "Ver historial",
    "history.store": "Crear historial",
    "history.update": "Actualizar historial",
    "history.destroy": "Eliminar historial",

    // HORARIOS
    "schedules.index": "Ver horarios",
    "schedules.store": "Crear horario",
    "schedules.update": "Actualizar horario",
    "schedules.destroy": "Eliminar horario",

    // JORNADAS
    "shifts.index": "Ver jornadas",
    "shifts.store": "Crear jornada",
    "shifts.update": "Actualizar jornada",
    "shifts.destroy": "Eliminar jornada",

    // MOTIVOS
    "reasons.index": "Ver motivos",
    "reasons.store": "Crear motivo",
    "reasons.update": "Actualizar motivo",
    "reasons.destroy": "Eliminar motivo",

    // EVENTOS
    "events.index": "Ver eventos",
    "events.today": "Eventos hoy",
    "events.store": "Crear evento",
    "events.update": "Actualizar evento",
    "events.destroy": "Eliminar evento",

    // ASISTENCIAS
    "assistances.index": "Ver asistencias",
    "assistances.store": "Registrar asistencia",
    "assistances.update": "Actualizar asistencia",
    "assistances.destroy": "Eliminar asistencia",

    // SALAS
    "rooms.index": "Ver salas",
    "rooms.store": "Crear sala",
    "rooms.update": "Actualizar sala",
    "rooms.destroy": "Eliminar sala",
};

/**
 * @description Listado de permisos que no se muestran en el modal de edición de roles.
 * Estos permisos suelen ser internos o no relevantes para la asignación manual.
 */
const permisosOcultos = [
    "auth.reset-password",
    "auth.reset-password.change",
    "auth.validate-token",
    "user-status.index",
    "user-status.store",
    "user-status.update",
    "user-status.destroy",
    "document.index",
    "document.store",
    "document.update",
    "document.destroy",
    "documents.index",
    "documents.store",
    "documents.update",
    "documents.destroy",
];

/**
 * @description Función asíncrona para mostrar y gestionar el modal de edición de un rol existente.
 * @param {Object} rol Objeto que contiene la información del rol a editar.
 */
export const editarModalRol = async (rol) => {
    // Mostrar el modal de edición de rol.
    const modal = mostrarModal(htmlEditarRol);

    requestAnimationFrame(async () => {
        // Obtener referencias a los elementos del DOM dentro del modal.
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formRol");
        const permisosContainer = modal.querySelector("#permisosContainer");
        const inputRol = modal.querySelector("#inputRol");

        // Agregar un event listener al botón de cerrar para cerrar el modal.
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ===== PRECARGAR NOMBRE =====
        // Precargar el nombre del rol en el campo de entrada correspondiente.
        inputRol.value = rol.name || "";

        // ===== CARGAR PERMISOS =====
        try {
            // Obtener la lista de permisos desde la API.
            const response = await get("roles/permisos");

            // Si la respuesta es exitosa, procesar los permisos.
            if (response?.success) {
                // Generar el HTML para los checkboxes de permisos.
                permisosContainer.innerHTML = response.data
                    // Filtrar los permisos ocultos.
                    .filter(p => !permisosOcultos.includes(p.name))
                    // Mapear cada permiso a un label con un checkbox.
                    .map(p => {
                        // Verificar si el rol tiene asignado el permiso actual.
                        const isChecked = rol.permissions?.some(rp => rp.id === p.id);
                        return `
                            <label class="permiso-item badge badge-permissions" style="margin:3px; cursor:pointer;">
                                <input type="checkbox" name="permisos" value="${p.id}" ${isChecked ? "checked" : ""} style="margin-right:5px;">
                                ${permisoLabels[p.name] || p.name}
                            </label>
                        `;
                    }).join(""); // Unir todos los labels en una sola cadena HTML.
            }

        } catch (err) {
            // En caso de error al cargar los permisos, registrar el error y mostrar un mensaje.
            console.error(err);
            error("No se pudieron cargar los permisos");
        }

        // Variable para controlar el envío múltiple del formulario.
        let enviando = false;

        // ===== SUBMIT =====
        // Configurar el evento onsubmit del formulario.
        form.onsubmit = async (event) => {
            // Prevenir el comportamiento por defecto del formulario (recargar la página).
            event.preventDefault();
            // Si ya se está enviando, salir de la función.
            if (enviando) return;
            // Validar los campos del formulario utilizando la función validarCampos.
            if (!validate.validarCampos(event)) return;

            // Obtener la lista de IDs de los permisos seleccionados.
            const permisosSeleccionados = Array.from(
                modal.querySelectorAll('input[name="permisos"]:checked')
            ).map(i => Number(i.value));

            // Crear un objeto payload con los datos del formulario y los permisos seleccionados.
            const payload = {
                ...validate.datos,
                permisos: permisosSeleccionados
            };

            try {
                // Establecer la variable enviando a true para evitar el envío múltiple.
                enviando = true;

                // Enviar una petición PATCH a la API para actualizar el rol.
                const response = await patch(`roles/edit/${rol.id}`, payload);

                // Si la respuesta no es exitosa.
                if (!response?.success) {
                    // Mostrar los errores o un mensaje genérico.
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar el rol");
                    }
                    // Restablecer la variable enviando para permitir nuevos intentos.
                    enviando = false;
                    return;
                }

                // Cerrar el modal.
                cerrarModal(modal);
                // Mostrar un mensaje de éxito.
                success(response.message || "Rol actualizado correctamente");
                // Recargar la lista de roles.
                rolescontroller();

            } catch (err) {
                // En caso de error inesperado, registrar el error y mostrar un mensaje.
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            // Restablecer la variable enviando.
            enviando = false;
        };
    });
};
