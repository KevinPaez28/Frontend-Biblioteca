import "../../Styles/Formulario/Formulario.css";
import { get, post } from "../../Helpers/api";
import { validarCampos, datos, validarNumeros } from "../../Helpers/Modules/modules";
import { success, error } from "../../Helpers/alertas";

export default async () => {
    const form = document.querySelector(".form__form");
    const selectMotivos = document.querySelector(".motivos");
    const selecteventos = document.querySelector(".eventos");

    const motivos = await get("motivos");
    const eventos = await get("eventos/today");

    console.log(motivos);

    motivos.data.forEach(m => {
        const option = document.createElement("option");
        option.value = m.id;
        option.textContent = m.name;
        selectMotivos.append(option);
    });


    eventos.data.forEach(m => {
        const events = document.createElement("option");
        events.value = m.id;
        events.textContent = m.name;
        selecteventos.append(events);
    });



    selectMotivos.addEventListener("change", () => {
        const motivo_Id = motivos.data.find(mtv => mtv.name.toLowerCase() == "evento");
        const mtv = motivo_Id.id;
        console.log(mtv);
        const clase = document.querySelector(".form__grupo.activo");
        if (selectMotivos.value == mtv) {

            clase.classList.remove("oculto");
        }
        else {
            clase.classList.add("oculto");
            selecteventos.value = "";
        }
    })

    // SUBMIT
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!validarCampos(event)) {
            error("Por favor corrige los campos con error");
            return;
        }

        const data = {
            usuario_id: datos.usuario_id,
            motivo: datos.motivo,
            evento: datos.evento
        };

        console.log("DATA ENVIADA:", data);

        const response = await post("asistencia/create", data);

        console.log("RESPUESTA DEL BACKEND:", response);

        if (!response.success) { //si la respuesta no fue 200 entra en el if
            if (response.errors && response.errors.length > 0) {
                // Recorremos todos los errores manualmente
                for (let i = 0; i < response.errors.length; i++) {
                    let errMsg = response.errors[i]; // Tomamos cada mensaje de error
                    error(errMsg);                    // Lo mostramos usando con la función error()
                }
            } else {
                // Si no hay arreglo de errores, mostramos el mensaje general
                error(response.message || "Error al registrar la asistencia");
            }
            return;
        }

        success(response.message || "Asistencia registrada con éxito");
        form.reset();
    });
};
