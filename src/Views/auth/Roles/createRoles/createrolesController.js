import { post, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearRol from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import rolesController from "../RolesController.js";

// Mismo mapa de permisos
const permisoLabels = {
    // AUTH
    "auth.login": "Iniciar sesión",
    "auth.reset-password": "Solicitar recuperación",
    "auth.reset-password.change": "Cambiar contraseña",
    "auth.validate-token": "Validar token",

    // ESTADOS USUARIO (NUEVOS)
    "user-status.index": "Ver estados usuario",
    "user-status.store": "Crear estado usuario",
    "user-status.update": "Actualizar estado usuario",
    "user-status.destroy": "Eliminar estado usuario",

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

// Lista de permisos OCULTOS (misma lista)
const permisosOcultos = [
    "auth.reset-password",
    "auth.reset-password.change",
    "auth.validate-token",
    "user-status.index",
    "user-status.store",
    "user-status.update",
    "user-status.destroy",
];

/**
 * @description Abre un modal para crear un nuevo rol.
 */
export const abrirModalCrearRol = async () => {

    // Muestra el modal utilizando la función mostrarModal y el HTML importado.
    const modal = mostrarModal(htmlCrearRol);

    // Utiliza requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(async () => {

        // Obtiene referencias a los elementos del DOM dentro del modal.
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formRol");
        const permisosContainer = modal.querySelector("#permisosContainer");

        // Agrega un event listener al botón de cerrar para cerrar el modal cuando se hace clic.
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ===== CARGAR PERMISOS =====
        try {
            // Obtiene la lista de permisos desde la API.
            const response = await get("roles/permisos");

            // Si la respuesta es exitosa.
            if (response?.success) {
                // Filtra los permisos para excluir los permisos ocultos.
                const permisosFiltrados = response.data.filter(p =>
                    !permisosOcultos.includes(p.name)
                );

                // Muestra los permisos filtrados en el contenedor de permisos.
                permisosContainer.innerHTML = permisosFiltrados.length
                    ? permisosFiltrados.map(p => `
                        <label class="permiso-item badge badge-permissions" style="margin:3px; cursor:pointer; display:inline-block;">
                            <input type="checkbox" name="permisos" value="${p.id}" style="margin-right:5px;">
                            ${permisoLabels[p.name] || p.name}
                        </label>
                      `).join("")
                    : `<div class="text-center p-3">
                        <span class="badge badge-secondary">No hay permisos disponibles</span>
                       </div>`;
            }

        } catch (err) {
            // Si ocurre un error al cargar los permisos, lo registra en la consola y muestra un mensaje de error.
            console.error(err);
            error("No se pudieron cargar los permisos");
            permisosContainer.innerHTML = `
                <div class="text-center p-3">
                    <span class="badge badge-danger">Error cargando permisos</span>
                </div>
            `;
        }

        // Variable para controlar el envío múltiple del formulario.
        let enviando = false;

        // ===== SUBMIT =====
        // Agrega un event listener al formulario para manejar el envío del formulario.
        form.onsubmit = async (event) => {
            // Previene el comportamiento por defecto del formulario (recargar la página).
            event.preventDefault();
            // Si ya se está enviando el formulario, no hace nada.
            if (enviando) return;
            // Valida los campos del formulario.
            if (!validate.validarCampos(e)) return;

            // Obtiene la lista de permisos seleccionados del formulario.
            const permisosSeleccionados = Array.from(
                modal.querySelectorAll('input[name="permisos"]:checked')
            ).map(i => Number(i.value));

            // Crea un objeto payload con los datos del formulario y los permisos seleccionados.
            const payload = {
                ...validate.datos,
                permisos: permisosSeleccionados
            };

            try {
                // Establece la variable enviando a true para evitar el envío múltiple del formulario.
                enviando = true;

                // Envía la petición a la API para crear el rol.
                const response = await post("roles/create", payload);

                // Si la respuesta no es exitosa.
                if (!response?.success) {
                    // Muestra un mensaje de error.
                    error(response?.message || "Error al crear el rol");
                    // Restablece la variable enviando a false para permitir el envío del formulario nuevamente.
                    enviando = false;
                    return;
                }

                // Cierra el modal.
                cerrarModal(modal);
                // Muestra un mensaje de éxito.
                success(response.message || "Rol creado correctamente");
                // Refresca la lista de roles.
                rolesController();

            } catch (err) {
                // Si ocurre un error inesperado, lo registra en la consola y muestra un mensaje de error.
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            // Restablece la variable enviando a false para permitir el envío del formulario nuevamente.
            enviando = false;
        };
    });
};
