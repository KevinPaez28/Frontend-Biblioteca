import "../../../Components/Formulario/formulario.css"

import { get, login, post } from "../../../Helpers/api";
import * as validate from "../../../Helpers/Modules/modules";
import { success, error, loading } from "../../../Helpers/alertas";

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
    form.onsubmit = async (event) => {
        event.preventDefault();
        
        if (!validate.validarCampos(event, "login")) {
            return;
        }
        
        // Obtenemos los datos validados
        const data = {
            document: String(validate.datos.document),
            password: String(validate.datos.password)
        };
        
        
        loading("Iniciando Sesion")
        
        const response = await login(data);
        
        // ===== Manejo de errores =====
        if (!response.ok || (response.errors && response.errors.length > 0)) {
            if (response.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response.message || "Error al iniciar sesión");
            }
            return;
        }

        // ===== Login exitoso =====
        success(response.message || "Inicio de sesión exitoso");
        localStorage.setItem("role_id", response.data.role_id);
        localStorage.setItem("user_id", response.data.id);
        localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
        localStorage.setItem("nombres", response.data.names)
        localStorage.setItem("apellido", response.data.last_name)
        window.location.hash = "#/Dashboard";
        form.reset();
    };
};
