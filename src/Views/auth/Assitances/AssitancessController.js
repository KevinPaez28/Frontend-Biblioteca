import "../../../Styles/Assitances/assistances.css";
import { abrirModalAsistencia } from "./ViewAssitances/viewAssistances.js";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";

export default async () => {
    const tabla = document.querySelector("#tablaAsistencias");
    const contenedor = document.getElementById("asistencias-contenedor"); // 👈 CONTENEDOR igual que historial
    showSpinner(contenedor);

  // ================= FILTROS =================
  const filtros = {
    nombre: document.querySelector("#filtroNombre"),
    apellido: document.querySelector("#filtroApellido"),
    documento: document.querySelector("#filtroDocumento"),
    ficha: document.querySelector("#filtroFicha"),
    fecha: document.querySelector("#filtroFecha"),
    motivo: document.querySelector("#filtroMotivo"),
    rol: document.querySelector("#filtroRol"),
  };

  const btnFiltros = document.querySelector("#btnFiltros");
  const filtrosAvanzados = document.querySelector("#filtrosAvanzados");

  // ================= MOSTRAR / OCULTAR =================
  btnFiltros.addEventListener("click", () => {
    filtrosAvanzados.classList.toggle("filter-visible");
  });

  // ================= CARGAR SELECTS =================
  const cargarSelects = async () => {
    try {
      // ROLES
      const roles = await get("roles");
      if (roles?.data?.length) {
        roles.data.forEach(r => {
          const option = document.createElement("option");
          option.value = r.name;
          option.textContent = r.name;
          filtros.rol.append(option);
        });
      }

      // MOTIVOS
      const motivos = await get("motivos");
      if (motivos?.data?.length) {
        motivos.data.forEach(m => {
          const option = document.createElement("option");
          option.value = m.name;
          option.textContent = m.name;
          filtros.motivo.append(option);
        });
      }
    } catch (error) {
      console.error("Error cargando selects:", error);
    }
  };

  // ================= FUNCIÓN CENTRAL =================
  const cargarAsistencias = async () => {
    try {
      // Mostrar spinner (igual que historial)
      

      console.log("🔄 Cargando asistencias"); // Debug

      let query = [];

      Object.entries(filtros).forEach(([key, input]) => {
        if (input && input.value && input.value.trim() !== "") {
          query.push(`${key}=${encodeURIComponent(input.value)}`);
        }
      });

      const url = query.length ? `asistencia?${query.join("&")}` : "asistencia";
      console.log(" URL asistencias:", url); // Debug

      const asistencias = await get(url);
      console.log(" Response asistencias:", asistencias); // Debug

      tabla.innerHTML = "";

      if (asistencias?.data?.length) {
        asistencias.data.forEach((item, index) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.Ficha || "—"}</td>
            <td>${item.FirstName || "—"}</td>
            <td>${item.LastName || "—"}</td>
            <td>${item.DateTime || "—"}</td>
            <td>${item.Reason || "—"}</td>
            <td>
              <button class="btn-ver">Ver</button>
            </td>
          `;

          tabla.appendChild(tr);

          tr.querySelector(".btn-ver").addEventListener("click", () => {
            abrirModalAsistencia(item, index);
          });
        });
      } else {
        tabla.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center;color:var(--color-gris)">
              No se encontraron resultados
            </td>
          </tr>
        `;
      }
    } catch (error) {
      tabla.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;color:red">
            Error al cargar asistencias. Revisa la consola.
          </td>
        </tr>
      `;
    } finally {
      // SIEMPRE ocultar spinner
      try {
        if (contenedor) {
          hideSpinner(contenedor);
        }
      } catch (spinnerError) {
        console.error("Error al ocultar spinner:", spinnerError);
      }
    }
  };

  // ================= FILTROS EN TIEMPO REAL =================
  Object.values(filtros).forEach(input => {
    if (!input) return;

    if (input.tagName === "SELECT" || input.type === "date") {
      input.addEventListener("change", cargarAsistencias);
    } else {
      input.addEventListener("input", cargarAsistencias);
    }
  });

  // ================= INIT =================
  await cargarSelects();
  cargarAsistencias();
};
