import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalAprendiz = (item, index) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(() => {

        document.querySelector("#modalDocumentoUsuario").textContent =
            item.document || "—";

        document.querySelector("#modalFichaUsuario").textContent =
            item.ficha|| "—";

        document.querySelector("#modalProgramaUsuario").textContent =
            item.programa || "—";

        document.querySelector("#modalNombreUsuario").textContent =
            item.first_name || `Usuario ${index + 1}`;

        document.querySelector("#modalApellidoUsuario").textContent =
            item.last_name || "—";

        document.querySelector("#modalTelefonoUsuario").textContent =
            item.phone_number || "—";

        document.querySelector("#modalCorreoUsuario").textContent =
            item.email || "—";

        document.querySelector("#modalRolUsuario").textContent =
            item.rol || "—";

        document.querySelector("#modalEstadoUsuario").textContent =
            "Estado: " + (item.estado || "—");

        document
            .querySelector("#btnCerrarModal")
            .addEventListener("click", cerrarModal);
    });
};

