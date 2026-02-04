import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm, loading } from "../../../../Helpers/alertas.js";
import UsersController from "../ApprenticesController.js";


// ============================================================================
// FUNCIÓN: deleteUsuario
// ============================================================================
// - Recibe un objeto "item" que representa al usuario a eliminar.
// - Muestra un cuadro de confirmación antes de eliminar.
// - Si el usuario confirma, muestra un loading y llama al endpoint de borrado.
// - Maneja errores devueltos por el backend y errores inesperados.
// ============================================================================
export const deleteUsuario = async (item) => {

    // Muestra un cuadro de confirmación al usuario, incluyendo nombre y apellido
    const result = await confirm(
        `¿Estás seguro de eliminar el usuario "${item.first_name} ${item.last_name}"?\n\nEsta acción no se puede deshacer.`
    );

    // Si el usuario cancela la confirmación, se detiene la función
    if (!result.isConfirmed) return;

    // Muestra un mensaje de carga mientras se realiza la operación de borrado
    loading("eliminando Aprendiz")

    try {
        // Llama al endpoint de eliminación pasando el id del usuario
        const response = await delet(`user/delete/${item.id}`);

        // Valida la respuesta del backend
        if (!response || !response.success) {
            // Si vienen errores detallados, se muestran uno por uno
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                // Si no hay arreglo de errores, se muestra el mensaje genérico
                error(response?.message || "Error al eliminar el usuario");
            }
            return;
        }

        // Si la eliminación fue exitosa:
        // - Se recarga/actualiza el listado de usuarios/aprendices
        // - Se muestra un mensaje de éxito
        UsersController();
        success("Usuario eliminado correctamente");

    } catch (err) {
        // Captura errores inesperados (fallos de red, servidor, etc.)
        console.error(err);
        error("Ocurrió un error al eliminar el usuario");
    }
};
