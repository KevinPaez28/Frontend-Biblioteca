import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

/**
 * @description Mapa que relaciona los nombres de los permisos con nombres más amigables para la interfaz de usuario.
 */
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

/**
 * @description Listado de permisos que se ocultan en la visualización del modal.
 * Estos permisos no se mostrarán al usuario.
 */
const permisosOcultos = [
    "auth.login",
    "auth.reset-password",
    "auth.reset-password.change",
    "auth.validate-token",
    "user-status.index",
    "user-status.store",
    "user-status.update",
    "user-status.destroy",
];

/**
 * @description Función para abrir un modal y mostrar la información de un rol específico.
 * @param {object} item - Objeto que contiene la información del rol a mostrar.
 * @param {number} index - Índice del rol en la lista.
 */
export const abrirModalRol = (item, index) => {

    // Muestra el modal utilizando la función mostrarModal y el contenido HTML importado.
    const modal = mostrarModal(htmlContent);

    // Utiliza requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(() => {

        // Obtiene referencias a los elementos del DOM dentro del modal.
        const nombre = modal.querySelector("#modalNombre");
        const rolNombre = modal.querySelector("#modalRol");
        const permisosContainer = modal.querySelector("#modalPermisos");
        const btnCerrar = modal.querySelector("#btnCerrarModal");

        // Si no se encuentra el contenedor de permisos, sale de la función.
        if (!permisosContainer) return;

        // Establece el título del modal con el índice del rol.
        nombre.textContent = `Rol ${index + 1}`;
        // Establece el nombre del rol en el modal, o muestra "—" si no está disponible.
        rolNombre.textContent = item.name || "—";

        // Limpia el contenedor de permisos antes de agregar nuevos permisos.
        permisosContainer.innerHTML = "";

        // Si el rol tiene permisos asignados, los muestra.
        if (item.permissions?.length) {

            // Filtra los permisos para ocultar los permisos que están en la lista de permisos ocultos.
            const permisosFiltrados = item.permissions.filter(p =>
                !permisosOcultos.includes(p.name)
            );

            // Si hay permisos filtrados para mostrar, los muestra.
            if (permisosFiltrados.length) {
                permisosFiltrados.forEach(perm => {
                    // Crea un elemento span para cada permiso.
                    const span = document.createElement("span");
                    // Agrega la clase "badge-permissions" para aplicar estilos visuales.
                    span.classList.add("badge-permissions");
                    // Establece el texto del span con el nombre amigable del permiso o el nombre del permiso si no hay nombre amigable.
                    span.textContent = permisoLabels[perm.name] || perm.name;
                    // Agrega un margen derecho para separar los permisos.
                    span.style.marginRight = "3px";
                    // Agrega el span al contenedor de permisos.
                    permisosContainer.appendChild(span);
                });
            } else {
                // Si no hay permisos filtrados para mostrar, muestra un mensaje indicando que no hay permisos visibles.
                permisosContainer.innerHTML =
                    `<span class="badge badge-secondary">Sin permisos visibles</span>`;
            }

        } else {
            // Si el rol no tiene permisos asignados, muestra un mensaje indicando que no tiene permisos.
            permisosContainer.innerHTML =
                `<span class="badge badge-secondary">Sin permisos</span>`;
        }

        // Agrega un event listener al botón de cerrar para cerrar el modal.
        btnCerrar.addEventListener("click", () => cerrarModal(modal));
    });
};
