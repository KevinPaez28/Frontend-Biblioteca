// import "../../../Styles/Usuarios/Usuarios.css";
import { get } from "../../../Helpers/api.js";
import { abrirModalCrearUsuario } from "./CreateUsers/createController.js";
import { deleteUsuario } from "./deleteUsers/deleteController.js";
import { editModalUsuario } from "./EditUsers/UsersController.js";
import { abrirModalUsuario } from "./viewUsers/viewController.js";

export default async () => {

    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    const btnFiltros = document.querySelector("#btnFiltros");

    const btnNuevoUsuario = document.querySelector("#btnNuevoUsuario");
    btnFiltros.addEventListener("click", () => {
        filtrosAvanzados.style.display =
            filtrosAvanzados.style.display === "grid" ? "none" : "grid";
    });
    // ================= FILTROS =================
    const filtros = {
        nombre: document.querySelector("#filtroNombre"),
        apellido: document.querySelector("#filtroApellido"),
        documento: document.querySelector("#filtroDocumento"),
        rol: document.querySelector("#filtroRol"),
        estado: document.querySelector("#filtroEstado"),
    };

    btnNuevoUsuario.addEventListener("click", () => {
        abrirModalCrearUsuario();
    });

    const roles = await get("roles");

    roles.data.forEach(r => {
        const option = document.createElement("option");
        option.value = r.name; // importante: enviamos el nombre
        option.textContent = r.name;
        filtros.rol.append(option);
    });

    const estados = await get("EstadoUsuarios");
    estados.data.forEach(e => {
        const option = document.createElement("option");
        option.value = e.name;
        option.textContent = e.name;
        filtros.estado.append(option); 
    });

    // ================= FUNCIÓN CENTRAL =================
    const cargarUsuarios = async () => {

        let query = [];

        Object.entries(filtros).forEach(([key, input]) => {
            if (input && input.value && input.value.trim() !== "") {
                query.push(`${key}=${encodeURIComponent(input.value)}`);
            }
        });

        const url = query.length
            ? `user/search?${query.join("&")}`
            : "user/search";

        const usuarios = await get(url);
        tbody.innerHTML = "";

        if (usuarios && usuarios.data && usuarios.data.length > 0) {

            usuarios.data.forEach((item, index) => {

                const tr = document.createElement("tr");

                // ===== # =====
                const td1 = document.createElement("td");
                td1.textContent = index + 1;

                // ===== DOCUMENTO =====
                const td2 = document.createElement("td");
                td2.textContent = item.document || "—";

                // ===== NOMBRE =====
                const td3 = document.createElement("td");
                td3.textContent = item.first_name || "—";

                // ===== APELLIDO =====
                const td4 = document.createElement("td");
                td4.textContent = item.last_name || "—";

                // ===== ROL =====
                const td5 = document.createElement("td");
                td5.textContent = item.rol || "—";

                // ===== ESTADO =====
                const td6 = document.createElement("td");
                const spanEstado = document.createElement("span");
                spanEstado.classList.add("badge-time");
                spanEstado.textContent = item.estado || "—";
                td6.appendChild(spanEstado);

                // ===== ACCIONES =====
                const td7 = document.createElement("td");

                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => {
                    abrirModalUsuario(item);
                });

                const btnEditar = document.createElement("button");
                btnEditar.classList.add("btn-editar");
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener("click", () => {
                    editModalUsuario(item);
                });

                const btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.addEventListener("click", () => {
                    deleteUsuario(item);
                });

                td7.appendChild(btnVer);
                td7.appendChild(btnEditar);
                td7.appendChild(btnEliminar);

                // ===== APPEND FINAL =====
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tr.appendChild(td6);
                tr.appendChild(td7);

                tbody.appendChild(tr);
            });

        } else {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 7;
            td.textContent = "No se encontraron resultados";
            td.style.textAlign = "center";
            td.style.color = "var(--color-gris)";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    };

    // ================= FILTROS EN TIEMPO REAL =================
    Object.values(filtros).forEach(input => {
        if (!input) return;

        if (input.tagName === "SELECT") {
            input.addEventListener("change", cargarUsuarios);
        } else {
            input.addEventListener("input", cargarUsuarios);
        }
    });

    // ================= INIT =================
    await cargarUsuarios();
};
