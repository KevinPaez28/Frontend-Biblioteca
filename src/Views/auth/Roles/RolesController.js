import "../../../Styles/Schedules/Schedules.css";
import { get } from "../../../Helpers/api.js";
import { abrirModalRol } from "./viewRoles/RolesModal.js";
import { editarModalRol } from "./editsRoles/editRoles.js";
// import { editarModalRol } from "./editRoles/editRoles.js";
// import { abrirModalCrearRol } from "./createRoles/createRoles.js";

// Mapa de permisos amigables
const permisoLabels = {
    // AUTH
    "auth.login": "Iniciar sesión",
    "auth.reset-password": "Solicitar recuperación",
    "auth.reset-password.change": "Cambiar contraseña",
    "auth.validate-token": "Validar token",

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

// Lista de permisos que NO queremos mostrar en la tabla
const permisosOcultos = [
    "users.search",
    "history.destroy",
    "actions.destroy",
    "documents.destroy",
];

export default async () => {
    const tbody = document.getElementById("roles-tbody");
    const btnNuevoRol = document.getElementById("btnNuevoRol");
    const inputBuscar = document.querySelector(".input-filter");
    const btnBuscar = document.querySelector(".btn-outline");

    const cargarRoles = async (search = "") => {
        const roles = await get(`roles?search=${search}`);
        tbody.innerHTML = "";

        if (roles && roles.data && roles.data.length > 0) {
            roles.data.forEach((item, index) => {
                const tr = document.createElement("tr");

                // ===== # =====
                const td1 = document.createElement("td");
                td1.textContent = index + 1;

                // ===== NOMBRE ROL =====
                const td2 = document.createElement("td");
                td2.textContent = item.name;

                // ===== PERMISOS =====
                const td3 = document.createElement("td");
                if (item.permissions && item.permissions.length > 0) {
                    // Filtramos los permisos que no queremos mostrar
                    const permisosFiltrados = item.permissions.filter(p => !permisosOcultos.includes(p.name));
                    const maxVisible = 3;
                    const visibles = permisosFiltrados.slice(0, maxVisible);

                    visibles.forEach(perm => {
                        const span = document.createElement("span");
                        span.classList.add("badge-permissions");
                        span.textContent = permisoLabels[perm.name] || perm.name;
                        span.style.marginRight = "3px";
                        td3.appendChild(span);
                    });

                    if (permisosFiltrados.length > maxVisible) {
                        const span = document.createElement("span");
                        span.classList.add("badge", "badge-secondary");
                        span.textContent = `+${permisosFiltrados.length - maxVisible} más`;
                        td3.appendChild(span);
                    }

                    td3.title = permisosFiltrados.map(p => permisoLabels[p.name] || p.name).join(", ");
                } else {
                    const span = document.createElement("span");
                    span.classList.add("badge", "badge-secondary");
                    span.textContent = "Sin permisos";
                    td3.appendChild(span);
                }

                // ===== ACCIONES =====
                const td4 = document.createElement("td");

                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => abrirModalRol(item, index));

                const btnEditar = document.createElement("button");
                btnEditar.classList.add("btn-editar");
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener("click", () => editarModalRol(item, index));

                const btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar");
                btnEliminar.textContent = "Eliminar";

                td4.appendChild(btnVer);
                td4.appendChild(btnEditar);
                td4.appendChild(btnEliminar);

                // ===== APPEND FINAL =====
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);

                tbody.appendChild(tr);
            });
        } else {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 4;
            td.textContent = "No hay roles registrados";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    };

    btnNuevoRol.addEventListener("click", () => abrirModalCrearRol());
    btnBuscar.addEventListener("click", () => cargarRoles(inputBuscar.value.trim()));
    inputBuscar.addEventListener("keyup", () => cargarRoles(inputBuscar.value.trim()));

    await cargarRoles();
};
