import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalEvento = (item, index) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        modal.querySelector("#modalNombreEvento").textContent =
            item.name || `Evento ${index + 1}`;

        modal.querySelector("#modalEncargadoEvento").textContent =
            item.mandated || "—";

        modal.querySelector("#modalAreaEvento").textContent =
            item.room?.name || "—";

        modal.querySelector("#modalFechaEvento").textContent =
            item.date || "—";

        modal.querySelector("#modalHoraInicioEvento").textContent =
            item.time.start || "—";

        modal.querySelector("#modalHoraFinEvento").textContent =
            item.time.end || "—";

        modal.querySelector("#modalEstadoEvento").textContent =
            "Estado: " + (item.state?.name || "—");

        modal.querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
