import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

// Mismos nombres amigables que en la tabla
const permisoLabels = {
    "auth.login": "Iniciar sesión",
    "auth.reset-password": "Recuperar contraseña",
    "auth.reset-password.change": "Cambiar contraseña",
    "auth.validate-token": "Validar token",
    "users.index": "Ver usuarios",
    "users.search": "Buscar usuarios",
    "users.store": "Crear usuario",
    "users.update": "Actualizar usuario",
    "users.destroy": "Eliminar usuario",
    "roles.index": "Ver roles",
    "roles.store": "Crear rol",
    "roles.update": "Actualizar rol",
    "roles.destroy": "Eliminar rol",
    "programs.index": "Ver programas",
    "programs.store": "Crear programa",
    "programs.update": "Actualizar programa",
    "programs.destroy": "Eliminar programa",
    "profiles.index": "Ver perfiles",
    "profiles.store": "Crear perfil",
    "profiles.update": "Actualizar perfil",
    "profiles.destroy": "Eliminar perfil",
    "fichas.index": "Ver fichas",
    "fichas.store": "Crear ficha",
    "fichas.update": "Actualizar ficha",
    "fichas.destroy": "Eliminar ficha",
    "documents.index": "Ver documentos",
    "documents.store": "Crear documento",
    "documents.update": "Actualizar documento",
    "documents.destroy": "Eliminar documento",
    "actions.index": "Ver acciones",
    "actions.store": "Crear acción",
    "actions.update": "Actualizar acción",
    "actions.destroy": "Eliminar acción",
    "history.index": "Ver historial",
    "history.store": "Crear historial",
    "history.update": "Actualizar historial",
    "history.destroy": "Eliminar historial",
    "schedules.index": "Ver horarios",
    "schedules.store": "Crear horario",
    "schedules.update": "Actualizar horario",
    "schedules.destroy": "Eliminar horario",
    "shifts.index": "Ver jornadas",
    "shifts.store": "Crear jornada",
    "shifts.update": "Actualizar jornada",
    "shifts.destroy": "Eliminar jornada",
    "reasons.index": "Ver motivos",
    "reasons.store": "Crear motivo",
    "reasons.update": "Actualizar motivo",
    "reasons.destroy": "Eliminar motivo",
    "events.index": "Ver eventos",
    "events.today": "Eventos hoy",
    "events.store": "Crear evento",
    "events.update": "Actualizar evento",
    "events.destroy": "Eliminar evento",
    "assistances.index": "Ver asistencias",
    "assistances.store": "Registrar asistencia",
    "assistances.update": "Actualizar asistencia",
    "assistances.destroy": "Eliminar asistencia",
    "rooms.index": "Ver salas",
    "rooms.store": "Crear sala",
    "rooms.update": "Actualizar sala",
    "rooms.destroy": "Eliminar sala",
};

export const abrirModalRol = (item, index) => {
    mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        document.querySelector("#modalNombre").textContent = `Rol ${index + 1}`;
        document.querySelector("#modalRol").textContent = item.name || "—";

        const permisosContainer = document.querySelector("#modalPermisos");
        permisosContainer.innerHTML = "";

        if (item.permissions && item.permissions.length > 0) {
            item.permissions.forEach(perm => {
                const span = document.createElement("span");
                span.classList.add("badge-permissions");
                span.textContent = permisoLabels[perm.name] || perm.name; 
                span.style.marginRight = "3px";
                permisosContainer.appendChild(span);
            });
        } else {
            const span = document.createElement("span");
            span.classList.add("badge", "badge-secondary");
            span.textContent = "Sin permisos";
            permisosContainer.appendChild(span);
        }

        document.querySelector("#btnCerrarModal").addEventListener("click", cerrarModal);
    });
};
