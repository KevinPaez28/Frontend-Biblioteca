import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalEvento = (item, index) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        document.querySelector("#modalNombreEvento").textContent =
            item.name || `Evento ${index + 1}`;

        document.querySelector("#modalEncargadoEvento").textContent =
            item.mandated || "—";

        document.querySelector("#modalAreaEvento").textContent =
            item.room?.name || "—";

        document.querySelector("#modalFechaEvento").textContent =
            item.date || "—";

        document.querySelector("#modalEstadoEvento").textContent =
            "Estado: " + (item.state?.name || "—");

        document
            .querySelector("#btnCerrarModal")
            .addEventListener("click", cerrarModal);
    });
};
