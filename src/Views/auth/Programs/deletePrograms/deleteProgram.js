import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm } from "../../../../Helpers/alertas.js";
import programasController from "../ProgramsController.js";

/**
 * @description This function handles the deletion of a program after displaying a confirmation message.
 * @async
 * @param {object} item - The program object to be deleted.
 * @returns {void}
 */
export const deletePrograma = async (item) => {

    // Display a confirmation message to the user
    const result = await confirm(
        `¿Estás seguro de eliminar el programa? "${item.training_program}"?\n\nEsta acción no se puede deshacer.`
    );

    // If the user cancels the deletion, exit the function
    if (!result.isConfirmed) return;

    try {
        // Attempt to delete the program
        const response = await delet(`programa/delete/${item.id}`);

        // If the deletion is not successful
        if (!response || !response.success) {
            // If there are specific errors, display them
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            }
            // Otherwise, display a general error message
            else {
                error(response?.message || "Error al eliminar el programa");
            }
            return;
        }

        // If the deletion is successful, refresh the program list and display a success message
        programasController();
        success("Programa eliminado correctamente");

    } catch (err) {
        // If an error occurs during the deletion process, log the error and display an error message
        console.error(err);
        error("Ocurrió un error al eliminar el programa");
    }
};
