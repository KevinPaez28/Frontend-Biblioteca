import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalAsistencia = (item, index) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        document.querySelector("#modalNombre").textContent = `#${index + 1}`;

        document.querySelector("#modalEvento").textContent =
            item.Event || "—";

        document.querySelector("#modalFicha").textContent =
            item.Ficha || "—";

        document.querySelector("#modalEncargado").textContent =
            `${item.FirstName || ""} ${item.LastName || ""}`.trim() || "—";

        document.querySelector("#modalFechaHora").textContent = item.DateTime ? new Date(item.DateTime).toLocaleString()
            : "—";

        document
            .querySelector("#btnCerrarModal")
            .addEventListener("click", cerrarModal);
    });
};
