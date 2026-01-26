import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalAprendiz = (item, index) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {

        modal.querySelector("#modalDocumentoUsuario").textContent =
            item.document || "—";

        modal.querySelector("#modalFichaUsuario").textContent =
            item.ficha || "—";

        modal.querySelector("#modalProgramaUsuario").textContent =
            item.programa || "—";

        modal.querySelector("#modalNombreUsuario").textContent =
            item.first_name || `Usuario ${index + 1}`;

        modal.querySelector("#modalApellidoUsuario").textContent =
            item.last_name || "—";

        modal.querySelector("#modalTelefonoUsuario").textContent =
            item.phone_number || "—";

        modal.querySelector("#modalCorreoUsuario").textContent =
            item.email || "—";

        modal.querySelector("#modalRolUsuario").textContent =
            item.rol || "—";

        modal.querySelector("#modalEstadoUsuario").textContent =
            "Estado: " + (item.estado || "—");

        modal.querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
