import "../../Styles/Formulario/Formulario.css"
import { get, post } from "../../Helpers/api";
import { validarCampos, datos } from "../../Helpers/Modules/modules";
import { success, error } from "../../Helpers/alertas";

export default async () => {

    const form = document.querySelector(".form__form");
    const selectMotivos = document.querySelector(".motivos");
    const usuario_id = document.querySelector("#documento")
    const motivo = document.querySelector("#motivo")
    // Cargar motivos
    const motivos = await get("motivos");

    motivos.data.forEach(m => {
        const option = document.createElement("option");
        option.value = m.id;
        option.textContent = m.name;
        selectMotivos.append(option);
    });

    // SUBMIT
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validarCampos(e)) {
            error("Por favor corrige los campos con error");
            return;
        }

        const data = {
            usuario_id: (datos.user_id),
            motivo: (datos.reason_id),
        };

        console.log("DATA ENVIADA:", data);

        const response = await post("asistencia", data);

        if (!response.success) {
            error(response.message || "Error al registrar la asistencia");
            return;
        }

        success("Asistencia registrada con éxito");
        form.reset();
    });
};
