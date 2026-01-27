import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalPrograma = (item, index) => {

    const modal = mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        modal.querySelector("#modalNombre").textContent = `Programa ${index + 1}`;
        modal.querySelector("#modalPrograma").textContent =
            item.training_program || "—";

        modal
            .querySelector("#btnCerrarModal")
            .addEventListener("click", () => cerrarModal(modal));
    });
};
