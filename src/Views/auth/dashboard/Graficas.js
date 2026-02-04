import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { get } from "../../../Helpers/api";

// ============================================================================
// REGISTRO GLOBAL DE COMPONENTES CHART.JS
// ============================================================================
// - Registra controladores, elementos y escalas necesarias para ambas gráficas.
// - Se ejecuta UNA SOLA VEZ al cargar el módulo.
// ============================================================================
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend
);

// ============================================================================
// GRÁFICA DE LÍNEAS: ASISTENCIAS MENSUALES
// ============================================================================
// - Muestra **tendencia temporal** de asistencias por día del mes.
// - Endpoint: `GET asistencia/estadisticas/mes`
// - Espera: `{ data: { labels: ["1","2",...], values: [10,25,...] } }`
// ============================================================================
export async function cargarGraficaLineas() {
    // Llama API de estadísticas mensuales de asistencia
    const result = await get("asistencia/estadisticas/mes");

    // Validación: respuesta válida + datos presentes
    if (!result || !result.data) return;

    // Canvas HTML para la gráfica de líneas
    const ctx = document.getElementById("graficaLineas");
    if (!ctx) return; // Sale si no existe el elemento

    // Extrae labels (días) y values (número de asistencias)
    const labels = result.data.labels;  // Ej: ["1", "2", "3", ..., "31"]
    const values = result.data.values;  // Ej: [10, 25, 18, 35, ...]

    // Crea gráfica de líneas con Chart.js
    new Chart(ctx, {
        type: "line", // Tipo: línea
        data: {
            labels, // Eje X: días del mes
            datasets: [{
                label: "Visitantes",                    // Leyenda
                data: values,                           // Datos reales
                borderColor: "#4CAF50",                 // Color línea: verde
                backgroundColor: "rgba(76,175,80,0.2)", // Relleno translúcido verde
                tension: 0.4,                           // Curvatura suave (0.0 = recta, 1.0 = muy curva)
                fill: true                              // Relleno bajo la línea
            }]
        }
    });
}

// ============================================================================
// GRÁFICA CIRCULAR (DONUT): DISTRIBUCIÓN POR EVENTOS
// ============================================================================
// - Muestra **distribución porcentual** de asistencias por tipo de evento.
// - Endpoint: `GET asistencia/estadisticas/eventos`
// - Espera: `{ data: [{name: "Evento A", total: 25}, ...] }`
// ============================================================================
export async function cargarGraficaCircular() {
    // Llama API de estadísticas por eventos
    const result = await get("asistencia/estadisticas/eventos");

    // Validación: respuesta válida + datos presentes
    if (!result || !result.data) return;

    // Transforma array de objetos → arrays planos para Chart.js
    const labels = result.data.map(i => i.name);     // ["Reunión", "Clase", "Taller"]
    const values = result.data.map(i => i.total);    // [25, 15, 40]

    // Canvas HTML para la gráfica circular
    const ctx = document.getElementById("graficaCircular");
    if (!ctx) return; // Sale si no existe el elemento

    // Crea gráfica tipo DONUT con paleta multicolor
    new Chart(ctx, {
        type: "doughnut", // Tipo: donut (similar a pie pero con agujero centro)
        data: {
            labels, // Nombres de eventos para leyenda
            datasets: [{
                data: values, // Totales por evento
                backgroundColor: [
                    "#4CAF50",  // Verde
                    "#2196F3",  // Azul Material
                    "#FF9800",  // Naranja Material
                    "#E91E63",  // Rosa Material
                    "#9C27B0",  // Púrpura Material
                    "#00BCD4"   // Cian Material
                ]
            }]
        }
    });
}
