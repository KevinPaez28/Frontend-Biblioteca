import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import shiftsController from "../ReasonController.js";

export const deleteShifts = async (item, horariosDiv) => {

    const result = await confirm(
        `¿Estás seguro de eliminar el motivo de ingreso? "${item.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!result.isConfirmed) return;

    try {
        const response = await delet(`motivos/delete/${item.id}`)
        console.log(item.id);
        

        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar el Motivo");
            }
            return;
        }

        shiftsController();
        success("Motivo eliminado correctamente");

    } catch (err) {
        console.error(err);
        error("Ocurrió un error al eliminar el Motivo");
    }
};
