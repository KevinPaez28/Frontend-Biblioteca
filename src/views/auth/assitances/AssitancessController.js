import "../../../styles/assitances/assistances.css";
import { abrirModalAsistencia } from "./ViewAssitances/viewAssistances.js";
import { get } from "../../../helpers/api.js";
import { showSpinner, hideSpinner } from "../../../helpers/spinner.js";
import { abrirModalReason } from "./exportAssistances/export.js";

export default async () => {
    
    const tabla = document.querySelector("#tablaAsistencias");
    const contenedor = document.getElementById("asistencias-contenedor");
    const pagination = document.querySelector(".pagination") || createPagination();
    const btnExportarAsistencias = document.getElementById("btnExportarAsistencias");

    showSpinner(contenedor);

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

    btnExportarAsistencias.addEventListener("click", () => {
        abrirModalReason();
    });

    btnFiltros.addEventListener("click", () => {
        filtrosAvanzados.classList.toggle("filter-visible");
    });

    const cargarSelects = async () => {
        try {
            const roles = await get("roles");
            if (roles?.data?.length) {
                roles.data.forEach(r => {
                    const option = document.createElement("option");
                    option.value = r.name;
                    option.textContent = r.name;
                    filtros.rol.append(option);
                });
            }

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

    let currentPage = 1;

    const cargarAsistencias = async (page = 1) => {
        currentPage = page;
        showSpinner(contenedor);

        try {
            const params = new URLSearchParams();
            params.append("page", page);

            Object.entries(filtros).forEach(([key, input]) => {
                if (input && input.value.trim() !== "") {
                    params.append(key, input.value.trim());
                }
            });

            const url = `asistencia?${params.toString()}`;
            const response = await get(url);

            tabla.innerHTML = "";
            pagination.innerHTML = "";

            if (!response?.data?.records || response.data.records.length === 0) {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 7;
                td.textContent = "No se encontraron asistencias";
                td.style.textAlign = "center";
                tr.appendChild(td);
                tabla.appendChild(tr);
                return;
            }

            const records = response.data.records;
            const meta = response.data.meta;

            records.forEach((item, index) => {
                const tr = document.createElement("tr");

                const td1 = document.createElement("td");
                td1.textContent = (meta.current_page - 1) * meta.per_page + index + 1;

                const td2 = document.createElement("td");
                td2.textContent = item.Ficha || "—";

                const td3 = document.createElement("td");
                td3.textContent = item.FirstName || "—";

                const td4 = document.createElement("td");
                td4.textContent = item.LastName || "—";

                const td5 = document.createElement("td");
                td5.textContent = item.DateTime || "—";

                const td6 = document.createElement("td");
                td6.textContent = item.Reason || "—";

                const td7 = document.createElement("td");
                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => abrirModalAsistencia(item));
                td7.appendChild(btnVer);

                tr.append(td1, td2, td3, td4, td5, td6, td7);
                tabla.appendChild(tr);
            });

            // ================= PAGINACIÓN ARREGLADA =================
            const maxVisible = 5;
            let start = Math.max(1, meta.current_page - 2);
            let end = Math.min(meta.last_page, meta.current_page + 2);

            if (meta.current_page <= 3) {
                start = 1;
                end = Math.min(meta.last_page, maxVisible);
            }

            if (meta.current_page >= meta.last_page - 2) {
                start = Math.max(1, meta.last_page - maxVisible + 1);
                end = meta.last_page;
            }

            const btnPrev = document.createElement("button");
            btnPrev.textContent = "« Anterior";
            btnPrev.disabled = meta.current_page === 1;
            btnPrev.addEventListener("click", () => cargarAsistencias(meta.current_page - 1));
            pagination.appendChild(btnPrev);

            if (start > 1) {
                const first = document.createElement("button");
                first.textContent = "1";
                first.addEventListener("click", () => cargarAsistencias(1));
                pagination.appendChild(first);

                const dots = document.createElement("span");
                dots.textContent = "...";
                pagination.appendChild(dots);
            }

            for (let i = start; i <= end; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                btn.classList.add("btn-pag");
                if (i === meta.current_page) btn.disabled = true;
                btn.addEventListener("click", () => cargarAsistencias(i));
                pagination.appendChild(btn);
            }

            if (end < meta.last_page) {
                const dots = document.createElement("span");
                dots.textContent = "...";
                pagination.appendChild(dots);

                const last = document.createElement("button");
                last.textContent = meta.last_page;
                last.addEventListener("click", () => cargarAsistencias(meta.last_page));
                pagination.appendChild(last);
            }

            const btnNext = document.createElement("button");
            btnNext.textContent = "Siguiente »";
            btnNext.disabled = meta.current_page === meta.last_page;
            btnNext.addEventListener("click", () => cargarAsistencias(meta.current_page + 1));
            pagination.appendChild(btnNext);

        } catch (error) {
            console.error("Error cargando asistencias:", error);
            tabla.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;color:red">
                    Error al cargar asistencias. Revisa la consola.
                    </td>
                </tr>
            `;
        } finally {
            hideSpinner(contenedor);
        }
    };

    Object.values(filtros).forEach(input => {
        if (!input) return;
        input.addEventListener(
            input.tagName === "SELECT" ? "change" : "input",
            () => cargarAsistencias(1)
        );
    });

    await cargarSelects();
    cargarAsistencias();
};

function createPagination() {
    const pagination = document.createElement("div");
    pagination.className = "pagination";
    document.querySelector(".tabla-container").appendChild(pagination);
    return pagination;
}