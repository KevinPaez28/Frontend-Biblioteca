import "../../../Components/sidebar/sidebar.css";
import "../../../Styles/Dashboard/dashboard.css";
import { cargarGraficaLineas, cargarGraficaCircular } from "./Graficas.js";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";


// ============================================================================
// DASHBOARD CONTROLLER PRINCIPAL (export default)
// ============================================================================
// - Carga **KPI cards** de asistencias (día/semana/mes/egresados).
// - Lista dinámica de **eventos del día** con cards estilizadas.
// - Renderiza **gráficas** (líneas + circular).
// - Manejo robusto de errores + spinner always.
// ============================================================================
export default async () => {
    // Contenedor principal de tarjetas KPI
    const contenedor = document.querySelector(".tarjetas-dashboard");

    try {
        // Spinner inicial
        if (contenedor) {
            showSpinner(contenedor);
        }

        // ================= PETICIONES PARALELAS ASISTENCIAS =================
        // 4 endpoints independientes para métricas KPI
        const totalDia = await get("asistencia/total-dia");
        const totalSemana = await get("asistencia/total-semana");
        const totalMes = await get("asistencia/total-mes");
        const totalEgresados = await get("asistencia/total-egresados");

        // ===== TOTAL DÍA (Card #1) =====
        let valorDia = 0;
        if (totalDia && totalDia.data && totalDia.data.total !== undefined) {
            valorDia = totalDia.data.total;
        }
        document.querySelector("#totalDia").textContent = valorDia;

        // ===== TOTAL SEMANA (Card #2) =====
        let valorSemana = 0;
        if (totalSemana && totalSemana.data && totalSemana.data.total !== undefined) {
            valorSemana = totalSemana.data.total;
        }
        document.querySelector("#totalSemana").textContent = valorSemana;

        // ===== TOTAL MES (Card #3) =====
        let valorMes = 0;
        if (totalMes && totalMes.data && totalMes.data.total !== undefined) {
            valorMes = totalMes.data.total;
        }
        document.querySelector("#totalMes").textContent = valorMes;

        // ===== TOTAL EGRESADOS (Card #4) =====
        let valorEgresados = 0;
        if (totalEgresados && totalEgresados.data && totalEgresados.data.total !== undefined) {
            valorEgresados = totalEgresados.data.total;
        }
        document.querySelector("#totalEgresados").textContent = valorEgresados;

        // ================= EVENTOS DEL DÍA =================
        const eventos = await get("eventos/today"); // Eventos programados para hoy
        
        const contenedorEventos = document.querySelector(".eventos-lista");

        if (eventos && eventos.data && eventos.data.length > 0) {
            // Crea cards dinámicas para cada evento
            eventos.data.forEach(evento => {
                const article = document.createElement("article");
                article.classList.add("evento-card");

                // Badge "Hoy"
                const badge = document.createElement("span");
                badge.classList.add("evento-badge");
                badge.textContent = "Hoy";

                // Título del evento
                const titulo = document.createElement("h3");
                titulo.classList.add("evento-titulo");
                titulo.textContent = evento.name;

                // Subtítulo (mandated = obligatorio?)
                const sub = document.createElement("p");
                sub.classList.add("evento-sub");
                sub.textContent = `● ${evento.mandated}`;

                // Footer con hora y fecha
                const footer = document.createElement("div");
                footer.classList.add("evento-footer");

                const hora = document.createElement("span");
                hora.textContent = `Inicio ${evento.start_time}`; 

                const fecha = document.createElement("span");
                fecha.textContent = evento.date;

                footer.appendChild(hora);
                footer.appendChild(fecha);

                // Arma estructura completa de la card
                article.appendChild(badge);
                article.appendChild(titulo);
                article.appendChild(sub);
                article.appendChild(footer);

                contenedorEventos.appendChild(article);
            });
        } else {
            // Fallback sin eventos
            contenedorEventos.textContent = "No hay eventos próximos";
        }

        // ================= GRÁFICAS DASHBOARD =================
        await cargarGraficaLineas();    // Gráfica de líneas
        await cargarGraficaCircular();  // Gráfica circular/pastel

    } catch (error) {
        console.error("Error dashboard:", error);
    } finally {
        // Garantiza que el spinner se oculte SIEMPRE
        try {
            if (contenedor) {
                hideSpinner(contenedor);
            }
        } catch (e) {
            console.error("Error spinner:", e);
        }
    }
};
