import { get } from "../../../Helpers/api.js";
import { abrirModalCrearAprendiz } from "./CreateApprentices/createController.js";
import { editModalAprendiz } from "./EditApprentices/ApprenticeseditController.js";
import { importApprenties } from "./importApprentices/imporApprentices.js";
import { abrirModalAprendiz } from "./viewApprentices/viewController.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { tienePermiso } from "../../../helpers/auth.js";
import "../../../Styles/Assitances/assistances.css";

export default async () => {
    const contenedor = document.getElementById("aprendices-contenedor");
    showSpinner(contenedor);
    const tbody = document.querySelector(".aprendices-tbody");
    const pagination = document.querySelector(".pagination");
    
    const btnFiltros = document.querySelector("#btnFiltros");
    const filtrosAvanzados = document.querySelector("#filtrosAvanzados");
    const btnNuevoAprendiz = document.querySelector("#btnNuevoAprendiz");
    const btnImportar = document.querySelector("#btnImportar");

    btnFiltros?.addEventListener("click", () => filtrosAvanzados.classList.toggle("filter-visible"));

    if (btnNuevoAprendiz && tienePermiso("users.store")) {
        btnNuevoAprendiz.addEventListener("click", () => abrirModalCrearAprendiz());
    } else if (btnNuevoAprendiz) {
        btnNuevoAprendiz.style.display = "none";
    }

    if (btnImportar && tienePermiso("users.store")) {
        btnImportar.addEventListener("click", (e) => importApprenties(e));
    } else if (btnImportar) {
        btnImportar.style.display = "none";
    }

    const filtros = {
        nombre: document.querySelector("#filtroNombre"),
        apellido: document.querySelector("#filtroApellido"),
        documento: document.querySelector("#filtroDocumento"),
        ficha: document.querySelector("#filtroFicha"),
        estados: document.querySelector("#filtroEstado"),
    };

    if (tienePermiso("user-status.index")) {
        const estados = await get("EstadoUsuarios");
        estados.data.forEach(e => {
            const option = document.createElement("option");
            option.value = e.name;
            option.textContent = e.status;
            filtros.estados.append(option);
        });
    }

    let currentPage = 1;

    const cargarAprendices = async (page = 1) => {
        currentPage = page;

        try {
            const params = new URLSearchParams();
            params.append("page", page);
            Object.entries(filtros).forEach(([key, input]) => {
                if (input && input.value.trim() !== "") {
                    params.append(key, input.value.trim());
                }
            });

            const url = `user/aprendices?${params.toString()}`;
            const response = await get(url);

            tbody.innerHTML = "";
            pagination.innerHTML = "";

            if (!response?.data?.records || response.data.records.length === 0) {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 7;
                td.style.textAlign = "center";
                td.textContent = "No se encontraron aprendices";
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }

            const records = response.data.records;
            const meta = response.data.meta;

            records.forEach((item, index) => {
                const tr = document.createElement("tr");

                const td1 = document.createElement("td");
                td1.textContent = (meta.current_page - 1) * meta.per_page + index + 1;

                const td2 = document.createElement("td");
                td2.textContent = item.document || "—";

                const td3 = document.createElement("td");
                td3.textContent = item.first_name || "—";

                const td4 = document.createElement("td");
                td4.textContent = item.last_name || "—";

                const td5 = document.createElement("td");
                td5.textContent = item.ficha || "—";

                const td6 = document.createElement("td");
                const spanRol = document.createElement("span");
                spanRol.classList.add("badge-time");
                spanRol.textContent = item.rol || "Aprendiz";
                td6.appendChild(spanRol);

                const td7 = document.createElement("td");
                
                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => abrirModalAprendiz(item));
                td7.append(btnVer);

                if (tienePermiso("users.update")) {
                    const btnEditar = document.createElement("button");
                    btnEditar.classList.add("btn-editar");
                    btnEditar.textContent = "Editar";
                    btnEditar.addEventListener("click", () => editModalAprendiz(item));
                    td7.append(btnEditar);
                }

                tr.append(td1, td2, td3, td4, td5, td6, td7);
                tbody.appendChild(tr);
            });

            const btnPrev = document.createElement("button");
            btnPrev.textContent = "« Anterior";
            btnPrev.disabled = meta.current_page === 1;
            btnPrev.addEventListener("click", () => cargarAprendices(meta.current_page - 1));
            pagination.appendChild(btnPrev);

            for (let i = 1; i <= meta.last_page; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                btn.classList.add("btn-pag");
                if (i === meta.current_page) btn.disabled = true;
                btn.addEventListener("click", () => cargarAprendices(i));
                pagination.appendChild(btn);
            }

            const btnNext = document.createElement("button");
            btnNext.textContent = "Siguiente »";
            btnNext.disabled = meta.current_page === meta.last_page;
            btnNext.addEventListener("click", () => cargarAprendices(meta.current_page + 1));
            pagination.appendChild(btnNext);

        } catch (e) {
            console.error(e);
        } finally {
            hideSpinner(contenedor);
        }
    };

    Object.values(filtros).forEach(input => {
        if (!input) return;
        input.addEventListener(
            input.tagName === "SELECT" ? "change" : "input",
            () => cargarAprendices(1)
        );
    });

    await cargarAprendices();
};
