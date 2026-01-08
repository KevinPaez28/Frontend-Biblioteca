import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import"../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalAsistencia = (item, index) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(() => {

        document.querySelector("#modalDocumento").textContent = item.Documento || "—";
        document.querySelector("#modalNombres").textContent = item.FirstName || "—";
        document.querySelector("#modalApellidos").textContent = item.LastName || "—";
        document.querySelector("#modalFecha").textContent = item.DateTime || "—";
        document.querySelector("#modalMotivo").textContent = item.Reason || "—";
        document.querySelector("#modalRol").textContent = item.Role || "—";
        document.querySelector("#modalFicha").textContent = item.Ficha || "—";

        document
            .querySelector("#btnCerrarModal")
            .addEventListener("click", cerrarModal);
    });
};
