import "../../../Components/Formulario/formulario.css"
import { post } from "../../../Helpers/api"; 
import * as validate from "../../../Helpers/Modules/modules"; 
import { success, error } from "../../../Helpers/alertas";

export default async () => {
    const form = document.querySelector("#formulario_passwordCode");
    const campos = form.querySelectorAll("input");

    campos.forEach(campo => {
        if (campo.id === "documento") {
            // Validar solo números y longitud máxima mientras se escribe
            campo.addEventListener("keydown", e => {
                validate.validarNumeros(e);
                validate.validarMaximo(e, campo.maxLength || 10);
            });
            // Validar longitud mínima y campo requerido al perder el foco
            campo.addEventListener("blur", e => {
                validate.validarMinimo(e, campo.minLength || 6);
                validate.validarCampo(e);
            });
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validate.validarCampos(e,"login")) {
            console.log("Campos inválidos");
            return;
        }

        const data = {
            document: String(validate.datos.document)
        };


        console.log("Datos a enviar:", data);

        // Llamada a tu endpoint de recuperación de contraseña
        const response = await post('Reset-password', data);      

        // Manejo de errores
        if (!response.success || (response.errors && response.errors.length > 0)) {
            if (response.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response.message || "Error al iniciar sesión");
            }
            return; // Salimos para no mostrar success
        }
        localStorage.setItem("email_reset", response.data.email);


        // Éxito
        success(response.message || "Se ha enviado el correo de recuperación correctamente");    
        form.reset();
                
        window.location.hash = `#/Verifycode`

        
    });

};
