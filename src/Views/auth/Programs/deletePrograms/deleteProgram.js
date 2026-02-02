import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import programasController from "../ProgramsController.js";

export const deletePrograma = async (item) => {

    const result = await confirm(
        `¿Estás seguro de eliminar el programa? "${item.training_program}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!result.isConfirmed) return;

    try {
        const response = await delet(`programa/delete/${item.id}`);

        if (!response || !response.success) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar el programa");
            }
            return;
        }

        programasController();
        success("Programa eliminado correctamente");

    } catch (err) {
        console.error(err);
        error("Ocurrió un error al eliminar el programa");
    }
};
