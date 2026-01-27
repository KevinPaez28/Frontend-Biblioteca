import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm, loading } from "../../../../Helpers/alertas.js";
import areasController from "../roomsController.js";

export const deleteAreas = async (item) => {

    const result = await confirm(
        `¿Estás seguro de eliminar el área? "${item.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!result.isConfirmed) return;
    loading("Eliminand Area");
    try {
        const response = await delet(`salas/delete/${item.id}`);
        console.log(item.id);

        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar el área");
            }
            return;
        }

        areasController();
        success("Área eliminada correctamente");

    } catch (err) {
        console.error(err);
        error("Ocurrió un error al eliminar el área");
    }
};
