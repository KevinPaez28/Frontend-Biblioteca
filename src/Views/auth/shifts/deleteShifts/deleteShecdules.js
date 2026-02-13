import { patch } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import shiftsController from "../shiftsController.js";

/**
 * Elimina la relación entre una jornada y un horario específico.
 *
 * @async
 * @function deleteShifts
 * @param {object} item - Objeto que contiene la información de la jornada a eliminar.
 * @param {string} item.horario - Nombre del horario que se va a eliminar.
 * @param {string} item.jornada - Nombre de la jornada a la que pertenece el horario.
 * @param {number} item.id - ID de la jornada.
 * @param {HTMLElement} horariosDiv - Elemento HTML que contiene la lista de horarios (no se utiliza en la función, pero se incluye en la firma).
 * @throws {Error} Si ocurre un error durante la eliminación del horario, muestra una alerta de error.
 * @returns {void}
 */
export const deleteShifts = async (item, horariosDiv) => {

    
    // Muestra una ventana de confirmación al usuario antes de eliminar el horario.
    const result = await confirm(
        `¿Estás seguro de eliminar la relacion de "${item.horario}"?\n\ Con asistencia, Esta acción no se puede deshacer.`
    );

    // Si el usuario cancela la confirmación, la función retorna sin hacer nada.
    if (!result.isConfirmed) return;

    try {
        // Realiza una petición PATCH para actualizar la jornada, estableciendo el horario_id a null.
        const response = await patch(`jornadas/edit/${item.id}`, {
            nombre: item.jornada,
            horario_id: null
        });

        // Si la respuesta del servidor no es exitosa, muestra un mensaje de error.
        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar el horario");
            }
            return;
        }

        // Si la eliminación es exitosa, recarga la información de los turnos y muestra un mensaje de éxito.
        shiftsController()
        success("Horario eliminado");
    } catch (err) {
        // Si ocurre un error durante la petición, muestra un mensaje de error genérico.
        console.error(err);
        error("Ocurrió un error al eliminar el horario");
    }
};
