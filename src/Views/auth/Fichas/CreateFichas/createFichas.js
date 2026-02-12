import { post, get } from "../../../../Helpers/api.js";
import * as validate from "../../../../Helpers/Modules/modules";
import "../../../../Components/Models/modal.css";
import { mostrarModal, cerrarModal } from "../../../../Helpers/modalManagement.js";
import htmlCrearFicha from "./index.html?raw";
import { success, error, loading } from "../../../../Helpers/alertas.js";
import fichasController from "../FichasController.js";

/**
 * @description Abre el modal para crear una nueva ficha.
 *  Si el formulario ya existe, no lo vuelve a crear.
 *  Obtiene los programas desde el backend y los carga en el select.
 *  Gestiona el cierre del modal y el envío del formulario.
 */
export const abrirModalCrearFicha = async () => {
    // Si el formulario ya existe, no lo vuelve a crear
    if (document.querySelector("#formFicha")) return;

    // Mostrar el modal con el contenido HTML
    const modal = mostrarModal(htmlCrearFicha);

    // Esperar al siguiente frame para asegurar que el modal se ha renderizado
    requestAnimationFrame(async () => {

        // Obtener referencias a los elementos del DOM
        const btnCerrar = modal.querySelector("#btnCerrarModal");
        const form = modal.querySelector("#formFicha");
        const selectPrograma = modal.querySelector("#inputPrograma");

        // ===== CARGAR PROGRAMAS =====
        // Obtener los programas desde el backend
        const programas = await get("programa");
        // Limpiar el select y agregar la opción por defecto
        selectPrograma.innerHTML = `<option value="">Seleccione un programa</option>`;
        // Si se obtienen programas, agregarlos al select
        if (programas?.data?.length) {
            programas.data.forEach(p => {
                const op = document.createElement("option");
                op.value = p.id;
                op.textContent = p.training_program;
                selectPrograma.append(op);
            });
        }

        // ===== CERRAR =====
        // Agregar event listener al botón de cerrar
        btnCerrar.addEventListener("click", () => cerrarModal(modal));

        // ===== SUBMIT =====
        // Variable para controlar el envío del formulario
        let enviando = false;

        // Agregar event listener al formulario para el evento submit
        form.onsubmit = async (event) => {
            // Prevenir el comportamiento por defecto del formulario
            event.preventDefault();
            // Si ya se está enviando el formulario, no hacer nada
            if (enviando) return;
            // Validar los campos del formulario
            if (!validate.validarCampos(event)) return;

            // Obtener los datos del formulario validados
            const payload = { ...validate.datos };

            try {
                // Indicar que se está enviando el formulario
                enviando = true;
                // Cerrar el modal
                cerrarModal(modal);
                // Mostrar una alerta de carga
                loading("Creando ficha...");

                // Enviar la petición al backend para crear la ficha
                const response = await post("ficha/create", payload);

                // Si la respuesta es negativa o no exitosa
                if (!response || !response.success) {
                    // Si hay errores, mostrar cada uno de ellos
                    if (response?.errors?.length) {
                        response.errors.forEach(err => error(err));
                    } else {
                        // Si no hay errores, mostrar el mensaje de error genérico
                        error(response?.message || "Error al crear la ficha");
                    }
                    // Indicar que ya no se está enviando el formulario
                    enviando = false;
                    return;
                }

                // Mostrar mensaje de éxito
                success(response.message || "Ficha creada correctamente");
                // Resetear el formulario
                form.reset();
                // Recargar el controlador de fichas
                fichasController();

            } catch (err) {
                // Mostrar error en consola
                console.error(err);
                // Mostrar una alerta de error inesperado
                error("Ocurrió un error inesperado");
            }

            // Indicar que ya no se está enviando el formulario
            enviando = false;
        };
    });
};
