import "../../../Styles/shifts/shifts.css";
import { get } from "../../../Helpers/api.js";
import { editarmodalHorario } from "./EditShifts/editShiftsController.js";
import { deleteShifts } from "./deleteShifts/deleteShecdules.js";
import { abrirModalCrearJornada } from "./createShifts/createShifts.js";
import { deleteJornada } from "./deleteShifts/deleteShift.js";

export default async () => {

    const jornadas = await get("jornadas/complete");
    const cardsContainer = document.querySelector(".cards");
    cardsContainer.innerHTML = "";

    const btnNuevoHorario = document.getElementById("btnNuevoHorario");

    btnNuevoHorario.addEventListener("click", () => {
        abrirModalCrearJornada();
    });

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

            // ===== HORARIO ASIGNADO =====
            if (item.horario) {
                horariosDiv.classList.add("datos");

                const horarioNombre = document.createElement("strong");
                horarioNombre.classList.add("horario-nombre");
                horarioNombre.textContent = item.horario;

                const horarioHoras = document.createElement("p");
                horarioHoras.classList.add("horario-horas");
                horarioHoras.textContent = `${item.start_time} - ${item.end_time}`;

                const btnEliminarHorario = document.createElement("span");
                btnEliminarHorario.classList.add("horario-eliminar");
                btnEliminarHorario.textContent = "✖";
                btnEliminarHorario.title = "Eliminar horario";

                btnEliminarHorario.addEventListener("click", () => {
                    deleteShifts(item, horariosDiv); // ← SOLO horario
                });

                horariosDiv.appendChild(horarioNombre);
                horariosDiv.appendChild(horarioHoras);
                horariosDiv.appendChild(btnEliminarHorario);

            } else {
                horariosDiv.textContent = "No hay horarios asignados";
            }

            // ===== ACCIONES =====
            const acciones = document.createElement("div");
            acciones.classList.add("acciones-jornada");

            // Gestionar
            const btnGestionar = document.createElement("button");
            btnGestionar.classList.add("btn-cerrar");
            btnGestionar.textContent = "Gestionar horarios";

            btnGestionar.addEventListener("click", () => {
                editarmodalHorario(item, index);
            });

            // 🗑️ Eliminar jornada
            const btnEliminarJornada = document.createElement("button");
            btnEliminarJornada.classList.add("btn-delete");
            btnEliminarJornada.textContent = "Eliminar jornada";

            btnEliminarJornada.addEventListener("click", () => {
                deleteJornada(item);
            });

            acciones.appendChild(btnGestionar);
            acciones.appendChild(btnEliminarJornada);

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
};
