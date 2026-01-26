import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalAsistencia = (item, index) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {

        modal.querySelector("#modalDocumento").textContent = item.Documento || "—";
        modal.querySelector("#modalNombres").textContent = item.FirstName || "—";
        modal.querySelector("#modalApellidos").textContent = item.LastName || "—";
        modal.querySelector("#modalFecha").textContent = item.DateTime || "—";
        modal.querySelector("#modalMotivo").textContent = item.Reason || "—";
        modal.querySelector("#modalRol").textContent = item.Role || "—";
        modal.querySelector("#modalFicha").textContent = item.Ficha || "—";

        modal.querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
