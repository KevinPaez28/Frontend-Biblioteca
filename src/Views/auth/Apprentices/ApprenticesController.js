import { get } from "../../../Helpers/api.js";
// import { abrirModalCrearAprendiz } from "./CreateApprentice/createController.js";
// import { deleteAprendiz } from "./deleteApprentice/deleteController.js";
import { editModalAprendiz } from "./EditApprentices/ApprenticeseditController.js";
import { importApprenties } from "./importApprentices/imporApprentices.js";
import { abrirModalAprendiz } from "./viewApprentices/viewController.js";
import "../../../Styles/Assitances/assistances.css"

export default async () => {

    const tbody = document.querySelector(".aprendices-tbody");
    const pagination = document.querySelector(".pagination");

    // ================= BOTONES =================
    const btnFiltros = document.querySelector("#btnFiltros");
    const filtrosAvanzados = document.querySelector("#filtrosAvanzados");
    const btnNuevoAprendiz = document.querySelector("#btnNuevoAprendiz");
    const btnImportar = document.querySelector("#btnImportar");

    btnFiltros.addEventListener("click", () => filtrosAvanzados.classList.toggle("filter-visible"));
    btnNuevoAprendiz.addEventListener("click", () => abrirModalCrearAprendiz());
    btnImportar.addEventListener("click", (e) => importApprenties(e));

    // ================= FILTROS =================
    const filtros = {
        nombre: document.querySelector("#filtroNombre"),
        apellido: document.querySelector("#filtroApellido"),
        documento: document.querySelector("#filtroDocumento"),
        ficha: document.querySelector("#filtroFicha"),
        estados: document.querySelector("#filtroEstado"),
    };

    // ================= ROLES =================
  

    const estados = await get("EstadoUsuarios");
    estados.data.forEach(e => {
        const option = document.createElement("option");
        option.value = e.name;
        option.textContent = e.status;
        filtros.estados.append(option);
    });

    console.log(estados);
    

    // ================= PAGINACIÓN =================
    let currentPage = 1;
    const perPage = 5;

    const cargarAprendices = async (page = 1) => {
        currentPage = page;

        // Construir filtros
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

        // ======== LLENAR TABLA ========
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

            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn-editar");
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => editModalAprendiz(item));

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn-eliminar");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.addEventListener("click", () => deleteAprendiz(item)); // ojo: importa deleteAprendiz

            td7.append(btnVer, btnEditar, btnEliminar);
            tr.append(td1, td2, td3, td4, td5, td6, td7);
            tbody.appendChild(tr);
        });

        // ======== BOTONES DE PAGINACIÓN ========
        const btnPrev = document.createElement("button");
        btnPrev.textContent = "« Anterior";
        btnPrev.disabled = meta.current_page === 1;
        btnPrev.addEventListener("click", () => cargarAprendices(meta.current_page - 1));
        pagination.appendChild(btnPrev);

        // Números de página
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
    };

    // ======== FILTROS EN TIEMPO REAL ========
    Object.values(filtros).forEach(input => {
        if (!input) return;
        input.addEventListener(
            input.tagName === "SELECT" ? "change" : "input",
            () => cargarAprendices(1)
        );
    });

    // ======== INIT ========
    await cargarAprendices();

};
