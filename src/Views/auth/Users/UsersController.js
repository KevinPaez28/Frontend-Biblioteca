import { get } from "../../../Helpers/api.js";
import { deleteUsuario } from "./deleteUsers/deleteController.js";
import { editModalUsuario } from "./EditUsers/UsersController.js";
import { abrirModalUsuario } from "./viewUsers/viewController.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { modalCrearUser } from "./CreateUsers/createController.js";

/**
 * @description Función asíncrona principal para gestionar la lista de usuarios en el panel de administración.
 * Se encarga de cargar los usuarios, aplicar filtros, manejar la paginación y los permisos.
 */
export default async () => {
    // Obtiene una referencia al elemento tbody de la tabla donde se mostrarán los usuarios.
    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    // Obtiene una referencia al elemento de paginación.
    const pagination = document.querySelector(".pagination");
    // Obtiene una referencia al contenedor principal para mostrar/ocultar el spinner.
    const contenedor = document.getElementById("usuarios-contenedor");
    // Muestra el spinner de carga mientras se cargan los datos.
    showSpinner(contenedor);

    // Obtiene referencias a los botones y filtros.
    const btnFiltros = document.querySelector("#btnFiltros");
    const filtrosAvanzados = document.querySelector("#filtrosAvanzados");
    const btnNuevoUsuario = document.querySelector("#btnNuevoUsuario");

    // Agrega un event listener al botón de filtros para mostrar/ocultar los filtros avanzados.
    btnFiltros.addEventListener("click", () => {
        filtrosAvanzados.style.display =
            filtrosAvanzados.style.display === "none" ? "grid" : "none";
    });

    // Comprueba si el botón "Nuevo Usuario" existe y si el usuario tiene permiso para crear usuarios.
    if (btnNuevoUsuario && tienePermiso("users.store")) {
        // Si tiene permiso, agrega un event listener al botón para abrir el modal de creación de usuarios.
        btnNuevoUsuario.addEventListener("click", () => modalCrearUser())
    } else if (btnNuevoUsuario) {
        // Si no tiene permiso, oculta el botón.
        btnNuevoUsuario.style.display = "none";
    }

    /**
     * @description Objeto que contiene referencias a los campos de filtro.
     */
    const filtros = {
        nombre: document.querySelector("#filtroNombre"),
        encargado: document.querySelector("#filtroEncargado"),
        documento: document.querySelector("#filtroDocumento"),
        rol: document.querySelector("#filtroRol"),
        estado: document.querySelector("#filtroEstado"),
    };

    // Comprueba si el usuario tiene permiso para ver roles.
    if (tienePermiso("roles.index")) {
        // Obtiene los roles desde la API.
        const roles = await get("roles");
        // Itera sobre los roles y crea las opciones del filtro de roles.
        roles.data.forEach(r => {
            const option = document.createElement("option");
            option.value = r.name;
            option.textContent = r.name;
            filtros.rol.append(option);
        });
    }

    // Comprueba si el usuario tiene permiso para ver estados de usuario.
    if (tienePermiso("user-status.index")) {
        // Obtiene los estados de usuario desde la API.
        const estados = await get("EstadoUsuarios");
        // Itera sobre los estados y crea las opciones del filtro de estados.
        estados.data.forEach(e => {
            const option = document.createElement("option");
            option.value = e.name;
            option.textContent = e.status;
            filtros.estado.append(option);
        });
    }

    // Variable para almacenar la página actual.
    let currentPage = 1;

    /**
     * @description Función asíncrona para cargar los usuarios desde la API y mostrarlos en la tabla.
     * @param {number} [page=1] - El número de página a cargar.
     */
    const cargarUsuarios = async (page = 1) => {
        currentPage = page;

        try {
            // Crea un objeto URLSearchParams para agregar los parámetros de la consulta.
            const params = new URLSearchParams();
            // Agrega el parámetro de página.
            params.append("page", page);

            // Itera sobre los filtros y agrega los valores al objeto URLSearchParams.
            Object.entries(filtros).forEach(([key, input]) => {
                if (input && input.value.trim() !== "") {
                    params.append(key, input.value.trim());
                }
            });

            // Construye la URL de la API con los parámetros de la consulta.
            const url = `user/search?${params.toString()}`;
            // Obtiene los usuarios desde la API.
            const response = await get(url);
            console.log(response);

            // Limpia el contenido del tbody y de la paginación.
            tbody.innerHTML = "";
            pagination.innerHTML = "";

            // Si no se encontraron usuarios, muestra un mensaje indicándolo.
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

            // Obtiene los registros y la metada de la respuesta de la API.
            const records = response.data.records;
            const meta = response.data.meta;

            // Itera sobre los registros y crea las filas de la tabla.
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

                // Comprueba si el usuario tiene permiso para actualizar usuarios.
                if (tienePermiso("users.update")) {
                    const btnEditar = document.createElement("button");
                    btnEditar.classList.add("btn-editar");
                    btnEditar.textContent = "Editar";
                    btnEditar.addEventListener("click", () => editModalUsuario(item));
                    td7.append(btnEditar);
                }

                // Comprueba si el usuario tiene permiso para eliminar usuarios.
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

            // Crea los botones de paginación.
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
            // Si ocurre un error al cargar los usuarios, lo registra en la consola y muestra un mensaje de error en la tabla.
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
            // Oculta el spinner de carga.
            try {
                if (contenedor) {
                    hideSpinner(contenedor);
                }
            } catch (spinnerError) {
                console.error("Error al ocultar spinner:", spinnerError);
            }
        }
    };

    // Agrega event listeners a los filtros para recargar los usuarios cuando cambian.
    Object.values(filtros).forEach(input => {
        if (!input) return;
        input.addEventListener(
            input.tagName === "SELECT" ? "change" : "input",
            () => cargarUsuarios(1)
        );
    });

    // Carga los usuarios iniciales.
    await cargarUsuarios();
};
