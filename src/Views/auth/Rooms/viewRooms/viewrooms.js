import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalReason = (item, index) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        modal.querySelector('#modalNombreMotivo').textContent =
            item.name || `Motivo ${index + 1}`;

        modal.querySelector('#modalDescripcionMotivo').textContent =
            item.description || '';

        modal.querySelector('#modalEstadoMotivo').textContent =
            "Estado: " + item.state.name;

        modal
            .querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};

