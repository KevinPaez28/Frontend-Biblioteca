import "../../../styles/histories/Histories.css";
import { get } from "../../../helpers/api.js";
import { showSpinner, hideSpinner } from "../../../helpers/spinner.js";

export default async () => {

    const contenedor = document.getElementById("historial-lista");
    const pagination = document.querySelector(".pagination");

    const inputs = document.querySelectorAll(".input-filter");
    const inputAccion  = inputs[0];
    const inputUsuario = inputs[1];
    const inputModulo  = inputs[2];

    const btnFiltrar = document.querySelector(".btn-outline");

    let currentPage = 1;

    const cargarHistorial = async (page = 1) => {
        currentPage = page;

        const params = new URLSearchParams({
            page,
            action: inputAccion.value.trim(),
            user: inputUsuario.value.trim(),
            module: inputModulo.value.trim(),
        }).toString();
    
        try {
            showSpinner(contenedor);

            const response = await get(`historial?${params}`);
            contenedor.innerHTML = "";
            pagination.innerHTML = "";

            const data = response.data;
            const records = data.data;

            if (records?.length) {
                records.forEach(item => {
                    const divItem = document.createElement("div");
                    divItem.classList.add("historial-item");

                    const divAccion = document.createElement("div");
                    divAccion.classList.add("historial-accion");

                    const accion = item.action?.name?.toLowerCase() || "crear";
                    divAccion.classList.add(accion);
                    divAccion.textContent = item.action?.name || "Acción";

                    const divInfo = document.createElement("div");
                    divInfo.classList.add("historial-info");

                    const strong = document.createElement("strong");
                    strong.textContent = item.user?.perfil?.name || "Usuario";

                    const p = document.createElement("p");
                    p.innerHTML = item.description || "Sin descripción";

                    divInfo.append(strong, p);

                    const divFecha = document.createElement("div");
                    divFecha.classList.add("historial-fecha");

                    const fecha = new Date(item.created_at);
                    divFecha.innerHTML = `
                        <span>${fecha.toLocaleDateString()}</span>
                        <small>${fecha.toLocaleTimeString()}</small>
                    `;

                    divItem.append(divAccion, divInfo, divFecha);
                    contenedor.appendChild(divItem);
                });
            } else {
                contenedor.innerHTML = `
                    <div class="historial-empty">
                        No hay registros en el historial
                    </div>
                `;
            }

            // ================= PAGINACIÓN ARREGLADA =================
            const maxVisible = 5;
            let start = Math.max(1, data.current_page - 2);
            let end = Math.min(data.last_page, data.current_page + 2);

            if (data.current_page <= 3) {
                start = 1;
                end = Math.min(data.last_page, maxVisible);
            }

            if (data.current_page >= data.last_page - 2) {
                start = Math.max(1, data.last_page - maxVisible + 1);
                end = data.last_page;
            }

            const btnPrev = document.createElement("button");
            btnPrev.textContent = "«";
            btnPrev.disabled = data.current_page === 1;
            btnPrev.onclick = () => cargarHistorial(data.current_page - 1);
            pagination.appendChild(btnPrev);

            if (start > 1) {
                const first = document.createElement("button");
                first.textContent = "1";
                first.onclick = () => cargarHistorial(1);
                pagination.appendChild(first);

                const dots = document.createElement("span");
                dots.textContent = "...";
                pagination.appendChild(dots);
            }

            for (let i = start; i <= end; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                if (i === data.current_page) btn.disabled = true;
                btn.onclick = () => cargarHistorial(i);
                pagination.appendChild(btn);
            }

            if (end < data.last_page) {
                const dots = document.createElement("span");
                dots.textContent = "...";
                pagination.appendChild(dots);

                const last = document.createElement("button");
                last.textContent = data.last_page;
                last.onclick = () => cargarHistorial(data.last_page);
                pagination.appendChild(last);
            }

            const btnNext = document.createElement("button");
            btnNext.textContent = "»";
            btnNext.disabled = data.current_page === data.last_page;
            btnNext.onclick = () => cargarHistorial(data.current_page + 1);
            pagination.appendChild(btnNext);

        } catch (e) {
            console.error(e);
        } finally {
            hideSpinner(contenedor);
        }
    };

    btnFiltrar.addEventListener("click", () => cargarHistorial(1));
    inputs.forEach(i => i.addEventListener("keyup", () => cargarHistorial(1)));

    await cargarHistorial();
};