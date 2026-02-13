import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

/**
 * @description Abre un modal para mostrar la información de un usuario.
 * @param {object} item Objeto que contiene la información del usuario a mostrar.
 *  Debe incluir las propiedades 'document', 'document_type', 'first_name', 'last_name',
 * 'phone_number', 'email', 'rol' y 'estado'.
 * @param {number} index Índice del usuario en la lista.
 */
export const abrirModalUsuario = (item, index) => {

    // Muestra el modal utilizando la función mostrarModal y el contenido HTML importado.
    const modal = mostrarModal(htmlContent);

    // Utiliza requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo.
    requestAnimationFrame(() => {

        // Obtiene referencias a los elementos del DOM dentro del modal.
        const documento = modal.querySelector("#modalDocumentoUsuario");
        const Tipodocumento = modal.querySelector("#modalTipoDocumentoUsuario");
        const nombre = modal.querySelector("#modalNombreUsuario");
        const apellido = modal.querySelector("#modalApellidoUsuario");
        const telefono = modal.querySelector("#modalTelefonoUsuario");
        const correo = modal.querySelector("#modalCorreoUsuario");
        const rol = modal.querySelector("#modalRolUsuario");
        const estado = modal.querySelector("#modalEstadoUsuario");
        const btnCerrar = modal.querySelector("#btnCerrarModal");

        // Establece el contenido de texto de los elementos del modal con la información del usuario.
        documento.textContent = item.document || "—";
        Tipodocumento.textContent = item.document_type || "—";
        nombre.textContent = item.first_name || `Usuario ${index + 1}`;
        apellido.textContent = item.last_name || "—";
        telefono.textContent = item.phone_number || "—";
        correo.textContent = item.email || "—";
        rol.textContent = item.rol || "—";
        estado.textContent = "Estado: " + (item.estado || "—");

        // Agrega un event listener al botón de cerrar para cerrar el modal cuando se hace clic.
        btnCerrar.addEventListener("click", () => cerrarModal(modal));
    });
};
