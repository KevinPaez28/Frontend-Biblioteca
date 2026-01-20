import { success, error, confirm } from "../../../../Helpers/alertas.js";
import { delet } from "../../../../Helpers/api.js";
import shiftsController from "../shiftsController.js";

export const deleteJornada = async (item) => {

    const result = await confirm(
        `¿Estás seguro de eliminar la jornada "${item.jornada}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!result.isConfirmed) return;

    try {
        const response = await delet(`jornadas/delete/${item.id}`);

        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar la jornada");
            }
            return;
        }

        success("Jornada eliminada correctamente");
        shiftsController();

    } catch (err) {
        console.error(err);
        error("Ocurrió un error al eliminar la jornada");
    }
};
