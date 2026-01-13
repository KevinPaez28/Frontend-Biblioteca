import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalReason = (item, index) => {
    console.log(item);

    mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        document.querySelector('#modalNombreMotivo').textContent = item.name || `Motivo ${index + 1}`;
        document.querySelector('#modalDescripcionMotivo').textContent = item.description || '';
        document.querySelector('#modalEstadoMotivo').textContent =  "Estado: " + item.state.name;

        document.querySelector("#btnCerrarModal").addEventListener("click", cerrarModal);
    });
};
