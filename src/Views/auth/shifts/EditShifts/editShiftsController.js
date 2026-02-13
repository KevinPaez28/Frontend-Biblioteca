import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import { get, patch } from "../../../../Helpers/api.js";
import html from "./editShifts.html?raw";
import "../../../../Styles/shifts/shiftsModal.css";
import { error, success } from "../../../../Helpers/alertas.js";
import shiftsController from "../shiftsController.js";

/**
 * Abre un modal para editar el horario de una jornada.
 *
 * @async
 * @function editarmodalHorario
 * @param {object} jornada - Objeto que contiene la información de la jornada a editar.
 * @param {number} jornada.id - ID de la jornada.
 * @param {string} jornada.jornada - Nombre de la jornada.
 * @throws {Error} Si no se encuentran los elementos necesarios en el modal, o si ocurre un error al cargar los horarios o al guardar la asignación.
 * @returns {void}
 */
export const editarmodalHorario = async (jornada) => {
    // Abre el modal utilizando la función mostrarModal del archivo modalManagement.js
    const modal = mostrarModal(html);

    requestAnimationFrame(async () => {

        // Obtiene referencias a los elementos del DOM dentro del modal
        const horariosContainer = modal.querySelector("#horariosContainer");
        const btnCerrarModal = modal.querySelector("#btnCerrarModal");
        const btnGuardarAsignacion = modal.querySelector("#btnGuardarAsignacion");

        // Verifica si los elementos necesarios existen en el DOM
        if (!horariosContainer || !btnCerrarModal || !btnGuardarAsignacion) {
            console.error("Elementos del modal no encontrados");
            cerrarModal(modal);
            return;
        }

        // Limpia el contenido del contenedor de horarios
        horariosContainer.innerHTML = "";

        // Realiza una petición GET al endpoint "horarios" para obtener la lista de horarios
        const res = await get("horarios");

        // Si la petición es exitosa y se obtienen datos, itera sobre la lista de horarios
        if (res && res.data && res.data.length > 0) {

            res.data.forEach((item) => {

                // Crea los elementos HTML para representar cada horario
                const label = document.createElement("label");
                label.classList.add("horario-card");

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "horario_id";
                radio.classList.add("horario-card__check");
                radio.value = item.id;

                const info = document.createElement("div");
                info.classList.add("horario-card__info");

                const nombre = document.createElement("p");
                nombre.classList.add("horario-card__title");
                nombre.textContent = item.name;

                const horas = document.createElement("p");
                horas.classList.add("horario-card__time");
                horas.textContent = `${item.start_time} - ${item.end_time}`;

                // Agrega los elementos al DOM
                info.appendChild(nombre);
                info.appendChild(horas);

                label.appendChild(radio);
                label.appendChild(info);

                horariosContainer.appendChild(label);
            });

        // Si no hay horarios registrados, muestra un mensaje
        } else {
            const p = document.createElement("p");
            p.textContent = "No hay horarios registrados";
            horariosContainer.appendChild(p);
        }

        // ===== CERRAR =====
        // Agrega un event listener al botón de cerrar para cerrar el modal
        btnCerrarModal.addEventListener("click", () => cerrarModal(modal));

        // ===== GUARDAR =====
        // Agrega un event listener al botón de guardar para guardar la asignación del horario
        btnGuardarAsignacion.addEventListener("click", async () => {

            // Obtiene el horario seleccionado
            const seleccionado = modal.querySelector(".horario-card__check:checked");

            // Valida que se haya seleccionado un horario
            if (!seleccionado) {
                error("Debes seleccionar un horario");
                return;
            }

            try {
                // Realiza una petición PATCH al endpoint "jornadas/edit/:id" para actualizar la jornada con el horario seleccionado
                const response = await patch(`jornadas/edit/${jornada.id}`, {
                    nombre: jornada.jornada,
                    horario_id: seleccionado.value
                });

                // Si la petición no es exitosa, muestra un mensaje de error
                if (!response || !response.success) {
                    cerrarModal(modal);
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        error(response?.message || "Error al actualizar la jornada");
                    }
                    return;
                }

                // Si la petición es exitosa, cierra el modal, recarga la información de los turnos y muestra un mensaje de éxito
                cerrarModal(modal);
                shiftsController();
                success(response.message);

            } catch (err) {
                // Si ocurre un error durante la petición, muestra un mensaje de error genérico
                console.error(err);
                error("Ocurrió un error inesperado");
            }
        });

    });
};
