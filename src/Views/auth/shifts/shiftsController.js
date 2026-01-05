import "../../../Styles/shifts/shifts.css";
import { get } from "../../../Helpers/api.js";
import { editarmodalHorario } from "./EditShifts/editShiftsController.js";
import { deleteShifts } from "./deleteShifts/deleteShifts.js";

export default async (params = null) => {
    const jornadas = await get("jornadas/complete");
    const cardsContainer = document.querySelector(".cards");
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

            // ===== CREACIÓN DE ELEMENTOS PARA HORARIOS =====
            if (item.horario) {
                horariosDiv.classList.add("datos");

                const horarioNombre = document.createElement("strong");
                horarioNombre.classList.add("horario-nombre");
                horarioNombre.textContent = item.horario;

                const horarioHoras = document.createElement("p");
                horarioHoras.classList.add("horario-horas");
                horarioHoras.textContent = `${item.start_time} - ${item.end_time}`;

                // ===== BOTÓN ELIMINAR =====
                const btnEliminar = document.createElement("span");
                btnEliminar.classList.add("horario-eliminar");
                btnEliminar.textContent = "✖";
                btnEliminar.title = "Eliminar horario";

                btnEliminar.addEventListener("click", () => {
                    deleteShifts(item, horariosDiv);
                });

                horariosDiv.appendChild(horarioNombre);
                horariosDiv.appendChild(horarioHoras);
                horariosDiv.appendChild(btnEliminar);
            } else {
                horariosDiv.textContent = "No hay horarios asignados";
                horariosDiv.classList.remove("datos");
            }

            const btn = document.createElement("button");
            btn.classList.add("btn-cerrar");
            btn.textContent = "Gestionar horarios";

            btn.addEventListener("click", () => {
                editarmodalHorario(item, index);
            });

            // ===== APPEND =====
            body.appendChild(small);
            body.appendChild(horariosDiv);
            body.appendChild(btn);

            card.appendChild(header);
            card.appendChild(body);
            cardsContainer.appendChild(card);

            // ===== CHECKLIST PARA OPACIDAD Y BLOQUEO =====
            input.addEventListener("change", () => {
                if (!input.checked) {
                    card.classList.add("deshabilitado");
                } else {
                    card.classList.remove("deshabilitado");
                }
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
