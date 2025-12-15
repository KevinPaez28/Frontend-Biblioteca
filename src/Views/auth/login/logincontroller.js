import "../../../Components/Formulario/formulario.css"

import { get, login, post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules"; // validaciones
import { success, error } from "../../../Helpers/alertas";

export default async () => {

    // ================= OBTENER ELEMENTOS DEL DOM =================
    const form = document.querySelector("#formulario_login");

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
            return; // Salimos del forEach para no aplicar otras validaciones
        }
    });

    // ================= SUBMIT DEL FORMULARIO =================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validate.validarCampos(e,"login")) {
            console.log("dañado");
            return;
        }
        

        // Obtenemos los datos validados
        const data = {
            document: String(validate.datos.document),
            password: String(validate.datos.password)
        };

        console.log(data);
        
        const response = await login(data);
        console.log(response);
        
        // ===== Manejo de errores =====
        if (!response.success || (response.errors && response.errors.length > 0)) {
            if (response.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response.message || "Error al iniciar sesión");
            }
            return; // Salimos para no mostrar success
        }

        // ===== Login exitoso =====
        success(response.message || "Inicio de sesión exitoso");
        form.reset();
    });
};
