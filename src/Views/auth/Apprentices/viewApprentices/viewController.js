import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";


// ============================================================================
// FUNCIÓN: abrirModalAprendiz
// ============================================================================
// - Abre un modal de **solo lectura** (detalle/visualización) de aprendiz.
// - Recibe "item" (datos del aprendiz) y "index" (posición en lista).
// - Llena **todos los campos del modal** con datos formateados.
// - Maneja valores nulos con fallback ("—" o "Usuario X").
// ============================================================================
export const abrirModalAprendiz = (item, index) => {

    // Abre el modal con la plantilla HTML de detalle
    const modal = mostrarModal(htmlContent);

    // Espera a que el DOM esté renderizado antes de llenar datos
    requestAnimationFrame(() => {

        // ===== DOCUMENTO =====
        modal.querySelector("#modalDocumentoUsuario").textContent =
            item.document || "—";

        // ===== FICHA =====
        modal.querySelector("#modalFichaUsuario").textContent =
            item.ficha || "—";

        // ===== PROGRAMA =====
        modal.querySelector("#modalProgramaUsuario").textContent =
            item.programa || "—";

        // ===== NOMBRE =====
        // Si no tiene nombre, muestra "Usuario [posición]"
        modal.querySelector("#modalNombreUsuario").textContent =
            item.first_name || `Usuario ${index + 1}`;

        // ===== APELLIDO =====
        modal.querySelector("#modalApellidoUsuario").textContent =
            item.last_name || "—";

        // ===== TELÉFONO =====
        modal.querySelector("#modalTelefonoUsuario").textContent =
            item.phone_number || "—";

        // ===== CORREO =====
        modal.querySelector("#modalCorreoUsuario").textContent =
            item.email || "—";

        // ===== ROL =====
        modal.querySelector("#modalRolUsuario").textContent =
            item.rol || "—";

        // ===== ESTADO =====
        // Prefijo "Estado: " + valor o fallback
        modal.querySelector("#modalEstadoUsuario").textContent =
            "Estado: " + (item.estado || "—");

        // ===== BOTÓN CERRAR =====
        modal.querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
