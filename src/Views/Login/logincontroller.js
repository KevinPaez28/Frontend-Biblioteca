import "../../Styles/Formulario/Formulario.css";
import { post } from "../../Helpers/api";
import { validarCampos,datos } from "../../Helpers/Modules/modules";
import { success, error } from "../../Helpers/alertas";

export default async () => {
    const form = document.querySelector(" .form__form");
    const documento = document.querySelector(".documento");
    const password = document.querySelector(".contrasena");
    
    // SUBMIT
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validarCampos(e)) {
            error("Por favor corrige los campos marcados");
            return;
        }     

        
        
        const data = {
            document:documento.value,   // viene del input name="documento"
            password:password.value      // viene del input name="password"
        };
        
        console.log(data);

        console.log("DATA ENVIADA:", data);

        const response = await post("login", data);

        console.log("RESPUESTA DEL BACKEND:", response);


        if (!response.success) {
            if (response.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response.message || "Credenciales incorrectas");
            }
            return;
        }

        success("Bienvenido");
        form.reset();
    });
};
