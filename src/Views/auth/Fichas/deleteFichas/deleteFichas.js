import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import fichasController from "../FichasController.js";

export const deleteFicha = async (item) => {

    const result = await confirm(
        `¿Estás seguro de eliminar la ficha? "${item.ficha}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!result.isConfirmed) return;

    try {
        const response = await delet(`ficha/delete/${item.id}`);
        console.log(item.id);

        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar la ficha");
            }
            return;
        }

        fichasController();
        success("Ficha eliminada correctamente");

    } catch (err) {
        console.error(err);
        error("Ocurrió un error al eliminar la ficha");
    }
};
