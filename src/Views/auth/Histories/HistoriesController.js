import "../../../Styles/Histories/Histories.css";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";

/**
 * @description This function initializes and populates the history log section of the application.
 * It fetches history data from an API, displays it, and handles pagination and filtering.
 */
export default async () => {

    // Get references to DOM elements
    const contenedor = document.getElementById("historial-lista"); // Main container for the history list
    const pagination = document.querySelector(".pagination"); // Container for pagination controls

    // Get input elements for filtering
    const inputs = document.querySelectorAll(".input-filter");
    const inputAccion  = inputs[0]; // Input for filtering by action
    const inputUsuario = inputs[1]; // Input for filtering by user
    const inputModulo  = inputs[2]; // Input for filtering by module

    const btnFiltrar = document.querySelector(".btn-outline"); // Button to apply filters

    let currentPage = 1; // Current page number

    /**
     * @description Fetches history data from the API and renders it in the container.
     * @param {number} [page=1] - The page number to fetch.
     */
    const cargarHistorial = async (page = 1) => {
        currentPage = page; // Update the current page

        // Construct URL parameters for filtering
        const params = new URLSearchParams({
            page,
            action: inputAccion.value.trim(),
            user: inputUsuario.value.trim(),
            module: inputModulo.value.trim(),
        }).toString();
    
        try {
            showSpinner(contenedor); // Show a loading spinner

            // Fetch data from the API
            const response = await get(`historial?${params}`);
            contenedor.innerHTML = ""; // Clear the container
            pagination.innerHTML = ""; // Clear the pagination

            const data = response.data; // Laravel paginator: Get the paginated data
            const records = data.data; // Get the actual history records

            // Check if there are any history records
            if (records?.length) {
                // Iterate over each record
                records.forEach(item => {
                    const divItem = document.createElement("div"); // Create a div for each history item
                    divItem.classList.add("historial-item");

                    const divAccion = document.createElement("div"); // Div for the action type
                    divAccion.classList.add("historial-accion");

                    const accion = item.action?.name?.toLowerCase() || "crear"; // Get the action name or default to "crear"
                    divAccion.classList.add(accion); // Add a class based on the action name
                    divAccion.textContent = item.action?.name || "Acción"; // Set the action text

                    const divInfo = document.createElement("div"); // Div for the history information
                    divInfo.classList.add("historial-info");

                    const strong = document.createElement("strong"); // Strong element for the user name
                    strong.textContent = item.user?.perfil?.name || "Usuario"; // Set the user name

                    const p = document.createElement("p"); // Paragraph for the description
                    p.innerHTML = item.description || "Sin descripción"; // Set the description

                    divInfo.append(strong, p); // Append user and description

                    const divFecha = document.createElement("div"); // Div for the date and time
                    divFecha.classList.add("historial-fecha");

                    const fecha = new Date(item.created_at); // Create a Date object
                    divFecha.innerHTML = `
                        <span>${fecha.toLocaleDateString()}</span>
                        <small>${fecha.toLocaleTimeString()}</small>
                    `; // Set the formatted date and time

                    divItem.append(divAccion, divInfo, divFecha); // Append all elements to the item div
                    contenedor.appendChild(divItem); // Add the item to the container
                });
            } else {
                // Display a message if there are no history records
                contenedor.innerHTML = `
                    <div class="historial-empty">
                        No hay registros en el historial
                    </div>
                `;
            }

            // 🔹 PAGINACIÓN
            const btnPrev = document.createElement("button"); // Button to go to the previous page
            btnPrev.textContent = "«";
            btnPrev.disabled = data.current_page === 1; // Disable if it's the first page
            btnPrev.onclick = () => cargarHistorial(data.current_page - 1); // Load the previous page
            pagination.appendChild(btnPrev);

            // Create buttons for each page
            for (let i = 1; i <= data.last_page; i++) {
                const btn = document.createElement("button"); // Button for each page number
                btn.textContent = i;
                if (i === data.current_page) btn.disabled = true; // Disable if it's the current page
                btn.onclick = () => cargarHistorial(i); // Load the corresponding page
                pagination.appendChild(btn);
            }

            const btnNext = document.createElement("button"); // Button to go to the next page
            btnNext.textContent = "»";
            btnNext.disabled = data.current_page === data.last_page; // Disable if it's the last page
            btnNext.onclick = () => cargarHistorial(data.current_page + 1); // Load the next page
            pagination.appendChild(btnNext);

        } catch (e) {
            console.error(e);
        } finally {
            hideSpinner(contenedor); // Hide the spinner after loading
        }
    };

    // Add event listeners to the filter button and inputs
    btnFiltrar.addEventListener("click", () => cargarHistorial(1)); // Load the first page when the filter button is clicked
    inputs.forEach(i => i.addEventListener("keyup", () => cargarHistorial(1))); // Load the first page when any input is changed

    await cargarHistorial(); // Load the initial history data
};
