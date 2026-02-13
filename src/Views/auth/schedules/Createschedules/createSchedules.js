import { get, post } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearHorario from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import schedulesController from "../schedulesController.js";

/**
 * @description Función asíncrona para abrir un modal y crear un nuevo horario.
 */
export const abrirModalCrearHorario = async () => {
    // Evitar abrir más de un modal de crear horario
    if (document.querySelector("#formHorario")) return;

    // Muestra el modal utilizando la función mostrarModal y el HTML importado.
    const modal = mostrarModal(htmlCrearHorario);

    // ====== REFERENCIAS LOCALES AL MODAL ======
    // Obtiene referencias a los elementos del DOM dentro del modal.
    const btnCerrar = modal.querySelector("#btnCerrarModal");
    const form = modal.querySelector("#formHorario");
    const selectDia = modal.querySelector("#selectDia");
    const selectTurno = modal.querySelector("#selectTurno");
    const seccionOpcional = modal.querySelector("#seccionOpcional"); // sección dinámica opcional

    // ====== BOTÓN CERRAR ======
    // Agrega un event listener al botón de cerrar para cerrar el modal cuando se hace clic.
    btnCerrar.addEventListener("click", () => cerrarModal(modal));

    // ====== EVENTOS DINÁMICOS ======
    // Agrega un event listener al select de turnos para mostrar u ocultar la sección opcional según el valor seleccionado.
    selectTurno?.addEventListener("change", () => {
        // Si la sección opcional existe, muestra u oculta la sección según el valor del select de turnos.
        if (seccionOpcional) {
            seccionOpcional.style.display = selectTurno.value === "Especial" ? "block" : "none";
        }
    });
    // ====== SUBMIT ======
    // Variable para controlar el envío múltiple del formulario.
    let enviando = false;

    /**
     * @description Función asíncrona para manejar el envío del formulario.
     * @param {Event} e Objeto de evento del formulario.
     */
    const handleSubmit = async (e) => {
        // Previene el comportamiento por defecto del formulario (recargar la página).
        e.preventDefault();
        // Detiene la propagación del evento para evitar que se disparen otros eventos.
        e.stopPropagation();
        // Si ya se está enviando el formulario, sale de la función.
        if (enviando) return;
        // Valida los campos del formulario utilizando la función validarCampos.
        if (!validate.validarCampos(e)) return;

        // Establece la variable enviando a true para evitar el envío múltiple.
        enviando = true;

        // Crea un objeto payload con los datos del formulario validados.
        const payload = { ...validate.datos };

        try {
            // Envía la petición a la API para crear el horario.
            const response = await post("horarios/create", payload);

            // Si la respuesta no es exitosa.
            if (!response || !response.success) {
                // Si hay errores en la respuesta, los muestra.
                if (response?.errors?.length) {
                    response.errors.forEach(err => error(err));
                } else {
                    // Si no hay errores específicos, muestra un mensaje de error genérico.
                    error(response?.message || "Error al crear el horario");
                }
                // Restablece la variable enviando a false para permitir futuros envíos.
                enviando = false;
                return;
            }

            // Limpia el formulario.
            form.reset();
            // Cierra el modal.
            cerrarModal(modal);
            // Refresca la lista de horarios.
            schedulesController()
            // Muestra un mensaje de éxito.
            success(response.message || "Horario creado correctamente");

        } catch (err) {
            // Si ocurre un error inesperado, lo registra en la consola y muestra un mensaje de error.
            console.error(err);
            error("Ocurrió un error inesperado");
        }

        // Restablece la variable enviando a false.
        enviando = false;
    };

    // Elimina el event listener anterior para evitar la acumulación de eventos.
    form.removeEventListener("submit", handleSubmit); // limpieza por seguridad
    // Agrega un event listener al formulario para manejar el envío del formulario.
    form.addEventListener("submit", handleSubmit);
};
