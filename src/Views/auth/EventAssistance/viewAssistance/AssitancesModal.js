import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalAsistencia = (item, index) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        modal.querySelector("#modalNombre").textContent = `#${index + 1}`;

        modal.querySelector("#modalEvento").textContent =
            item.Event || "—";

        modal.querySelector("#modalFicha").textContent =
            item.Ficha || "—";

        modal.querySelector("#modalEncargado").textContent =
            `${item.FirstName || ""} ${item.LastName || ""}`.trim() || "—";

        modal.querySelector("#modalFechaHora").textContent = item.DateTime 
            ? new Date(item.DateTime).toLocaleString()
            : "—";

        modal.querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
