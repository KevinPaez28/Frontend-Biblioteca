import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm, loading } from "../../../../Helpers/alertas.js";
import areasController from "../roomsController.js";

/**
 * @description Función asíncrona para eliminar un área, mostrando una confirmación previa.
 * @async
 * @param {object} item Objeto que representa el área a eliminar. Debe tener una propiedad 'name' para mostrar en la confirmación, y una propiedad 'id' para la petición de borrado.
 */
export const deleteAreas = async (item) => {

    // Mostrar un mensaje de confirmación al usuario antes de eliminar el área.
    const result = await confirm(
        `¿Estás seguro de eliminar el área? "${item.name}"?\n\nEsta acción no se puede deshacer.`
    );

    // Si el usuario cancela la eliminación (haciendo clic en "Cancelar" o cerrando el diálogo), salir de la función.
    if (!result.isConfirmed) return;

    // Muestra un mensaje de carga mientras se realiza la eliminación
    loading("Eliminand Area");
    try {
        // Realizar la petición de borrado a la API.
        const response = await delet(`salas/delete/${item.id}`);

        // Si la respuesta de la API no es exitosa, mostrar un mensaje de error.
        if (!response || !response.success) {
            // Si la respuesta contiene una lista de errores específicos, iterar sobre ellos y mostrarlos.
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                // Si no hay errores específicos, mostrar un mensaje de error genérico.
                error(response?.message || "Error al eliminar el área");
            }
            return;
        }

        // Si la eliminación es exitosa, actualizar la lista de áreas y mostrar un mensaje de éxito.
        areasController();
        success("Área eliminada correctamente");

    } catch (err) {
        // Si ocurre un error durante la petición a la API, registrar el error en la consola y mostrar un mensaje de error.
        console.error(err);
        error("Ocurrió un error al eliminar el área");
    }
};
