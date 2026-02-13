import { success, error, confirm } from "../../../../Helpers/alertas.js";
import { delet } from "../../../../Helpers/api.js";
import shiftsController from "../shiftsController.js";

/**
 * Función asíncrona para eliminar una jornada.
 *
 * @async
 * @function deleteJornada
 * @param {object} item - Objeto que contiene la información de la jornada a eliminar.
 * @param {string} item.jornada - Nombre de la jornada a eliminar.
 * @param {number} item.id - Identificador único de la jornada a eliminar.
 * @throws {Error} Si ocurre un error durante la eliminación de la jornada, muestra una alerta de error.
 * @returns {void}
 */
export const deleteJornada = async (item) => {

    // Muestra una ventana de confirmación al usuario antes de eliminar la jornada.
    const result = await confirm(
        `¿Estás seguro de eliminar la jornada "${item.jornada}"?\n\nEsta acción no se puede deshacer.`
    );

    // Si el usuario cancela la confirmación, la función retorna sin hacer nada.
    if (!result.isConfirmed) return;

    try {
        // Realiza una petición DELETE al backend para eliminar la jornada.
        const response = await delet(`jornadas/delete/${item.id}`);

        // Si la respuesta del servidor no es exitosa, muestra un mensaje de error.
        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar la jornada");
            }
            return;
        }

        // Si la eliminación es exitosa, muestra un mensaje de éxito y recarga la información de los turnos.
        success("Jornada eliminada correctamente");
        shiftsController();

    } catch (err) {
        // Si ocurre un error durante la petición, muestra un mensaje de error genérico.
        console.error(err);
        error("Ocurrió un error al eliminar la jornada");
    }
};
