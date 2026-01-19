import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm, loading } from "../../../../Helpers/alertas.js";
import asistenciasController from "../AssitanceController.js";

export const deleteAsistenciasFicha = async (item, eventoNombre = null) => {
    try {
        // 1. Pedimos confirmación al usuario
        const result = await confirm(
            `¿Estás seguro de eliminar ${
                eventoNombre ? `todas las asistencias de la ficha "${item.Ficha}" para este evento` 
                             : `todas las asistencias de la ficha "${item.Ficha}"`
            }?\n\nEsta acción no se puede deshacer.`
        );

        if (!result.isConfirmed) return;

        loading("Eliminando Registros...");

        // 2. Construimos los query params
        const params = new URLSearchParams();
        params.append('ficha', item.Ficha);
        if (eventoNombre) params.append('event_id', eventoNombre);

        // 3. Llamamos al endpoint DELETE
        const response = await delet(`asistencia/delete/ficha?${params.toString()}`);
        console.log(response);
        
        // 4. Manejo de errores
        if (!response || response.error) {
            if (response?.errors && response.errors.length > 0) {
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar las asistencias");
            }
            return;
        }

        // 5. Actualizamos la lista de asistencias
        asistenciasController();

        // 6. Mostramos mensaje de éxito
        success(response.message || "Asistencias eliminadas correctamente");

    } catch (err) {
        console.error(err);
        error("Ocurrió un error al eliminar las asistencias");
    }
};
