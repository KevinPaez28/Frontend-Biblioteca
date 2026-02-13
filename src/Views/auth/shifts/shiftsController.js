import "../../../Styles/shifts/shifts.css";
import { get } from "../../../Helpers/api.js";
import { editarmodalHorario } from "./EditShifts/editShiftsController.js";
import { deleteShifts } from "./deleteShifts/deleteShecdules.js";
import { abrirModalCrearJornada } from "./createShifts/createShifts.js";
import { deleteJornada } from "./deleteShifts/deleteShift.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { tienePermiso } from "../../../helpers/auth.js"; 

/**
 * Función principal para la gestión de jornadas.
 * Se encarga de cargar las jornadas desde el backend,
 * renderizarlas en el DOM y gestionar los eventos de los botones.
 * @async
 * @returns {Promise<void>}
 */
export default async () => {
  // Obtiene referencias a los elementos del DOM
  const contenedor = document.getElementById("jornadas-contenedor");
  const cardsContainer = document.querySelector(".cards");
  const btnNuevoHorario = document.getElementById("btnNuevoHorario");

  // ================= BOTON NUEVO HORARIO =================
  // Si existe el botón "Nuevo Horario", agrega un event listener
  if (btnNuevoHorario) {
    // Verifica si el usuario tiene permiso para crear jornadas
    if (tienePermiso("shifts.store")) {
      // Si tiene permiso, agrega un event listener para abrir el modal de creación de jornada
      btnNuevoHorario.addEventListener("click", () => {
        abrirModalCrearJornada();
      });
    } else {
      // Si no tiene permiso, oculta el botón
      btnNuevoHorario.style.display = "none";
    }
  }

  /**
   * Función para cargar las jornadas desde el backend y renderizarlas en el DOM.
   * @async
   * @returns {Promise<void>}
   */
  const cargarJornadas = async () => {
    try {
      // Muestra el spinner de carga mientras se obtienen las jornadas
      if (contenedor) {
        showSpinner(contenedor);
      }

      // Realiza una petición GET al backend para obtener la lista de jornadas completas
      const jornadas = await get("jornadas/complete");

      // Limpia el contenedor de las tarjetas
      cardsContainer.innerHTML = "";

      // Si se obtienen jornadas, itera sobre ellas y las renderiza en el DOM
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

          // Si la jornada tiene un horario asignado, lo renderiza
          if (item.horario) {
            horariosDiv.classList.add("datos");

            const horarioNombre = document.createElement("strong");
            horarioNombre.classList.add("horario-nombre");
            horarioNombre.textContent = item.horario;

            const horarioHoras = document.createElement("p");
            horarioHoras.classList.add("horario-horas");
            horarioHoras.textContent = `${item.start_time} - ${item.end_time}`;

            // Si el usuario tiene permiso para actualizar jornadas, agrega un botón para eliminar el horario
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
          // Si la jornada no tiene un horario asignado, muestra un mensaje
          } else {
            horariosDiv.textContent = "No hay horarios asignados";
          }

          // ===== ACCIONES =====
          const acciones = document.createElement("div");
          acciones.classList.add("acciones-jornada");

          // Si el usuario tiene permiso para actualizar jornadas, agrega un botón para gestionar los horarios
          if (tienePermiso("shifts.update")) {
            const btnGestionar = document.createElement("button");
            btnGestionar.classList.add("btn-cerrar");
            btnGestionar.textContent = "Gestionar horarios";

            btnGestionar.addEventListener("click", () => {
              editarmodalHorario(item, index);
            });

            acciones.appendChild(btnGestionar);
          }

          // Si el usuario tiene permiso para eliminar jornadas, agrega un botón para eliminar la jornada
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
          // Agrega un event listener al switch para habilitar/deshabilitar la jornada
          input.addEventListener("change", () => {
            card.classList.toggle("deshabilitado", !input.checked);
          });
        });
      // Si no hay jornadas registradas, muestra un mensaje
      } else {
        cardsContainer.innerHTML = `
          <p style="color:var(--color-gris);font-size:13px">
            No hay jornadas registradas
          </p>
        `;
      }
    } catch (error) {
      // Captura cualquier error que ocurra durante la carga de jornadas
      console.error("Error cargando jornadas:", error);
    } finally {
      // Oculta el spinner de carga
      try {
        if (contenedor) {
          hideSpinner(contenedor);
        }
      } catch (spinnerError) {
        // Captura cualquier error que ocurra al ocultar el spinner
        console.error("Error al ocultar spinner:", spinnerError);
      }
    }
  };

  // ================= INIT =================
  // Carga las jornadas al iniciar la página
  await cargarJornadas();
};
