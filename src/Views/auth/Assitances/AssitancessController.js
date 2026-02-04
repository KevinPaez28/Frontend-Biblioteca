import "../../../Styles/Assitances/assistances.css";
import { abrirModalAsistencia } from "./ViewAssitances/viewAssistances.js";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { abrirModalReason } from "./exportAssistances/export.js";


// ============================================================================
// ASISTENCIAS CONTROLLER PRINCIPAL (export default)
// ============================================================================
// - Vista completa de asistencias con filtros avanzados, paginación y export.
// - Carga dinámicamente selects de roles y motivos.
// - Filtros reactivos en tiempo real.
// - Tabla con botón "Ver" por fila.
// ============================================================================
export default async () => {
    
    // ===== ELEMENTOS DOM PRINCIPALES =====
    const tabla = document.querySelector("#tablaAsistencias");
    const contenedor = document.getElementById("asistencias-contenedor");
    const pagination = document.querySelector(".pagination") || createPagination(); // Crea si no existe
    const btnExportarAsistencias = document.getElementById("btnExportarAsistencias");

    showSpinner(contenedor); // Spinner inicial

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

    // Elementos UI
    const btnFiltros = document.querySelector("#btnFiltros");
    const filtrosAvanzados = document.querySelector("#filtrosAvanzados");

    // ================= BOTÓN EXPORTAR =================
    btnExportarAsistencias.addEventListener("click", () => {
        abrirModalReason(); // Abre modal de exportación Excel
    });

    // ================= MOSTRAR / OCULTAR FILTROS =================
    btnFiltros.addEventListener("click", () => {
        filtrosAvanzados.classList.toggle("filter-visible");
    });

    // ================= CARGAR SELECTS DINÁMICOS =================
    const cargarSelects = async () => {
        try {
            // ===== ROLES =====
            const roles = await get("roles");
            if (roles?.data?.length) {
                roles.data.forEach(r => {
                    const option = document.createElement("option");
                    option.value = r.name;
                    option.textContent = r.name;
                    filtros.rol.append(option);
                });
            }

            // ===== MOTIVOS =====
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

    let currentPage = 1; // Página actual

    // ================= FUNCIÓN CENTRAL: CARGAR ASISTENCIAS =================
    const cargarAsistencias = async (page = 1) => {
        currentPage = page;
        showSpinner(contenedor);

        try {
            // Construye query string con filtros + paginación
            const params = new URLSearchParams();
            params.append("page", page);

            // Agrega filtros activos
            Object.entries(filtros).forEach(([key, input]) => {
                if (input && input.value.trim() !== "") {
                    params.append(key, input.value.trim());
                }
            });

            // Endpoint de asistencias con parámetros
            const url = `asistencia?${params.toString()}`;
            const response = await get(url);

            console.log(response); // Debug
            
            // Limpia tabla y paginación
            tabla.innerHTML = "";
            pagination.innerHTML = "";

            // ===== TABLA VACÍA =====
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

            // ===== RELLENA TABLA =====
            const records = response.data.records;
            const meta = response.data.meta;

            records.forEach((item, index) => {
                const tr = document.createElement("tr");

                // #1: Número secuencial global
                const td1 = document.createElement("td");
                td1.textContent = (meta.current_page - 1) * meta.per_page + index + 1;

                // #2: Ficha
                const td2 = document.createElement("td");
                td2.textContent = item.Ficha || "—";

                // #3: Nombre
                const td3 = document.createElement("td");
                td3.textContent = item.FirstName || "—";

                // #4: Apellido
                const td4 = document.createElement("td");
                td4.textContent = item.LastName || "—";

                // #5: Fecha/Hora
                const td5 = document.createElement("td");
                td5.textContent = item.DateTime || "—";

                // #6: Motivo (presente, falta, etc.)
                const td6 = document.createElement("td");
                td6.textContent = item.Reason || "—";

                // #7: Acción (solo botón VER)
                const td7 = document.createElement("td");
                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => abrirModalAsistencia(item));
                td7.appendChild(btnVer);

                tr.append(td1, td2, td3, td4, td5, td6, td7);
                tabla.appendChild(tr);
            });

            // ===== PAGINACIÓN DINÁMICA =====
            const btnPrev = document.createElement("button");
            btnPrev.textContent = "« Anterior";
            btnPrev.disabled = meta.current_page === 1;
            btnPrev.addEventListener("click", () => cargarAsistencias(meta.current_page - 1));
            pagination.appendChild(btnPrev);

            for (let i = 1; i <= meta.last_page; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                btn.classList.add("btn-pag");
                if (i === meta.current_page) btn.disabled = true;
                btn.addEventListener("click", () => cargarAsistencias(i));
                pagination.appendChild(btn);
            }

            const btnNext = document.createElement("button");
            btnNext.textContent = "Siguiente »";
            btnNext.disabled = meta.current_page === meta.last_page;
            btnNext.addEventListener("click", () => cargarAsistencias(meta.current_page + 1));
            pagination.appendChild(btnNext);

        } catch (error) {
            console.error("Error cargando asistencias:", error);
            // Error en tabla
            tabla.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;color:red">
                    Error al cargar asistencias. Revisa la consola.
                    </td>
                </tr>
            `;
        } finally {
            hideSpinner(contenedor); // Siempre oculta spinner
        }
    };

    // ================= FILTROS REACTIVOS =================
    Object.values(filtros).forEach(input => {
        if (!input) return;
        input.addEventListener(
            input.tagName === "SELECT" ? "change" : "input",
            () => cargarAsistencias(1) // Vuelve a página 1
        );
    });

    // ================= INICIALIZACIÓN =================
    await cargarSelects();     // Carga roles + motivos
    cargarAsistencias();       // Carga primera página
};

// ================= HELPER: CREAR PAGINACIÓN =================
// Función auxiliar para crear contenedor de paginación si no existe
function createPagination() {
    const pagination = document.createElement("div");
    pagination.className = "pagination";
    document.querySelector(".tabla-container").appendChild(pagination);
    return pagination;
}
