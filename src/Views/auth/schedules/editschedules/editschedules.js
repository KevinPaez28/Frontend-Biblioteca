import { patch } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlEditarHorario from "./index.html?raw";
import { success, error } from "../../../../Helpers/alertas.js";
import schedulesController from "../schedulesController.js";

/**
 * @description Función para mostrar y manejar el modal de edición de un horario.
 * @param {object} horario - El objeto del horario que se va a editar.
 */
export const editarmodalHorario = (horario) => {
    // Si ya existe un formulario de horario en el DOM, no hacer nada para evitar duplicados
    if (document.querySelector("#formHorario")) return;

    // Mostrar el modal utilizando la función mostrarModal y el HTML importado.
    const modal = mostrarModal(htmlEditarHorario);

    // Utilizar requestAnimationFrame para asegurar que el modal se ha renderizado antes de manipularlo
    requestAnimationFrame(() => {
        // Obtener referencias a los elementos del DOM dentro del modal
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formHorario");
        const inputNombre = modal.querySelector("#inputNombre");
        const inputInicio = modal.querySelector("#inputInicio");
        const inputFin = modal.querySelector("#inputFin");
        const inputJornada = modal.querySelector("#inputJornada");

        // Si no se encuentran todos los elementos necesarios del modal, registrar un error, cerrar el modal y salir de la función
        if (!btnCerrar || !form || !inputNombre || !inputInicio || !inputFin || !inputJornada) {
            console.error("No se encontraron todos los elementos del modal");
            cerrarModal(modal);
            return;
        }

        // Precargar los valores del horario en los campos del formulario
        inputNombre.value = horario.horario;
        inputInicio.value = horario.start_time_24 ?? horario.start_time; // Utiliza el valor de 24 horas si está disponible, sino utiliza el valor original
        inputFin.value = horario.end_time_24 ?? horario.end_time; // Utiliza el valor de 24 horas si está disponible, sino utiliza el valor original
        inputJornada.value = horario.jornada;

        // Agregar un event listener al botón de cerrar para cerrar el modal cuando se hace clic
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // Variable para controlar el envío múltiple del formulario
        let enviando = false;

        /**
         * @description Función asíncrona para manejar el envío del formulario.
         * @param {Event} e El objeto de evento del formulario.
         */
        const handleSubmit = async (e) => {
            // Prevenir el comportamiento por defecto del formulario (recargar la página)
            e.preventDefault();
            // Detener la propagación del evento para evitar que se disparen otros eventos
            e.stopPropagation();
            // Si ya se está enviando el formulario, salir de la función
            if (enviando) return;
            // Validar los campos del formulario utilizando la función validarCampos
            if (!validate.validarCampos(e)) return;

            // Establecer la variable enviando a true para evitar el envío múltiple
            enviando = true;

            // Crear un objeto payload con los datos del formulario validados
            const payload = { ...validate.datos };

            try {
                // Enviar una petición PATCH a la API para actualizar el horario
                const response = await patch(`horarios/${horario.id}`, payload);

                // Si la respuesta de la API no es exitosa
                if (!response || !response.success) {
                    // Cerrar el modal
                    cerrarModal(modal);
                    // Si hay errores específicos en la respuesta, mostrarlos
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        // Si no hay errores específicos, mostrar un mensaje de error genérico
                        error(response?.message || "Error al actualizar el horario");
                    }
                    // Restablecer la variable enviando a false para permitir futuros envíos
                    enviando = false;
                    return;
                }

                // Restablecer los campos del formulario
                form.reset();
                // Cerrar el modal
                cerrarModal(modal);
                // Mostrar un mensaje de éxito
                success(response.message || "Horario actualizado correctamente");
                // Recargar el controlador de horarios
                schedulesController();

            } catch (err) {
                // Registrar cualquier error que ocurra durante la actualización
                console.error(err);
                // Mostrar un mensaje de error genérico al usuario
                error("Ocurrió un error inesperado");
            }

            // Restablecer la variable enviando a false
            enviando = false;
        };

        // Agregar un event listener al formulario para manejar el envío del formulario
        form.addEventListener("submit", handleSubmit);
    });
};
