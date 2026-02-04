import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";


// ============================================================================
// FUNCIÓN: abrirModalAsistencia
// ============================================================================
// - Modal de **detalle/visualización de un registro de asistencia**.
// - Recibe "item" (datos de asistencia) y "index" (posición en lista).
// - Llena campos con **fallback "—"** para datos nulos.
// - **Solo lectura** — no permite edición.
// ============================================================================
export const abrirModalAsistencia = (item, index) => {

    // Abre modal con plantilla HTML de detalle de asistencia
    const modal = mostrarModal(htmlContent);

    // Espera renderizado completo del DOM
    requestAnimationFrame(() => {

        // ===== LLENADO DE CAMPOS (todos con fallback "—") =====
        
        // Documento del aprendiz
        modal.querySelector("#modalDocumento").textContent = item.Documento || "—";
        
        // Nombres del aprendiz
        modal.querySelector("#modalNombres").textContent = item.FirstName || "—";
        
        // Apellidos del aprendiz
        modal.querySelector("#modalApellidos").textContent = item.LastName || "—";
        
        // Fecha y hora de la asistencia
        modal.querySelector("#modalFecha").textContent = item.DateTime || "—";
        
        // Motivo de la asistencia (presente, tarde, falta, etc.)
        modal.querySelector("#modalMotivo").textContent = item.Reason || "—";
        
        // Rol del usuario
        modal.querySelector("#modalRol").textContent = item.Role || "—";
        
        // Ficha del aprendiz
        modal.querySelector("#modalFicha").textContent = item.Ficha || "—";

        // ===== BOTÓN CERRAR =====
        modal.querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
