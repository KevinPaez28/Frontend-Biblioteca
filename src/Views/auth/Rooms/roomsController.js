import { get, patch } from "../../../Helpers/api.js";
import { abrirModalCrearArea } from "./createrooms/createrooms.js";
import { editmodalreason } from "./EditRooms/editrooms.js";
import { deleteAreas } from "./DeleteRooms/deleterooms.js";
import { abrirModalReason } from "./viewRooms/viewrooms.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";

/**
 * @description Función principal asíncrona que se encarga de cargar y mostrar la información de las salas en el panel de administración.
 */
export default async () => {
    // Obtiene una referencia al elemento tbody de la tabla donde se mostrarán las salas.
    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    // Obtiene una referencia al contenedor principal del panel de administración.
    const contenedor = document.querySelector(".seccion-dashboard");
    // Obtiene una referencia al botón para crear una nueva sala.
    const btnNuevo = document.querySelector("#btnnuevorooms");

    /**
     * @description Objeto que contiene referencias a los campos de filtro.
     */
    const filtros = {
        nombre: document.querySelector("input.input-filter"),
        estado: document.querySelector("#filter"),
    };

    // Comprueba si el botón "btnNuevo" existe en el DOM.
    if (btnNuevo) {
        // Comprueba si el usuario tiene permiso para crear salas.
        if (tienePermiso("rooms.store")) {
            // Si el usuario tiene permiso, agrega un event listener al botón para abrir el modal de creación de salas.
            btnNuevo.addEventListener("click", () => {
                abrirModalCrearArea();
            });
        } else {
            // Si el usuario no tiene permiso, oculta el botón.
            btnNuevo.style.display = "none";
        }
    }

    /**
     * @description Función asíncrona para cargar las opciones del select de estados desde la API.
     */
    const cargarSelects = async () => {
        // Obtiene los estados de las salas desde la API.
        const estados = await get("estadosalas");

        // Comprueba si la respuesta de la API contiene datos y si hay al menos un estado.
        if (estados?.data?.length) {
            // Itera sobre cada estado obtenido de la API.
            estados.data.forEach(e => {
                // Crea un nuevo elemento option para cada estado.
                const option = document.createElement("option");
                // Establece el valor del atributo "value" del option con el ID del estado.
                option.value = e.id;
                // Establece el contenido de texto del option con el nombre del estado.
                option.textContent = e.name;
                // Agrega el option al select de estados.
                filtros.estado.appendChild(option);
            });
        }
    };

    /**
     * @description Función asíncrona para cargar las salas desde la API y mostrarlas en la tabla.
     */
    const cargarSalas = async () => {
        try {
            // Muestra el spinner de carga.
            showSpinner(contenedor);

            // Crea un array para almacenar los parámetros de la consulta.
            const query = [];

            // Itera sobre cada propiedad del objeto "filtros".
            for (const key in filtros) {
                // Obtiene el elemento del filtro actual.
                const input = filtros[key];
                // Comprueba si el elemento del filtro existe, tiene un valor y si el valor no está vacío después de eliminar los espacios en blanco.
                if (input && input.value && input.value.trim() !== "") {
                    // Agrega el parámetro de la consulta al array "query".
                    query.push(`${key}=${encodeURIComponent(input.value)}`);
                }
            }

            // Construye la URL de la API en función de si hay parámetros de consulta o no.
            const url = query.length ? `salas?${query.join("&")}` : "salas";
            // Obtiene las salas desde la API.
            const salas = await get(url);

            // Limpia el contenido del tbody antes de agregar las nuevas salas.
            tbody.innerHTML = "";

            // Comprueba si la respuesta de la API contiene datos y si hay al menos una sala.
            if (salas?.data?.length) {
                // Itera sobre cada sala obtenida de la API.
                salas.data.forEach((item, index) => {
                    // Crea una nueva fila (tr) para cada sala.
                    const tr = document.createElement("tr");

                    // Crea una celda (td) para el número de índice.
                    const td1 = document.createElement("td");
                    // Establece el contenido de texto de la celda con el número de índice (index + 1).
                    td1.textContent = index + 1;

                    // Crea una celda (td) para el nombre de la sala.
                    const td2 = document.createElement("td");
                    // Establece el contenido de texto de la celda con el nombre de la sala o un guión si no hay nombre.
                    td2.textContent = item.name || "—";

                    // Crea una celda (td) para la descripción de la sala.
                    const td3 = document.createElement("td");
                    // Comprueba si la sala tiene una descripción.
                    if (item.description) {
                        // Si la descripción tiene más de 50 caracteres, la trunca y agrega puntos suspensivos.
                        td3.textContent =
                            item.description.length > 50
                                ? item.description.substring(0, 50) + "..."
                                : item.description;
                    } else {
                        // Si la sala no tiene descripción, establece el contenido de texto de la celda con un guión.
                        td3.textContent = "—";
                    }

                    // Crea una celda (td) para el estado de la sala.
                    const td4 = document.createElement("td");
                    // Crea un elemento span para mostrar el estado de la sala.
                    const spanEstado = document.createElement("span");
                    // Establece la clase del elemento span para aplicar estilos visuales.
                    spanEstado.className = "badge-time";
                    // Establece el contenido de texto del elemento span con el nombre del estado de la sala o un guión si no hay estado.
                    spanEstado.textContent = item.state?.name || "—";
                    // Agrega el elemento span a la celda.
                    td4.appendChild(spanEstado);

                    // Crea una celda (td) para las acciones (botones).
                    const td5 = document.createElement("td");

                    // Crea un botón para "Ver" la sala.
                    const btnVer = document.createElement("button");
                    // Establece la clase del botón para aplicar estilos visuales.
                    btnVer.className = "btn-ver";
                    // Establece el contenido de texto del botón.
                    btnVer.textContent = "Ver";
                    // Asigna la función para abrir el modal de visualización de la sala al evento onclick del botón.
                    btnVer.onclick = () => abrirModalReason(item, index);
                    // Agrega el botón a la celda.
                    td5.append(btnVer);

                    // Comprueba si el usuario tiene permiso para actualizar salas.
                    if (tienePermiso("rooms.update")) {
                        // Crea un botón para "Editar" la sala.
                        const btnEditar = document.createElement("button");
                        // Establece la clase del botón para aplicar estilos visuales.
                        btnEditar.className = "btn-editar";
                        // Establece el contenido de texto del botón.
                        btnEditar.textContent = "Editar";
                        // Asigna la función para abrir el modal de edición de la sala al evento onclick del botón.
                        btnEditar.onclick = () => editmodalreason(item, index);
                        // Agrega el botón a la celda.
                        td5.append(btnEditar);
                    }

                    // Comprueba si el usuario tiene permiso para eliminar salas.
                    if (tienePermiso("rooms.destroy")) {
                        // Crea un botón para "Eliminar" la sala.
                        const btnEliminar = document.createElement("button");
                        // Establece la clase del botón para aplicar estilos visuales.
                        btnEliminar.className = "btn-eliminar";
                        // Establece el contenido de texto del botón.
                        btnEliminar.textContent = "Eliminar";
                        // Asigna la función para eliminar la sala al evento onclick del botón.
                        btnEliminar.onclick = () => deleteAreas(item);
                        // Agrega el botón a la celda.
                        td5.append(btnEliminar);
                    }

                    // Agrega todas las celdas a la fila.
                    tr.append(td1, td2, td3, td4, td5);
                    // Agrega la fila al tbody.
                    tbody.appendChild(tr);
                });
            } else {
                // Si no se encontraron resultados, muestra un mensaje indicando que no se encontraron resultados.
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 5;
                td.style.textAlign = "center";
                td.textContent = "No se encontraron resultados";

                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        } catch (error) {
            // Registra cualquier error que ocurra durante la carga de las salas.
            console.error(" Error cargando salas:", error);
            // Limpia el contenido del tbody en caso de error.
            tbody.innerHTML = "";
            // Muestra un mensaje de error en la tabla.
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 5;
            td.style.textAlign = "center";
            td.style.color = "red";
            td.textContent = "Error al cargar salas.";
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

    // Agrega un event listener a cada elemento de filtro.
    Object.values(filtros).forEach(input => {
        // Comprueba si el elemento del filtro existe.
        if (!input) return;

        // Si el elemento es un select, agrega un event listener al evento "change".
        if (input.tagName === "SELECT") {
            input.addEventListener("change", cargarSalas);
        } else {
            // Si el elemento es un input, agrega un event listener al evento "input".
            input.addEventListener("input", cargarSalas);
        }
    });

    // Carga las opciones del select de estados.
    await cargarSelects();
    // Carga las salas.
    cargarSalas();
};
