import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import eventsController from "../eventsController.js";

export const deleteEvento = async (item) => {

    const result = await confirm(
        `¿Estás seguro de eliminar el evento? "${item.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!result.isConfirmed) return;

    try {
        const response = await delet(`eventos/delete/${item.id}`);
        console.log(item.id);

        if (!response || !response.success) {
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
