import "../../../Styles/Schedules/Schedules.css"; 
import { get } from "../../../Helpers/api.js";
import { abrirModalAsistencia } from "./viewAssistance/AssitancesModal.js";
import { abrirModalCrearAsistenciaEvento } from "./CreateAssistance/createAsistencias.js";
import { deleteAsistenciasFicha } from "./DeleteAssistance/AssitancesDelete.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { abrirModalExportAsistencias } from "./exportAssistances/export.js";


// ============================================================================
// CONTROLADOR PRINCIPAL DE ASISTENCIAS POR EVENTOS
// ============================================================================
// Vista tabular de asistencias registradas para eventos.
// Soporta búsqueda reactiva, botones CRUD y exportación.
// Carga datos desde endpoint asistencia/events.
// ============================================================================
export default async () => {
    
    // Referencias principales del DOM
    const tbody = document.getElementById("asistencias-tbody");
    const contenedor = document.querySelector(".asistencias-eventos-contenedor");
    const btnAsistenciaMasiva = document.getElementById("btnAsistenciaMasiva");
    const inputBuscar = document.querySelector(".input-filter");
    const btnExportarAsistencias = document.getElementById("btnExportarAsistencias");

    // Elementos de búsqueda
    const btnBuscar = document.querySelector(".btn-outline");
    showSpinner(contenedor); // Spinner de carga inicial

    // ============================================================================
    // FUNCIÓN PRINCIPAL: CARGAR ASISTENCIAS
    // ============================================================================
    const cargarAsistencias = async (search = "") => {
        try {
            // Construye URL con parámetro de búsqueda opcional
            const response = await get(`asistencia/events${search}`);
            tbody.innerHTML = ""; // Limpia tabla
            console.log(response); // Debug en consola

            // Caso: datos presentes
            if (response && response.data && response.data.length > 0) {
                response.data.forEach((item, index) => {
                    const tr = document.createElement("tr");

                    // Columna 1: Número secuencial
                    const td1 = document.createElement("td");
                    td1.textContent = index + 1;

                    // Columna 2: Nombre del evento
                    const td2 = document.createElement("td");
                    td2.textContent = item.Event || "—";

                    // Columna 3: Número de ficha
                    const td3 = document.createElement("td");
                    td3.textContent = item.Ficha || "—";

                    // Columna 4: Fecha y hora formateada
                    const td4 = document.createElement("td");
                    td4.textContent = item.DateTime
                        ? new Date(item.DateTime).toLocaleString()
                        : "—";

                    // Columna 5: Acciones
                    const td5 = document.createElement("td");

                    // Botón Ver detalle
                    const btnVer = document.createElement("button");
                    btnVer.classList.add("btn-ver");
                    btnVer.textContent = "Ver";
                    btnVer.addEventListener("click", () => {
                        abrirModalAsistencia(item, index);
                    });
                    
                    // Botón Eliminar
                    const btnEliminar = document.createElement("button");
                    btnEliminar.classList.add("btn-eliminar");
                    btnEliminar.textContent = "Eliminar";
                    btnEliminar.addEventListener("click", () => {
                        deleteAsistenciasFicha(item, index);
                    });

                    td5.appendChild(btnVer);
                    td5.appendChild(btnEliminar);

                    // Agrega celdas a fila y fila a tabla
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);

                    tbody.appendChild(tr);
                });
            } else {
                // Tabla vacía: mensaje centrado
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 5;
                td.textContent = "No hay asistencias registradas";
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        } catch (error) {
            console.error("Error asistencias:", error);
        } finally {
            // Garantiza que el spinner se oculte siempre
            try {
                if (contenedor) {
                    hideSpinner(contenedor);
                }
            } catch (e) {
                console.error("Error spinner:", e);
            }
        }
    };

    // ============================================================================
    // EVENT LISTENERS
    // ============================================================================

    // Botón crear asistencia masiva
    btnAsistenciaMasiva.addEventListener("click", () => {
        abrirModalCrearAsistenciaEvento();
    });

    // Botón búsqueda manual
    btnBuscar.addEventListener("click", () => {
        cargarAsistencias(inputBuscar.value.trim());
    });

    // Búsqueda reactiva en tiempo real (Enter/Keyup)
    inputBuscar.addEventListener("keyup", () => {
        cargarAsistencias(inputBuscar.value.trim());
    });

    // Botón exportar a Excel
    btnExportarAsistencias.addEventListener("click", () => {
        abrirModalExportAsistencias();
    });

    // Carga inicial de datos
    await cargarAsistencias();
};
