import "../../../Styles/Schedules/Schedules.css";
import { get } from "../../../Helpers/api.js";
import { abrirModalFicha } from "./viewFichas/FichasModal.js";
import { editarmodalFicha } from "./editsFichas/editsfichas.js";
import { abrirModalCrearFicha } from "./CreateFichas/createFichas.js";
import { deleteFicha } from "./deleteFichas/deleteFichas.js";
import { tienePermiso } from "../../../helpers/auth.js";

/**
 * @description This is the main function to load and display the "fichas" (records).
 * It fetches data, renders it in a table, and handles user interactions
 * such as creating, editing, viewing, and deleting "fichas".
 */
export default async () => {
    // Get references to DOM elements
    const tbody = document.querySelector(".seccion-dashboard .table tbody"); // Table body where data will be inserted
    const btnNuevaFicha = document.getElementById("btnNuevaFicha"); // Button to open the modal for creating a new "ficha"
    const inputBuscar = document.querySelector(".input-filter"); // Input field for searching "fichas"
    const btnBuscar = document.querySelector(".btn-outline"); // Button to trigger the search

    // Check if the "Nueva Ficha" button exists and if the user has permission to create "fichas"
    if (btnNuevaFicha && tienePermiso("fichas.store")) {
        // If both conditions are true, add an event listener to the button
        btnNuevaFicha.addEventListener("click", () => {
            abrirModalCrearFicha(); // Open the modal to create a new "ficha"
        });
    } else if (btnNuevaFicha) {
        // If the button exists but the user doesn't have permission, hide the button
        btnNuevaFicha.style.display = "none";
    }

    /**
     * @description Function to load "fichas" data from the API and display it in the table.
     * @param {string} [search=""] - The search term to filter "fichas".
     */
    const cargarFichas = async (search = "") => {
        try {
            // Fetch "fichas" data from the API with an optional search parameter
            const response = await get(`ficha?search=${search}`);
            tbody.innerHTML = ""; // Clear the table body before adding new data

            // Check if the response contains data and if there are any "fichas"
            if (response && response.data && response.data.length > 0) {
                // Iterate over each "ficha" in the data
                response.data.forEach((item, index) => {
                    const tr = document.createElement("tr"); // Create a new table row for each "ficha"

                    const td1 = document.createElement("td"); // Create a table data cell for the index
                    td1.textContent = index + 1; // Set the index as the text content of the cell

                    const td2 = document.createElement("td"); // Create a table data cell for the "ficha" number
                    td2.textContent = item.ficha; // Set the "ficha" number as the text content of the cell

                    const td3 = document.createElement("td"); // Create a table data cell for the training program
                    td3.textContent = item.programa?.training_program || "—"; // Set the training program name as the text content of the cell, or "—" if it doesn't exist

                    const td4 = document.createElement("td"); // Create a table data cell for the action buttons

                    const btnVer = document.createElement("button"); // Create a button to view the "ficha"
                    btnVer.classList.add("btn-ver"); // Add a class for styling
                    btnVer.textContent = "Ver"; // Set the button text
                    btnVer.addEventListener("click", () => {
                        // Add an event listener to open the "ficha" modal
                        abrirModalFicha(item, index); // Open the modal to view the "ficha" data
                    });
                    td4.appendChild(btnVer); // Add the view button to the cell

                    // Check if the user has permission to update "fichas"
                    if (tienePermiso("fichas.update")) {
                        const btnEditar = document.createElement("button"); // Create a button to edit the "ficha"
                        btnEditar.classList.add("btn-editar"); // Add a class for styling
                        btnEditar.textContent = "Editar"; // Set the button text
                        btnEditar.addEventListener("click", () => {
                            // Add an event listener to open the "ficha" edit modal
                            editarmodalFicha(item, index); // Open the modal to edit the "ficha"
                        });
                        td4.appendChild(btnEditar); // Add the edit button to the cell
                    }

                    // Check if the user has permission to delete "fichas"
                    if (tienePermiso("fichas.destroy")) {
                        const btnEliminar = document.createElement("button"); // Create a button to delete the "ficha"
                        btnEliminar.classList.add("btn-eliminar"); // Add a class for styling
                        btnEliminar.textContent = "Eliminar"; // Set the button text
                        btnEliminar.addEventListener("click", () => {
                            // Add an event listener to delete the "ficha"
                            deleteFicha(item); // Delete the "ficha"
                        });
                        td4.appendChild(btnEliminar); // Add the delete button to the cell
                    }

                    tr.appendChild(td1); // Add the index cell to the row
                    tr.appendChild(td2); // Add the "ficha" number cell to the row
                    tr.appendChild(td3); // Add the training program cell to the row
                    tr.appendChild(td4); // Add the action buttons cell to the row

                    tbody.appendChild(tr); // Add the row to the table body
                });
            } else {
                // If there are no "fichas" registered, display a message
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 4;
                td.textContent = "No hay fichas registradas";
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        } catch (error) {
            // If there is an error loading "fichas", display an error message
            console.error("Error cargando fichas:", error);
            tbody.innerHTML = "";
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 4;
            td.textContent = "Error al cargar fichas.";
            td.style.textAlign = "center";
            td.style.color = "red";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    };

    // Add an event listener to the search button to trigger the search
    btnBuscar.addEventListener("click", () => {
        cargarFichas(inputBuscar.value.trim()); // Load "fichas" based on the search input
    });

    // Add an event listener to the search input to trigger the search on keyup
    inputBuscar.addEventListener("keyup", () => {
        cargarFichas(inputBuscar.value.trim()); // Load "fichas" based on the search input
    });

    await cargarFichas(); // Load all "fichas" when the page loads
};
