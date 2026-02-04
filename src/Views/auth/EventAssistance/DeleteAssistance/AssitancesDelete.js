import { delet } from "../../../../Helpers/api.js";
import { success, error, confirm, loading } from "../../../../Helpers/alertas.js";
import asistenciasController from "../AssitanceController.js";


// ============================================================================
// FUNCIÓN: deleteAsistenciasFicha
// ============================================================================
// - **Eliminación masiva** de asistencias por ficha (opcional: filtro por evento).
// - Confirmación contextual con nombre de ficha/evento.
// - Endpoint: `DELETE asistencia/delete/ficha?ficha=123&event_id=456`
// - Recarga lista automáticamente tras éxito.
// ============================================================================
export const deleteAsistenciasFicha = async (item, eventoNombre = null) => {
    try {
        // ===== 1. CONFIRMACIÓN INTELIGENTE =====
        // Mensaje dinámico según contexto (evento específico o todas)
        const result = await confirm(
            `¿Estás seguro de eliminar ${
                eventoNombre 
                    ? `todas las asistencias de la ficha "${item.Ficha}" para este evento` 
                    : `todas las asistencias de la ficha "${item.Ficha}"`
            }?\n\nEsta acción no se puede deshacer.`
        );

        // Usuario cancela → sale temprano
        if (!result.isConfirmed) return;

        // UX: loading durante eliminación masiva
        loading("Eliminando Registros...");

        // ===== 2. CONSTRUCCIÓN QUERY PARAMS =====
        const params = new URLSearchParams();
        params.append('ficha', item.Ficha);           // Ficha OBLIGATORIA
        if (eventoNombre) params.append('event_id', eventoNombre); // Opcional

        // ===== 3. LLAMADA DELETE MASIVA =====
        const response = await delet(`asistencia/delete/ficha?${params.toString()}`);
        
        // ===== 4. MANEJO DE ERRORES =====
        if (!response || response.error) {
            if (response?.errors && response.errors.length > 0) {
                // Múltiples errores de validación
                response.errors.forEach(err => error(err));
            } else {
                error(response?.message || "Error al eliminar las asistencias");
            }
            return;
        }

        // ===== 5. ACTUALIZACIÓN AUTOMÁTICA =====
        asistenciasController(); // Recarga lista de asistencias

        // ===== 6. ÉXITO =====
        success(response.message || "Asistencias eliminadas correctamente");

    } catch (err) {
        // Errores inesperados (red, timeout, servidor)
        console.error(err);
        error("Ocurrió un error al eliminar las asistencias");
    }
};
