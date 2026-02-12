import "../../Components/Formulario/formulario.css"
import { get, post } from "../../Helpers/api";
import * as validate from "../../Helpers/Modules/modules"; // validaciones
import { success, error, loading, closeAlert } from "../../Helpers/alertas";
console.count("HomeController cargado");

export default async () => {
    // ================= OBTENER ELEMENTOS DEL DOM =================
    // Obtenemos el formulario principal
    const form = document.querySelector(".form__form");
    // Obtenemos los selects por clase
    const selectMotivos = document.querySelector(".motivos");
    const selectEventos = document.querySelector(".eventos");

    // ================= CARGAR DATOS DESDE API =================
    // Traemos los motivos y los eventos de hoy desde la API
    const eventos = await get("eventos/today");
    const motivos = await get("motivos");

    // ================= RELLENAR SELECTS =================
    // Rellenamos select de motivos
    motivos.data.forEach(m => {
        const op = document.createElement("option");
        op.value = m.id;
        op.textContent = m.name;
        selectMotivos.append(op);
    });

    // Rellenamos select de eventos
    eventos.data.forEach(ev => {
        const op = document.createElement("option");
        op.value = ev.id;
        op.textContent = ev.name;
        selectEventos.append(op);
    });

    // ================= EVENTO CAMBIO DE MOTIVO =================
    // Mostramos el select de eventos solo si el motivo seleccionado es "evento"
    selectMotivos.addEventListener("change", () => {
        const motivoEvento = motivos.data.find(m => m.name.toLowerCase() === "evento");
        const clase = document.querySelector(".form__grupo.activo");
        if (selectMotivos.value == motivoEvento?.id) {
            clase.classList.remove("oculto");
        } else {
            clase.classList.add("oculto");
            // Limpiamos el select de eventos si no corresponde
            selectEventos.value = "";
        }
    });

    // ================= VALIDACIONES DE CAMPOS =================
    // Tomamos todos los inputs, selects y textareas del formulario
    const campos = form.querySelectorAll("input, select, textarea");

    campos.forEach(campo => {
        // ================= NUMEROS: Documento =================
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

        // ================= VALIDACIÓN GENERAL =================
        // Para otros campos: validar que no estén vacíos al perder el foco
        campo.addEventListener("blur", validate.validarCampo);
    });

    // ================= SUBMIT DEL FORMULARIO =================

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        if (!validate.validarCampos(event)) return;

        try {

            loading("Registrando asistencia...");

            // Esperar a que reCAPTCHA esté listo
            await grecaptcha.ready(async () => {

                const token = await grecaptcha.execute(
                    "6Lc2YmksAAAAAJ_KMFarZmicnTEqWt1wdi-Q6xAf",
                    { action: "asistencia" }
                );

                const data = {
                    ...validate.datos,
                    recaptcha_token: token
                };
                console.log(data);
                
                const response = await post("asistencia/create", data);

                if (!response || !response.success) {
                    if (response?.errors && response.errors.length > 0) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al registrar");
                    }
                    return;
                }
                closeAlert()
                success(response.message || "Asistencia registrada correctamente");
                form.reset();
            });

        } catch (err) {
            console.error(err);
            error("Error con reCAPTCHA");
        }
    });

};
