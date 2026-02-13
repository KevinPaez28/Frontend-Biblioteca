import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm, loading } from "../../../../Helpers/alertas.js";
import schedulesController from "../schedulesController.js";

/**
 * @description Elimina un horario después de confirmar con el usuario.
 * @param {object} item - El objeto horario que se va a eliminar. Debe contener las propiedades 'id' y 'name'.
 * @returns {void}
 */
export const deleteSchedule = async (item) => {
    // Mostrar un mensaje de confirmación al usuario antes de eliminar el horario
    const result = await confirm(
        `¿Estás seguro de eliminar el horario con nombre? "${item.horario}"?\n\nEsta acción no se puede deshacer.`
    );

    // Si el usuario cancela la eliminación, salir de la función
    if (!result.isConfirmed) return;

    // Mostrar mensaje de carga
    loading("Eliminando Horario...");

    try {
        // Realizar la petición DELETE al backend para eliminar el horario
        const response = await delet(`horarios/delete/${item.id}`);

        // Si la respuesta del backend es negativa o no exitosa
        if (!response || !response.success) {
            // Si hay errores específicos en la respuesta, mostrarlos
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                // Si no hay errores específicos, mostrar un mensaje de error genérico
                error(response?.message || "Error al eliminar el horario");
            }
            return;
        }

        // Si el horario se elimina correctamente, recargar el controlador de horarios
        schedulesController();
        // Mostrar un mensaje de éxito
        success("Horario eliminado correctamente");

    } catch (err) {
        // Si ocurre un error durante la petición, mostrar el error en la consola
        console.error(err);
        // Mostrar un mensaje de error genérico al usuario
        error("Ocurrió un error al eliminar el horario");
    }
};
