import "../../../Styles/shifts/shifts.css";
import { get } from "../../../Helpers/api.js";

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
            small.textContent = "Horarios";

            const horariosDiv = document.createElement("div");
            horariosDiv.classList.add("horarios");

            horariosDiv.innerHTML = `
                <strong>${item.horario}</strong><br>
                ${item.start_time} - ${item.end_time}
            `;

            const btn = document.createElement("button");
            btn.classList.add("btn");
            btn.textContent = "Gestionar horarios";

            // ===== APPEND =====
            body.appendChild(small);
            body.appendChild(horariosDiv);
            body.appendChild(btn);

            card.appendChild(header);
            card.appendChild(body);

            cardsContainer.appendChild(card);
        });

    } else {
        cardsContainer.innerHTML = `
            <p style="color:#9ca3af;font-size:13px">
                No hay jornadas registradas
            </p>
        `;
    }
};
