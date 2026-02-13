import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import shiftsController from "../ReasonController.js";

/**
 * @description Esta función gestiona la eliminación de un turno (shift) después de mostrar un mensaje de confirmación.
 * @async
 * @param {object} item - El objeto del turno que se va a eliminar.
 * @returns {void}
 */
export const deleteShifts = async (item) => {

    // Muestra un mensaje de confirmación al usuario.
    const result = await confirm(
        `¿Estás seguro de eliminar el motivo de ingreso? "${item.name}"?\n\nEsta acción no se puede deshacer.`
    );

    // Si el usuario cancela la eliminación, sale de la función.
    if (!result.isConfirmed) return;

    try {
        // Intenta eliminar el turno.
        const response = await delet(`motivos/delete/${item.id}`)


        // Si la eliminación no es exitosa.
        if (!response || !response.success) {
            // Si hay errores específicos, los muestra.
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                // De lo contrario, muestra un mensaje de error general.
                error(response?.message || "Error al eliminar el Motivo");
            }
            return;
        }

        // Si la eliminación es exitosa, refresca la lista de turnos y muestra un mensaje de éxito.
        shiftsController();
        success("Motivo eliminado correctamente");

    } catch (err) {
        // Si ocurre un error durante el proceso de eliminación, registra el error y muestra un mensaje de error.
        console.error(err);
        error("Ocurrió un error al eliminar el Motivo");
    }
};
