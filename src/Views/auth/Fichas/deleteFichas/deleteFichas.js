import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import fichasController from "../FichasController.js";

/**
 * @description Elimina una ficha después de confirmar con el usuario.
 * @param {object} item - El objeto ficha que se va a eliminar. Debe contener las propiedades 'id' y 'ficha'.
 * @returns {void}
 */
export const deleteFicha = async (item) => {

    // Mostrar un mensaje de confirmación al usuario antes de eliminar la ficha
    const result = await confirm(
        `¿Estás seguro de eliminar la ficha? "${item.ficha}"?\n\nEsta acción no se puede deshacer.`
    );

    // Si el usuario cancela la eliminación, salir de la función
    if (!result.isConfirmed) return;

    try {
        // Realizar la petición DELETE al backend para eliminar la ficha
        const response = await delet(`ficha/delete/${item.id}`);

        // Si la respuesta del backend es negativa o no exitosa
        if (!response || !response.success) {
            // Si hay errores específicos en la respuesta, mostrarlos
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                // Si no hay errores específicos, mostrar un mensaje de error genérico
                error(response?.message || "Error al eliminar la ficha");
            }
            return;
        }

        // Si la ficha se elimina correctamente, recargar el controlador de fichas
        fichasController();
        // Mostrar un mensaje de éxito
        success("Ficha eliminada correctamente");

    } catch (err) {
        // Si ocurre un error durante la petición, mostrar el error en la consola
        console.error(err);
        // Mostrar un mensaje de error genérico al usuario
        error("Ocurrió un error al eliminar la ficha");
    }
};
