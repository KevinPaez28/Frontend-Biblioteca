import { get } from "../../../helpers/api.js";
import { abrirModalCrearMotivo } from "./CreateReason/CreateReason.js";
import { deleteShifts } from "./deleteReason/deleteReason.js";
import { editmodalreason } from "./EditReason/EditReason.js";
import { abrirModalReason } from "./viewReason/viewReason.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { showSpinner, hideSpinner } from "../../../helpers/spinner.js";

/**
 * @description Función principal que gestiona la visualización y carga de motivos en la sección de administración.
 */
export default async () => {
    // Obtiene una referencia al elemento tbody de la tabla donde se mostrarán los motivos.
    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    // Obtiene una referencia al contenedor principal para mostrar/ocultar el spinner.
    const contenedor = document.querySelector(".seccion-dashboard");
    // Obtiene una referencia al botón para crear un nuevo motivo.
    const btnNuevoMotivo = document.querySelector("#btnNuevoMotivo");
    // Obtiene una referencia al campo de entrada para buscar motivos.
    const inputBuscar = document.querySelector(".input-filter");
    // Obtiene una referencia al botón de buscar.
    const btnBuscar = document.querySelector(".btn-outline");

    // 🔹 BOTÓN NUEVO MOTIVO
    // Comprueba si el botón "Nuevo Motivo" existe en el DOM.
    if (btnNuevoMotivo) {
        // Limpia cualquier evento onclick anterior para evitar duplicaciones.
        btnNuevoMotivo.onclick = null;

        // Comprueba si el usuario tiene permiso para crear motivos.
        if (tienePermiso("reasons.store")) {
            // Si tiene permiso, asigna la función para abrir el modal de creación al evento onclick del botón.
            btnNuevoMotivo.onclick = () => {
                abrirModalCrearMotivo();
            };
        } else {
            // Si no tiene permiso, oculta el botón.
            btnNuevoMotivo.style.display = "none";
        }
    }

    /**
     * @description Función asíncrona para cargar los motivos desde la API y mostrarlos en la tabla.
     * @param {string} [search=""] - El término de búsqueda para filtrar los motivos.
     */
    const cargarMotivos = async (search = "") => {
        try {
            // Muestra el spinner de carga.
            showSpinner(contenedor);

            // Obtiene los motivos desde la API utilizando el término de búsqueda proporcionado.
            const motivos = await get(`motivos?search=${search}`);
            // Limpia el contenido del tbody antes de agregar los nuevos motivos.
            tbody.innerHTML = "";

            // Comprueba si se obtuvieron motivos y si la respuesta contiene datos y si hay al menos un motivo.
            if (motivos && motivos.data && motivos.data.length > 0) {
                // Itera sobre cada motivo obtenido de la API.
                motivos.data.forEach((item, index) => {
                    // Crea una nueva fila (tr) para cada motivo.
                    const tr = document.createElement("tr");

                    // Crea una celda (td) para el número de índice.
                    const td1 = document.createElement("td");
                    // Establece el contenido de texto de la celda con el número de índice (index + 1).
                    td1.textContent = index + 1;

                    // Crea una celda (td) para el nombre del motivo.
                    const td2 = document.createElement("td");
                    // Establece el contenido de texto de la celda con el nombre del motivo.
                    td2.textContent = item.name;

                    // Crea una celda (td) para la descripción del motivo.
                    const td3 = document.createElement("td");
                    // Define la cantidad máxima de caracteres para mostrar en la descripción.
                    const maxChars = 50;
                    // Establece el contenido de texto de la celda con la descripción del motivo, truncando si es necesario.
                    td3.textContent = item.description
                        ? (item.description.length > maxChars
                            ? item.description.substring(0, maxChars) + "..."
                            : item.description)
                        : "";

                    // Crea una celda (td) para el estado del motivo.
                    const td4 = document.createElement("td");
                    // Crea un elemento span para mostrar el estado.
                    const spanEstado = document.createElement("span");
                    // Agrega una clase CSS para aplicar estilos visuales al span.
                    spanEstado.classList.add("badge-time");
                    // Establece el contenido de texto del span con el nombre del estado del motivo.
                    spanEstado.textContent = item.state.name;
                    // Agrega el span al td.
                    td4.appendChild(spanEstado);

                    // Crea una celda (td) para las acciones (botones).
                    const td5 = document.createElement("td");

                    // Crea un botón para "Ver" el motivo.
                    const btnVer = document.createElement("button");
                    // Agrega una clase CSS para aplicar estilos visuales al botón.
                    btnVer.classList.add("btn-ver");
                    // Establece el contenido de texto del botón.
                    btnVer.textContent = "Ver";
                    // Asigna la función para abrir el modal de visualización al evento onclick del botón.
                    btnVer.onclick = () => abrirModalReason(item, index);
                    // Agrega el botón al td.
                    td5.appendChild(btnVer);

                    // Comprueba si el usuario tiene permiso para actualizar motivos.
                    if (tienePermiso("reasons.update")) {
                        // Crea un botón para "Editar" el motivo.
                        const btnEditar = document.createElement("button");
                        // Agrega una clase CSS para aplicar estilos visuales al botón.
                        btnEditar.classList.add("btn-editar");
                        // Establece el contenido de texto del botón.
                        btnEditar.textContent = "Editar";
                        // Asigna la función para abrir el modal de edición al evento onclick del botón.
                        btnEditar.onclick = () => editmodalreason(item, index);
                        // Agrega el botón al td.
                        td5.appendChild(btnEditar);
                    }

                    // Comprueba si el usuario tiene permiso para eliminar motivos.
                    if (tienePermiso("reasons.destroy")) {
                        // Crea un botón para "Eliminar" el motivo.
                        const btnEliminar = document.createElement("button");
                        // Agrega una clase CSS para aplicar estilos visuales al botón.
                        btnEliminar.classList.add("btn-eliminar");
                        // Establece el contenido de texto del botón.
                        btnEliminar.textContent = "Eliminar";
                        // Asigna la función para eliminar el motivo al evento onclick del botón.
                        btnEliminar.onclick = () => deleteShifts(item);
                        // Agrega el botón al td.
                        td5.appendChild(btnEliminar);
                    }

                    // Agrega todas las celdas a la fila.
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);

                    // Agrega la fila al tbody.
                    tbody.appendChild(tr);
                });
            } else {
                // Si no se encontraron motivos, muestra un mensaje indicando que no hay motivos registrados.
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 5;
                td.textContent = "No hay motivos registrados";
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        } catch (error) {
            // Si ocurre un error durante la carga de motivos, registra el error en la consola.
            console.error("Error cargando motivos:", error);
            // Limpia el contenido del tbody para evitar mostrar datos incorrectos.
            tbody.innerHTML = "";
            // Muestra un mensaje de error en la tabla.
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 5;
            td.textContent = "Error al cargar motivos.";
            td.style.textAlign = "center";
            td.style.color = "red";
            tr.appendChild(td);
            tbody.appendChild(tr);
        } finally {
            // Oculta el spinner de carga, independientemente de si la carga fue exitosa o no.
            if (contenedor) hideSpinner(contenedor);
        }
    };

    // 🔹 FILTROS (SIN DUPLICAR EVENTOS)
    // Comprueba si los elementos btnBuscar y inputBuscar existen en el DOM.
    if (btnBuscar && inputBuscar) {
        // Asigna la función para cargar los motivos según el término de búsqueda al evento onclick del botón de buscar.
        btnBuscar.onclick = () => {
            cargarMotivos(inputBuscar.value.trim());
        };

        // Asigna la función para cargar los motivos según el término de búsqueda al evento onkeyup del campo de entrada de búsqueda.
        inputBuscar.onkeyup = (e) => {
            // Comprueba si la tecla presionada es la tecla "Enter".
            if (e.key === "Enter") {
                cargarMotivos(inputBuscar.value.trim());
            }
        };
    }

    // Llama a la función para cargar los motivos al cargar la página.
    await cargarMotivos();
};
