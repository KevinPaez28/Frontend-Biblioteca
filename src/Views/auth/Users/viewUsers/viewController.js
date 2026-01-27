import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalUsuario = (item, index) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {

        const documento = modal.querySelector("#modalDocumentoUsuario");
        const nombre = modal.querySelector("#modalNombreUsuario");
        const apellido = modal.querySelector("#modalApellidoUsuario");
        const telefono = modal.querySelector("#modalTelefonoUsuario");
        const correo = modal.querySelector("#modalCorreoUsuario");
        const rol = modal.querySelector("#modalRolUsuario");
        const estado = modal.querySelector("#modalEstadoUsuario");
        const btnCerrar = modal.querySelector("#btnCerrarModal");

        if (!documento || !nombre || !apellido || !telefono || !correo || !rol || !estado || !btnCerrar) {
            console.error("Elementos del modal usuario no encontrados");
            cerrarModal(modal);
            return;
        }

        documento.textContent = item.document || "—";
        nombre.textContent = item.first_name || `Usuario ${index + 1}`;
        apellido.textContent = item.last_name || "—";
        telefono.textContent = item.phone_number || "—";
        correo.textContent = item.email || "—";
        rol.textContent = item.rol || "—";
        estado.textContent = "Estado: " + (item.estado || "—");

        btnCerrar.addEventListener("click", () => cerrarModal(modal));
    });
};
    