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
    "auth.login",
    "auth.reset-password", 
    "auth.reset-password.change",
    "auth.validate-token",
    "user-status.index",
    "user-status.store",
    "user-status.update",
    "user-status.destroy",
];

export const abrirModalCrearRol = async () => {

    const modal = mostrarModal(htmlCrearRol);

    requestAnimationFrame(async () => {

        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formRol");
        const permisosContainer = modal.querySelector("#permisosContainer");

        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ===== CARGAR PERMISOS =====
        try {
            const response = await get("roles/permisos");

            if (response?.success) {
                const permisosFiltrados = response.data.filter(p =>
                    !permisosOcultos.includes(p.name)
                );

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
            console.error(err);
            error("No se pudieron cargar los permisos");
            permisosContainer.innerHTML = `
                <div class="text-center p-3">
                    <span class="badge badge-danger">Error cargando permisos</span>
                </div>
            `;
        }

        let enviando = false;

        // ===== SUBMIT =====
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(e)) return;

            const permisosSeleccionados = Array.from(
                modal.querySelectorAll('input[name="permisos"]:checked')
            ).map(i => Number(i.value));

            const payload = {
                ...validate.datos,
                permisos: permisosSeleccionados
            };

            try {
                enviando = true;

                const response = await post("roles/create", payload);

                if (!response?.success) {
                    error(response?.message || "Error al crear el rol");
                    enviando = false;
                    return;
                }

                cerrarModal(modal);
                success(response.message || "Rol creado correctamente");
                rolesController();

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
            }

            enviando = false;
        });
    });
};
