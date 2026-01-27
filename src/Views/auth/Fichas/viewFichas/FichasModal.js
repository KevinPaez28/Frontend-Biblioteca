import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./viewFichas.html?raw";

export const abrirModalFicha = (item, index) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        modal.querySelector("#modalNombre").textContent = `Ficha ${index + 1}`;
        modal.querySelector("#modalFicha").textContent = item.ficha;
        modal.querySelector("#modalPrograma").textContent =
            item.programa?.training_program || "—";

        modal
            .querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
