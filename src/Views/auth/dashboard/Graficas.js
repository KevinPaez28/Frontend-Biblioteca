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

// ===================== GRÁFICA DE LÍNEAS =====================
export async function cargarGraficaLineas() {
    const result = await get("asistencia/estadisticas/mes");
    console.log("LINEAS:", result);

    if (!result || !result.data) return;

    const ctx = document.getElementById("graficaLineas");
    if (!ctx) return;

    const labels = result.data.labels;
    const values = result.data.values;

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Visitantes",
                data: values,
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76,175,80,0.2)",
                tension: 0.4,
                fill: true
            }]
        }
    });
}

// ===================== GRÁFICA CIRCULAR =====================
export async function cargarGraficaCircular() {
    const result = await get("asistencia/estadisticas/eventos");
    console.log("BY EVENT:", result);

    if (!result || !result.data) return;

    const labels = result.data.map(i => i.name);
    const values = result.data.map(i => i.total);

    const ctx = document.getElementById("graficaCircular");
    if (!ctx) return;

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#4CAF50",
                    "#2196F3",
                    "#FF9800",
                    "#E91E63",
                    "#9C27B0",
                    "#00BCD4"
                ]
            }]
        }
    });
}
