import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import UsersController from "../UsersController.js";

/**
 * @description Elimina un usuario después de confirmar con el usuario.
 * @param {object} item - El objeto usuario que se va a eliminar. Debe contener las propiedades 'id', 'first_name' y 'last_name'.
 * @returns {void}
 */
export const deleteUsuario = async (item) => {

    // Mostrar un mensaje de confirmación al usuario antes de eliminar el usuario.
    const result = await confirm(
        `¿Estás seguro de eliminar el usuario "${item.first_name} ${item.last_name}"?\n\nEsta acción no se puede deshacer.`
    );

    // Si el usuario cancela la eliminación, salir de la función.
    if (!result.isConfirmed) return;

    try {
        // Realizar la petición DELETE al backend para eliminar el usuario.
        const response = await delet(`user/delete/${item.id}`);

        // Si la respuesta del backend es negativa o no exitosa.
        if (!response || !response.success) {
            // Si hay errores específicos en la respuesta, mostrarlos.
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                // Si no hay errores específicos, mostrar un mensaje de error genérico.
                error(response?.message || "Error al eliminar el usuario");
            }
            return;
        }

        // Si el usuario se elimina correctamente, recargar el controlador de usuarios.
        UsersController();
        // Mostrar un mensaje de éxito.
        success("Usuario eliminado correctamente");

    } catch (err) {
        // Si ocurre un error durante la petición, mostrar el error en la consola.
        console.error(err);
        // Mostrar un mensaje de error genérico al usuario.
        error("Ocurrió un error al eliminar el usuario");
    }
};
