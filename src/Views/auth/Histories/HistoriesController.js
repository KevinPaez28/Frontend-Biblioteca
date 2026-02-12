import "../../../Styles/Histories/Histories.css";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";

/**
 * @description Esta función inicializa y popula la sección del registro de historial de la aplicación.
 * Obtiene datos del historial desde una API, los muestra y maneja la paginación y el filtrado.
 */
export default async () => {

    // Obtener referencias a los elementos del DOM
    const contenedor = document.getElementById("historial-lista"); // Contenedor principal para la lista del historial
    const pagination = document.querySelector(".pagination"); // Contenedor para los controles de paginación

    // Obtener elementos de entrada para el filtrado
    const inputs = document.querySelectorAll(".input-filter");
    const inputAccion  = inputs[0]; // Input para filtrar por acción
    const inputUsuario = inputs[1]; // Input para filtrar por usuario
    const inputModulo  = inputs[2]; // Input para filtrar por módulo

    const btnFiltrar = document.querySelector(".btn-outline"); // Botón para aplicar los filtros

    let currentPage = 1; // Número de página actual

    /**
     * @description Obtiene los datos del historial desde la API y los renderiza en el contenedor.
     * @param {number} [page=1] - El número de página a obtener.
     */
    const cargarHistorial = async (page = 1) => {
        currentPage = page; // Actualizar la página actual

        // Construir los parámetros de la URL para el filtrado
        const params = new URLSearchParams({
            page,
            action: inputAccion.value.trim(),
            user: inputUsuario.value.trim(),
            module: inputModulo.value.trim(),
        }).toString();
    
        try {
            showSpinner(contenedor); // Mostrar un spinner de carga

            // Obtener datos desde la API
            const response = await get(`historial?${params}`);
            contenedor.innerHTML = ""; // Limpiar el contenedor
            pagination.innerHTML = ""; // Limpiar la paginación

            const data = response.data; // Paginador de Laravel: Obtener los datos paginados
            const records = data.data; // Obtener los registros de historial actuales

            // Comprobar si hay registros de historial
            if (records?.length) {
                // Iterar sobre cada registro
                records.forEach(item => {
                    const divItem = document.createElement("div"); // Crear un div para cada elemento del historial
                    divItem.classList.add("historial-item");

                    const divAccion = document.createElement("div"); // Div para el tipo de acción
                    divAccion.classList.add("historial-accion");

                    const accion = item.action?.name?.toLowerCase() || "crear"; // Obtener el nombre de la acción o establecer el valor predeterminado a "crear"
                    divAccion.classList.add(accion); // Agregar una clase basada en el nombre de la acción
                    divAccion.textContent = item.action?.name || "Acción"; // Establecer el texto de la acción

                    const divInfo = document.createElement("div"); // Div para la información del historial
                    divInfo.classList.add("historial-info");

                    const strong = document.createElement("strong"); // Elemento strong para el nombre del usuario
                    strong.textContent = item.user?.perfil?.name || "Usuario"; // Establecer el nombre del usuario

                    const p = document.createElement("p"); // Párrafo para la descripción
                    p.innerHTML = item.description || "Sin descripción"; // Establecer la descripción

                    divInfo.append(strong, p); // Añadir usuario y descripción

                    const divFecha = document.createElement("div"); // Div para la fecha y la hora
                    divFecha.classList.add("historial-fecha");

                    const fecha = new Date(item.created_at); // Crear un objeto de fecha
                    divFecha.innerHTML = `
                        <span>${fecha.toLocaleDateString()}</span>
                        <small>${fecha.toLocaleTimeString()}</small>
                    `; // Establecer la fecha y la hora formateadas

                    divItem.append(divAccion, divInfo, divFecha); // Añadir todos los elementos al div del elemento
                    contenedor.appendChild(divItem); // Agregar el elemento al contenedor
                });
            } else {
                // Mostrar un mensaje si no hay registros de historial
                contenedor.innerHTML = `
                    <div class="historial-empty">
                        No hay registros en el historial
                    </div>
                `;
            }

            // 🔹 PAGINACIÓN
            const btnPrev = document.createElement("button"); // Botón para ir a la página anterior
            btnPrev.textContent = "«";
            btnPrev.disabled = data.current_page === 1; // Deshabilitar si es la primera página
            btnPrev.onclick = () => cargarHistorial(data.current_page - 1); // Cargar la página anterior
            pagination.appendChild(btnPrev);

            // Crear botones para cada página
            for (let i = 1; i <= data.last_page; i++) {
                const btn = document.createElement("button"); // Botón para cada número de página
                btn.textContent = i;
                if (i === data.current_page) btn.disabled = true; // Deshabilitar si es la página actual
                btn.onclick = () => cargarHistorial(i); // Cargar la página correspondiente
                pagination.appendChild(btn);
            }

            const btnNext = document.createElement("button"); // Botón para ir a la página siguiente
            btnNext.textContent = "»";
            btnNext.disabled = data.current_page === data.last_page; // Deshabilitar si es la última página
            btnNext.onclick = () => cargarHistorial(data.current_page + 1); // Cargar la página siguiente
            pagination.appendChild(btnNext);

        } catch (e) {
            console.error(e);
        } finally {
            hideSpinner(contenedor); // Ocultar el spinner después de cargar
        }
    };

    // Agregar event listeners al botón de filtro y a las entradas
    btnFiltrar.addEventListener("click", () => cargarHistorial(1)); // Cargar la primera página cuando se hace clic en el botón de filtro
    inputs.forEach(i => i.addEventListener("keyup", () => cargarHistorial(1))); // Cargar la primera página cuando se cambia cualquier entrada

    await cargarHistorial(); // Cargar los datos iniciales del historial
};
