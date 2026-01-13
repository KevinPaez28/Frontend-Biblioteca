import { get } from "../../../Helpers/api.js";
// import { abrirModalCrearAprendiz } from "./CreateApprentice/createController.js";
// import { deleteAprendiz } from "./deleteApprentice/deleteController.js";
// import { editModalAprendiz } from "./EditApprentice/ApprenticeController.js";
// import { abrirModalAprendiz } from "./viewApprentice/viewController.js";

export default async () => {

    const tbody = document.querySelector(".seccion-dashboard .table tbody");

    // ================= BOTONES =================
    const btnFiltros = document.querySelector("#btnFiltros");
    const filtrosAvanzados = document.querySelector("#filtrosAvanzados");
    const btnNuevoAprendiz = document.querySelector("#btnNuevoAprendiz");

    const btnImportar = document.querySelector("#btnImportar");
    const inputImportarArchivo = document.querySelector("#inputImportarArchivo");

    // ================= EVENTOS HEADER =================
    btnFiltros.addEventListener("click", () => {
        filtrosAvanzados.style.display =
            filtrosAvanzados.style.display === "grid" ? "none" : "grid";
    });

    btnNuevoAprendiz.addEventListener("click", () => {
        abrirModalCrearAprendiz();
    });

    btnImportar.addEventListener("click", () => {
        inputImportarArchivo.click();
    });

    inputImportarArchivo.addEventListener("change", async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const formData = new FormData();
        formData.append("file", archivo);

        try {
            await fetch("/api/apprentice/import", {
                method: "POST",
                body: formData
            });

            await cargarAprendices();
        } catch (error) {
            console.error("Error al importar archivo", error);
        }

        inputImportarArchivo.value = "";
    });

    // ================= FILTROS =================
    const filtros = {
        nombre: document.querySelector("#filtroNombre"),
        apellido: document.querySelector("#filtroApellido"),
        documento: document.querySelector("#filtroDocumento"),
        ficha: document.querySelector("#filtroFicha"),
        rol: document.querySelector("#filtroRol"),
    };

    // ================= ROLES =================
    const roles = await get("roles");
    roles.data.forEach(r => {
        const option = document.createElement("option");
        option.value = r.name;
        option.textContent = r.name;
        filtros.rol.append(option);
    });

    // ================= FUNCIÓN CENTRAL =================
    const cargarAprendices = async () => {

        let query = [];

        Object.entries(filtros).forEach(([key, input]) => {
            if (input && input.value && input.value.trim() !== "") {
                query.push(`${key}=${encodeURIComponent(input.value)}`);
            }
        });

        const url = query.length
            ? `apprentice/search?${query.join("&")}`
            : "apprentice/search";

        const response = await get(url);
        tbody.innerHTML = "";

        if (response?.data?.length > 0) {

            response.data.forEach((item, index) => {

                const tr = document.createElement("tr");

                const td1 = document.createElement("td");
                td1.textContent = index + 1;

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
                btnVer.addEventListener("click", () => {
                    abrirModalAprendiz(item);
                });

                const btnEditar = document.createElement("button");
                btnEditar.classList.add("btn-editar");
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener("click", () => {
                    editModalAprendiz(item);
                });

                const btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.addEventListener("click", () => {
                    deleteAprendiz(item);
                });

                td7.append(btnVer, btnEditar, btnEliminar);

                tr.append(td1, td2, td3, td4, td5, td6, td7);
                tbody.appendChild(tr);
            });

        } else {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 7;
            td.textContent = "No se encontraron aprendices";
            td.style.textAlign = "center";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    };

    // ================= FILTROS EN TIEMPO REAL =================
    Object.values(filtros).forEach(input => {
        if (!input) return;

        input.addEventListener(
            input.tagName === "SELECT" ? "change" : "input",
            cargarAprendices
        );
    });

    // ================= INIT =================
    await cargarAprendices();
};
