import "../../../Styles/shifts/shifts.css";
import { get } from "../../../Helpers/api.js";
import { editarmodalHorario } from "./EditShifts/editShiftsController.js";
import { deleteShifts } from "./deleteShifts/deleteShecdules.js";
import { abrirModalCrearJornada } from "./createShifts/createShifts.js";
import { deleteJornada } from "./deleteShifts/deleteShift.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { tienePermiso } from "../../../helpers/auth.js"; 

export default async () => {
  const contenedor = document.getElementById("jornadas-contenedor");
  const cardsContainer = document.querySelector(".cards");
  const btnNuevoHorario = document.getElementById("btnNuevoHorario");

  if (btnNuevoHorario) {
    if (tienePermiso("shifts.store")) {
      btnNuevoHorario.addEventListener("click", () => {
        abrirModalCrearJornada();
      });
    } else {
      btnNuevoHorario.style.display = "none";
    }
  }

  const cargarJornadas = async () => {
    try {
      if (contenedor) {
        showSpinner(contenedor);
      }

      const jornadas = await get("jornadas/complete");
      console.log("✅ Response jornadas:", jornadas);

      cardsContainer.innerHTML = "";

      if (jornadas && jornadas.data && jornadas.data.length > 0) {
        jornadas.data.forEach((item, index) => {
          // ===== CARD =====
          const card = document.createElement("div");
          card.classList.add("card");

          // ===== HEADER =====
          const header = document.createElement("div");
          header.classList.add("card-header");

          const title = document.createElement("h3");
          title.textContent = item.jornada;

          const switchLabel = document.createElement("label");
          switchLabel.classList.add("switch");

          const input = document.createElement("input");
          input.type = "checkbox";
          input.checked = true;

          const span = document.createElement("span");

          switchLabel.appendChild(input);
          switchLabel.appendChild(span);

          header.appendChild(title);
          header.appendChild(switchLabel);

          // ===== BODY =====
          const body = document.createElement("div");
          body.classList.add("card-body");

          const small = document.createElement("small");
          small.textContent = "Horarios Asignado";

          const horariosDiv = document.createElement("div");
          horariosDiv.classList.add("horarios");

          if (item.horario) {
            horariosDiv.classList.add("datos");

            const horarioNombre = document.createElement("strong");
            horarioNombre.classList.add("horario-nombre");
            horarioNombre.textContent = item.horario;

            const horarioHoras = document.createElement("p");
            horarioHoras.classList.add("horario-horas");
            horarioHoras.textContent = `${item.start_time} - ${item.end_time}`;

            if (tienePermiso("shifts.update")) {
              const btnEliminarHorario = document.createElement("span");
              btnEliminarHorario.classList.add("horario-eliminar");
              btnEliminarHorario.textContent = "✖";
              btnEliminarHorario.title = "Eliminar horario";

              btnEliminarHorario.addEventListener("click", () => {
                deleteShifts(item, horariosDiv);
              });

              horariosDiv.appendChild(btnEliminarHorario);
            }

            horariosDiv.appendChild(horarioNombre);
            horariosDiv.appendChild(horarioHoras);
          } else {
            horariosDiv.textContent = "No hay horarios asignados";
          }

          // ===== ACCIONES =====
          const acciones = document.createElement("div");
          acciones.classList.add("acciones-jornada");

          if (tienePermiso("shifts.update")) {
            const btnGestionar = document.createElement("button");
            btnGestionar.classList.add("btn-cerrar");
            btnGestionar.textContent = "Gestionar horarios";

            btnGestionar.addEventListener("click", () => {
              editarmodalHorario(item, index);
            });

            acciones.appendChild(btnGestionar);
          }

          if (tienePermiso("shifts.destroy")) {
            const btnEliminarJornada = document.createElement("button");
            btnEliminarJornada.classList.add("btn-delete");
            btnEliminarJornada.textContent = "Eliminar jornada";

            btnEliminarJornada.addEventListener("click", () => {
              deleteJornada(item);
            });

            acciones.appendChild(btnEliminarJornada);
          }

          // ===== APPEND =====
          body.appendChild(small);
          body.appendChild(horariosDiv);
          body.appendChild(acciones);

          card.appendChild(header);
          card.appendChild(body);
          cardsContainer.appendChild(card);

          // ===== SWITCH =====
          input.addEventListener("change", () => {
            card.classList.toggle("deshabilitado", !input.checked);
          });
        });
      } else {
        cardsContainer.innerHTML = `
          <p style="color:var(--color-gris);font-size:13px">
            No hay jornadas registradas
          </p>
        `;
      }
    } catch (error) {
      console.error("Error cargando jornadas:", error);
    } finally {
      try {
        if (contenedor) {
          hideSpinner(contenedor);
        }
      } catch (spinnerError) {
        console.error("Error al ocultar spinner:", spinnerError);
      }
    }
  };

  // ================= INIT =================
  await cargarJornadas();
};
