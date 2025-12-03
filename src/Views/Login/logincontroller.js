import "../../Styles/Formulario/Formulario.css";
import { post } from "../../Helpers/api";
import { validarCampos, datos } from "../../Helpers/Modules/modules";
import { success, error } from "../../Helpers/alertas";

export default async () => {

    const form = document.querySelector(".form__form");

    // Inputs
    const inputDocumento = document.querySelector("#documento");
    const inputPassword = document.querySelector("#password");

    // ========= SUBMIT FORM =============
    form.addEventListener("submit", async (event) => {
    event.preventDefault();

        if (!validarCampos(event)) {
            error("Por favor corrige los campos marcados");
            return;
        }

        const data = {
            document: String(datos.usuario_id),   
            password: datos.password              
        };

        console.log("DATA ENVIADA LOGIN:", data);

        const response = await post("auth/login", data);

        if (!response.success) {
            if (response.errors) {
                response.errors.forEach(err => error(err));
            } else {
                error(response.message || "Credenciales incorrectas");
            }
            return;
        }

        // El backend ya crea las cookies (access + refresh)
        success("Bienvenido");

        // Redirección después de login
        setTimeout(() => {
            window.location.href = "/dashboard"; 
        }, 600);
    });

};
