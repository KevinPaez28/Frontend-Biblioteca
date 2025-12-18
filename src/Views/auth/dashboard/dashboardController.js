import "../../../Components/sidebar/sidebar.css";
import "../../../Styles/Dashboard/dashboard.css";

import { get } from "../../../Helpers/api.js";

export default async () => {

    // Peticiones al backend
    const totalDia = await get("asistencia/total-dia");
    const totalSemana = await get("asistencia/total-semana");
    const totalMes = await get("asistencia/total-mes");
    const totalEgresados = await get("asistencia/total-egresados");

    // ===== TOTAL DÍA =====
    let valorDia = 0;
    if (totalDia && totalDia.data && totalDia.data.total !== undefined) {
        valorDia = totalDia.data.total;
    }
    document.querySelector("#totalDia").textContent = valorDia;

    // ===== TOTAL SEMANA =====
    let valorSemana = 0;
    if (totalSemana && totalSemana.data && totalSemana.data.total !== undefined) {
        valorSemana = totalSemana.data.total;
    }
    document.querySelector("#totalSemana").textContent = valorSemana;

    // ===== TOTAL MES =====
    let valorMes = 0;
    if (totalMes && totalMes.data && totalMes.data.total !== undefined) {
        valorMes = totalMes.data.total;
    }
    document.querySelector("#totalMes").textContent = valorMes;

    // ===== TOTAL EGRESADOS =====
    let valorEgresados = 0;
    if (totalEgresados && totalEgresados.data && totalEgresados.data.total !== undefined) {
        valorEgresados = totalEgresados.data.total;
    }
    document.querySelector("#totalEgresados").textContent = valorEgresados;
};
    