import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

// Mismos nombres amigables que en la tabla
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
    "auth.login",
    "auth.reset-password", 
    "auth.reset-password.change",
    "auth.validate-token",
    "user-status.index",
    "user-status.store",
    "user-status.update",
    "user-status.destroy",
];

export const abrirModalRol = (item, index) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {

        const nombre = modal.querySelector("#modalNombre");
        const rolNombre = modal.querySelector("#modalRol");
        const permisosContainer = modal.querySelector("#modalPermisos");
        const btnCerrar = modal.querySelector("#btnCerrarModal");

        if (!permisosContainer) return;

        nombre.textContent = `Rol ${index + 1}`;
        rolNombre.textContent = item.name || "—";

        permisosContainer.innerHTML = "";

        if (item.permissions?.length) {

            const permisosFiltrados = item.permissions.filter(p =>
                !permisosOcultos.includes(p.name)
            );

            if (permisosFiltrados.length) {
                permisosFiltrados.forEach(perm => {
                    const span = document.createElement("span");
                    span.classList.add("badge-permissions");
                    span.textContent = permisoLabels[perm.name] || perm.name;
                    span.style.marginRight = "3px";
                    permisosContainer.appendChild(span);
                });
            } else {
                permisosContainer.innerHTML =
                    `<span class="badge badge-secondary">Sin permisos visibles</span>`;
            }

        } else {
            permisosContainer.innerHTML =
                `<span class="badge badge-secondary">Sin permisos</span>`;
        }

        btnCerrar.addEventListener("click", () => cerrarModal(modal));
    });
};

