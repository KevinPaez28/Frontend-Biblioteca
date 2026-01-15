import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import"../../../../Components/Models/modal.css";
import htmlContent from "./viewFichas.html?raw";

export const abrirModalFicha = (item, index) => {

    mostrarModal(htmlContent);

    requestAnimationFrame(() => {
        document.querySelector("#modalNombre").textContent = `Ficha ${index + 1}`;
        document.querySelector("#modalFicha").textContent = item.ficha;
        document.querySelector("#modalPrograma").textContent = item.programa?.training_program || "—";

        document
            .querySelector("#btnCerrarModal")
            .addEventListener("click", cerrarModal);
    });
};

