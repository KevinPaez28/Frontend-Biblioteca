import { get } from "../../../Helpers/api.js";
import { deleteUsuario } from "./deleteUsers/deleteController.js";
import { editModalUsuario } from "./EditUsers/UsersController.js";
import { abrirModalUsuario } from "./viewUsers/viewController.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { modalCrearUser } from "./CreateUsers/createController.js";

export default async () => {
    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    const pagination = document.querySelector(".pagination");
    const contenedor = document.getElementById("usuarios-contenedor");
    showSpinner(contenedor);

    const btnFiltros = document.querySelector("#btnFiltros");
    const filtrosAvanzados = document.querySelector("#filtrosAvanzados");
    const btnNuevoUsuario = document.querySelector("#btnNuevoUsuario");

    btnFiltros.addEventListener("click", () => {
        filtrosAvanzados.style.display =
            filtrosAvanzados.style.display === "none" ? "grid" : "none";
    });

    if (btnNuevoUsuario && tienePermiso("users.store")) {
        btnNuevoUsuario.addEventListener("click", () => modalCrearUser())

    } else if (btnNuevoUsuario) {
        btnNuevoUsuario.style.display = "none";
    }

    const filtros = {
        nombre: document.querySelector("#filtroNombre"),
        encargado: document.querySelector("#filtroEncargado"),
        documento: document.querySelector("#filtroDocumento"),
        rol: document.querySelector("#filtroRol"),
        estado: document.querySelector("#filtroEstado"),
    };

    if (tienePermiso("roles.index")) {
        const roles = await get("roles");
        roles.data.forEach(r => {
            const option = document.createElement("option");
            option.value = r.name;
            option.textContent = r.name;
            filtros.rol.append(option);
        });
    }

    if (tienePermiso("user-status.index")) {
        const estados = await get("EstadoUsuarios");
        estados.data.forEach(e => {
            const option = document.createElement("option");
            option.value = e.name;
            option.textContent = e.status;
            filtros.estado.append(option);
        });
    }

    let currentPage = 1;

    const cargarUsuarios = async (page = 1) => {
        currentPage = page;

        try {
            const params = new URLSearchParams();
            params.append("page", page);

            Object.entries(filtros).forEach(([key, input]) => {
                if (input && input.value.trim() !== "") {
                    params.append(key, input.value.trim());
                }
            });

            const url = `user/search?${params.toString()}`;
            const response = await get(url);
            console.log(response);
            
            tbody.innerHTML = "";
            pagination.innerHTML = "";

            if (!response?.data?.records || response.data.records.length === 0) {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 7;
                td.textContent = "No se encontraron usuarios";
                td.style.textAlign = "center";
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
                td5.textContent = item.rol || "—";

                const td6 = document.createElement("td");
                const spanEstado = document.createElement("span");
                spanEstado.classList.add("badge-time");
                spanEstado.textContent = item.estado || "—";
                td6.appendChild(spanEstado);

                const td7 = document.createElement("td");

                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => abrirModalUsuario(item));
                td7.append(btnVer);

                if (tienePermiso("users.update")) {
                    const btnEditar = document.createElement("button");
                    btnEditar.classList.add("btn-editar");
                    btnEditar.textContent = "Editar";
                    btnEditar.addEventListener("click", () => editModalUsuario(item));
                    td7.append(btnEditar);
                }

                if (tienePermiso("users.destroy")) {
                    const btnEliminar = document.createElement("button");
                    btnEliminar.classList.add("btn-eliminar");
                    btnEliminar.textContent = "Eliminar";
                    btnEliminar.addEventListener("click", () => deleteUsuario(item));
                    td7.append(btnEliminar);
                }

                tr.append(td1, td2, td3, td4, td5, td6, td7);
                tbody.appendChild(tr);
            });

            const btnPrev = document.createElement("button");
            btnPrev.textContent = "« Anterior";
            btnPrev.disabled = meta.current_page === 1;
            btnPrev.addEventListener("click", () => cargarUsuarios(meta.current_page - 1));
            pagination.appendChild(btnPrev);

            for (let i = 1; i <= meta.last_page; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                btn.classList.add("btn-pag");
                if (i === meta.current_page) btn.disabled = true;
                btn.addEventListener("click", () => cargarUsuarios(i));
                pagination.appendChild(btn);
            }

            const btnNext = document.createElement("button");
            btnNext.textContent = "Siguiente »";
            btnNext.disabled = meta.current_page === meta.last_page;
            btnNext.addEventListener("click", () => cargarUsuarios(meta.current_page + 1));
            pagination.appendChild(btnNext);

        } catch (error) {
            console.error(" Error cargando usuarios:", error);
            tbody.innerHTML = "";
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 7;
            td.textContent = "Error al cargar usuarios. Revisa la consola.";
            td.style.textAlign = "center";
            td.style.color = "red";
            tr.appendChild(td);
            tbody.appendChild(tr);
        } finally {
            try {
                if (contenedor) {
                    hideSpinner(contenedor);
                }
            } catch (spinnerError) {
                console.error("Error al ocultar spinner:", spinnerError);
            }
        }
    };

    Object.values(filtros).forEach(input => {
        if (!input) return;
        input.addEventListener(
            input.tagName === "SELECT" ? "change" : "input",
            () => cargarUsuarios(1)
        );
    });

    await cargarUsuarios();
};
