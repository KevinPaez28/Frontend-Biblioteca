import "../../../components/sidebar/sidebar.css";
import "../../../styles/dashboard/dashboard.css";
import { cargarGraficaLineas, cargarGraficaCircular } from "./Graficas.js";
import { get } from "../../../helpers/api.js";
import { showSpinner, hideSpinner } from "../../../helpers/spinner.js";

// ============================================================================
// DASHBOARD CONTROLLER - PETICIONES CON setTimeout SECUENCIAL
// ============================================================================
export default async () => {
    const contenedor = document.querySelector(".tarjetas-dashboard");
    const contenedorEventos = document.querySelector(".eventos-lista");

    try {
        // Spinner inicial
        if (contenedor) {
            showSpinner(contenedor);
        }


        // ================= PETICIONES CON setTimeout SECUENCIAL =================
        // Cada petición espera X segundos antes de ejecutarse (evita sobrecarga servidor)

        // 1. TOTAL DÍA (0.3s delay)
        await new Promise(resolve => setTimeout(resolve, 300));
        const totalDia = await get("asistencia/total-dia");

        // 2. TOTAL SEMANA (0.6s delay acumulativo)
        await new Promise(resolve => setTimeout(resolve, 300));
        const totalSemana = await get("asistencia/total-semana");

        // 3. TOTAL MES (0.9s delay acumulativo)
        await new Promise(resolve => setTimeout(resolve, 300));
        const totalMes = await get("asistencia/total-mes");

        // 4. TOTAL EGRESADOS (1.2s delay acumulativo)
        await new Promise(resolve => setTimeout(resolve, 300));
        const totalEgresados = await get("asistencia/total-egresados");


        // Card #1 - TOTAL DÍA
        let valorDia = totalDia?.data?.total ?? 0;
        const elDia = document.querySelector("#totalDia");
        if (elDia) elDia.textContent = valorDia;

        // Card #2 - TOTAL SEMANA
        let valorSemana = totalSemana?.data?.total ?? 0;
        const elSemana = document.querySelector("#totalSemana");
        if (elSemana) elSemana.textContent = valorSemana;

        // Card #3 - TOTAL MES
        let valorMes = totalMes?.data?.total ?? 0;
        const elMes = document.querySelector("#totalMes");
        if (elMes) elMes.textContent = valorMes;

        // Card #4 - TOTAL EGRESADOS
        let valorEgresados = totalEgresados?.data?.total ?? 0;
        const elEgresados = document.querySelector("#totalEgresados");
        if (elEgresados) elEgresados.textContent = valorEgresados;

        // ================= EVENTOS DEL DÍA (1.5s delay) =================
        await new Promise(resolve => setTimeout(resolve, 300));
        const eventos = await get("eventos/today");

        if (eventos?.data?.length > 0 && contenedorEventos) {
            contenedorEventos.innerHTML = ""; // Limpia previo

            eventos.data.forEach(evento => {
                const article = document.createElement("article");
                article.classList.add("evento-card");

                // Badge "Hoy"
                const badge = document.createElement("span");
                badge.classList.add("evento-badge");
                badge.textContent = "Hoy";

                // Título
                const titulo = document.createElement("h3");
                titulo.classList.add("evento-titulo");
                titulo.textContent = evento.name;

                // Subtítulo
                const sub = document.createElement("p");
                sub.classList.add("evento-sub");
                sub.textContent = `● ${evento.mandated}`;

                // Footer
                const footer = document.createElement("div");
                footer.classList.add("evento-footer");

                const hora = document.createElement("span");
                hora.textContent = `Inicio ${evento.start_time}`;

                const fecha = document.createElement("span");
                fecha.textContent = evento.date;

                footer.appendChild(hora);
                footer.appendChild(fecha);

                article.appendChild(badge);
                article.appendChild(titulo);
                article.appendChild(sub);
                article.appendChild(footer);

                contenedorEventos.appendChild(article);
            });
        } else if (contenedorEventos) {
            contenedorEventos.textContent = "No hay eventos próximos";
        }

        // ================= GRÁFICAS CON setTimeout =================
        
        // Gráfica líneas (1.8s delay)
        await new Promise(resolve => setTimeout(resolve, 300));
        await cargarGraficaLineas();

        // Gráfica circular (2.1s delay)
        await new Promise(resolve => setTimeout(resolve, 300));
        await cargarGraficaCircular();


    } catch (error) {
        if (contenedorEventos) {
            contenedorEventos.innerHTML = '<p class="error-msg">Error al cargar datos</p>';
        }
    } finally {
        // Ocultar spinner después de TODO (máx 5s)
        setTimeout(() => {
            if (contenedor) {
                hideSpinner(contenedor);
            }
        }, 5000);
    }
};
