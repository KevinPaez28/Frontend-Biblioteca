import "../../Styles/Formulario/Formulario.css";
import { get, post } from "../../Helpers/api";
import { validarCampos, datos, validarNumeros } from "../../Helpers/Modules/modules";
import { success, error } from "../../Helpers/alertas";

export default async () => {
    const form = document.querySelector(".form__form");
    const selectMotivos = document.querySelector(".motivos");
    const usuario_id = document.querySelector("#documento");
    const motivo = document.querySelector("#motivo");

    // Cargar motivos
    const motivos = await get("motivos");
    motivos.data.forEach(m => {
        const option = document.createElement("option");
        option.value = m.id;
        option.textContent = m.name;
        selectMotivos.append(option);
    });

    selectMotivos.addEventListener("change",()=>{
        const clase = document.querySelector(".form__grupo.activo");
        if (selectMotivos.value !== "") {
            clase.classList.remove("oculto");
        } 
        else {
            clase.classList.add("oculto");
        }
    })
    
    // SUBMIT
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        if (!validarCampos(e)) {
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
