import { patch } from "../../../../Helpers/api.js";
import { success, error } from "../../../../Helpers/alertas.js";
import shiftsController from "../shiftsController.js";

export const deleteShifts = async (item, horariosDiv) => {
    try {
        const response = await patch(`jornadas/edit/${item.id}`, {
            nombre: item.jornada,
            horario_id: null
        });

        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar el horario");
            }
            return;
        }

        shiftsController()
        success("Horario eliminado");
    } catch (err) {
        console.error(err);
        error("Ocurrió un error al eliminar el horario");
    }
};
