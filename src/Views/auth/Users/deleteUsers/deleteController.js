import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import UsersController from "../UsersController.js";

export const deleteUsuario = async (item) => {

    const result = await confirm(
        `¿Estás seguro de eliminar el usuario "${item.first_name} ${item.last_name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!result.isConfirmed) return;

    try {
        const response = await delet(`user/delete/${item.id}`);
        console.log(response);
        
        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar el usuario");
            }
            return;
        }

        UsersController();
        success("Usuario eliminado correctamente");

    } catch (err) {
        console.error(err);
        error("Ocurrió un error al eliminar el usuario");
    }
};
