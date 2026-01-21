import "../../../Styles/Histories/Histories.css";
import { get } from "../../../Helpers/api.js";

export default async () => {

    const contenedor = document.getElementById("historial-lista");

    const inputs = document.querySelectorAll(".input-filter");
    const inputAccion  = inputs[0];
    const inputUsuario = inputs[1];
    const inputModulo  = inputs[2];

    const btnFiltrar = document.querySelector(".btn-icon");

    const cargarHistorial = async () => {

        const params = new URLSearchParams({
            action: inputAccion.value.trim(),
            user: inputUsuario.value.trim(),
            module: inputModulo.value.trim(),
        }).toString();

        const response = await get(`historial?${params}`);
        contenedor.innerHTML = "";
        console.log(response);
        

        if (response && response.data && response.data.length > 0) {

            response.data.forEach(item => {

                const divItem = document.createElement("div");
                divItem.classList.add("historial-item");

                // ===== ACCIÓN =====
                const divAccion = document.createElement("div");
                divAccion.classList.add("historial-accion");

                const accion = item.action?.name?.toLowerCase() || "crear";
                divAccion.classList.add(accion);
                divAccion.textContent = item.action?.name || "Acción";

                // ===== INFO =====
                const divInfo = document.createElement("div");
                divInfo.classList.add("historial-info");

                const strong = document.createElement("strong");
                strong.textContent = item.user.perfil.name || "Usuario";

                const p = document.createElement("p");
                p.innerHTML = item.description || "Sin descripción";

                divInfo.appendChild(strong);
                divInfo.appendChild(p);

                // ===== FECHA =====
                const divFecha = document.createElement("div");
                divFecha.classList.add("historial-fecha");

                const fecha = new Date(item.created_at);

                const span = document.createElement("span");
                span.textContent = fecha.toLocaleDateString();

                const small = document.createElement("small");
                small.textContent = fecha.toLocaleTimeString();

                divFecha.appendChild(span);
                divFecha.appendChild(small);

                // ===== APPEND =====
                divItem.appendChild(divAccion);
                divItem.appendChild(divInfo);
                divItem.appendChild(divFecha);

                contenedor.appendChild(divItem);
            });

        } else {
            const empty = document.createElement("div");
            empty.classList.add("historial-empty");
            empty.textContent = "No hay registros en el historial";
            contenedor.appendChild(empty);
        }
    };

    // ===== EVENTOS =====
    btnFiltrar.addEventListener("click", cargarHistorial);

    inputs.forEach(input => {
        input.addEventListener("keyup", cargarHistorial);
    });

    await cargarHistorial();
};
