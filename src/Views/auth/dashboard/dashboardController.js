import "../../../Components/sidebar/sidebar.css";
import "../../../Styles/Dashboard/dashboard.css";
import { cargarGraficaLineas, cargarGraficaCircular } from "./Graficas.js";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";

export default async () => {
  const contenedor = document.querySelector(".tarjetas-dashboard"); // 👈 contenedor de tarjetas

  try {
    // Mostrar spinner
    if (contenedor) {
      showSpinner(contenedor);
    }

    // ================= PETICIONES ASISTENCIA =================
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

    // ================= EVENTOS =================
    const eventos = await get("eventos/today"); // endpoint GET
    console.log(eventos);
  
    const contenedorEventos = document.querySelector(".eventos-lista");

    if (eventos && eventos.data && eventos.data.length > 0) {
      eventos.data.forEach(evento => {
        const article = document.createElement("article");
        article.classList.add("evento-card");

        const badge = document.createElement("span");
        badge.classList.add("evento-badge");
        badge.textContent = "Hoy";

        const titulo = document.createElement("h3");
        titulo.classList.add("evento-titulo");
        titulo.textContent = evento.name;

        const sub = document.createElement("p");
        sub.classList.add("evento-sub");
        sub.textContent = `● ${evento.mandated}`;

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
    } else {
      contenedorEventos.textContent = "No hay eventos próximos";
    }

    await cargarGraficaLineas();
    await cargarGraficaCircular();

  } catch (error) {
    console.error("Error dashboard:", error);
  } finally {
    // Ocultar spinner
    try {
      if (contenedor) {
        hideSpinner(contenedor);
      }
    } catch (e) {
      console.error("Error spinner:", e);
    }
  }
};
