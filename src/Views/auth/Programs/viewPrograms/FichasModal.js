import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import "../../../../Components/Models/modal.css";
import htmlContent from "./index.html?raw";

export const abrirModalPrograma = (item, index) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        document.querySelector("#modalNombre").textContent = `Programa ${index + 1}`;
        document.querySelector("#modalPrograma").textContent = item.training_program || "—";

        document
            .querySelector("#btnCerrarModal")
            .addEventListener("click", cerrarModal);
    });
};
