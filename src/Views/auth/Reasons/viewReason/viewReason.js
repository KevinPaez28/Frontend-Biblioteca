import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalReason = (item, index) => {
    console.log(item);
    
    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        modal.querySelector('#modalNombreMotivo').textContent =
            item.name || `Motivo ${index + 1}`;

        modal.querySelector('#modalUsoSala').textContent =
            item.description || '';

        modal.querySelector('#modalActivo').textContent =
            "Estado: " + (item.state?.name || "—");

        modal
            .querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
