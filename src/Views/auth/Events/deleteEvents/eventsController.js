import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm, loading } from "../../../../Helpers/alertas.js";
import eventsController from "../eventsController.js";

/**
 * @function deleteEvento
 * @description Muestra una confirmación al usuario para eliminar un evento, y si se confirma, realiza la eliminación y actualiza la vista.
 * @async
 * @param {object} item - El objeto del evento a eliminar. Debe contener `id` y `name` propiedades.
 * @returns {Promise<void>}
 */
export const deleteEvento = async (item) => {

    /**
     * @constant result
     * @type {object}
     * @description Resultado de la confirmación del usuario.
     */
    const result = await confirm(
        `¿Estás seguro de eliminar el evento? "${item.name}"?\n\nEsta acción no se puede deshacer.`
    );

    /**
     * @description Si el usuario no confirma, la función retorna.
     */
    if (!result.isConfirmed) return;
    loading("Eliminando Evento");

    try {
        /**
         * @constant response
         * @type {object}
         * @description Respuesta del servidor al intentar eliminar el evento.
         */
        const response = await delet(`eventos/delete/${item.id}`);

        /**
         * @description Comprueba si la respuesta es negativa o no exitosa.
         */
        if (!response || !response.success) {
            /**
             * @description Itera a través de los errores, si existen, y muestra cada error.
             */
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar el evento");
            }
            return;
        }

        eventsController();
        success("Evento eliminado correctamente");

    } catch (err) {
        console.error(err);
        error("Ocurrió un error al eliminar el evento");
    }
};
