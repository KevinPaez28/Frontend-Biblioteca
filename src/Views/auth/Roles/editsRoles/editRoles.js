import { patch, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarRol from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import rolesController from "../RolesController.js";

// Mapa de permisos amigables (el mismo que usas en la tabla)
const permisoLabels = {
    "auth.login": "Iniciar sesión",
    "auth.reset-password": "Solicitar recuperación",
    "auth.reset-password.change": "Cambiar contraseña",
    "auth.validate-token": "Validar token",
    "users.index": "Ver usuarios",
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

export const editarModalRol = async (rol) => {
    mostrarModal(htmlEditarRol);

    requestAnimationFrame(async () => {
        const btnCerrar = document.querySelector("#btnCerrarModal");
        const form = document.querySelector("#formRol");
        const permisosContainer = document.querySelector("#permisosContainer");

        // ===== PRECARGAR DATOS =====
        document.querySelector("#inputRol").value = rol.name || "";

        // Cargar permisos desde backend
        let permisos = [];
        try {
            const response = await get("roles/permisos");
            if (response && response.success) permisos = response.data;
        } catch (err) {
            console.error(err);
            error("No se pudieron cargar los permisos");
        }

        // Renderizar checkboxes como badges
        permisosContainer.innerHTML = permisos.map(p => {
            const isChecked = rol.permissions?.some(rp => rp.id === p.id);
            return `
                <label class="permiso-item badge ${isChecked ? "badge-permissions   " : "badge-permissions"}" style="margin:3px; cursor:pointer;">
                    <input type="checkbox" name="permisos" value="${p.id}" ${isChecked ? "checked" : ""} style="margin-right:5px;">
                    ${permisoLabels[p.name] || p.name}
                </label>
            `;
        }).join("");

        btnCerrar.addEventListener("click", cerrarModal);

        let enviando = false;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (enviando) return;
            if (!validate.validarCampos(e)) return;

            const permisosSeleccionados = Array.from(
                document.querySelectorAll('input[name="permisos"]:checked')
            ).map(input => Number(input.value));

            const payload = { 
                ...validate.datos,
                permisos: permisosSeleccionados
            };

            try {
                enviando = true;
                const response = await patch(`roles/edit/${rol.id}`, payload);
                console.log(response);
                
                if (!response || !response.success) {
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                        cerrarModal();
                    } else {
                        error(response?.message || "Error al actualizar el rol");
                    }
                    enviando = false;
                    return;
                }

                form.reset();
                cerrarModal();
                success(response.message || "Rol actualizado correctamente");
                rolesController();
                enviando = false;

            } catch (err) {
                console.error(err);
                error("Ocurrió un error inesperado");
                enviando = false;
            }
        });
    });
};
