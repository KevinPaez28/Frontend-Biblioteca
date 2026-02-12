import "../../../Styles/Schedules/Schedules.css";
import { get } from "../../../Helpers/api.js";
import { abrirModalPrograma } from "./viewPrograms/FichasModal.js";
import { editarModalPrograma } from "./editsPrograms/editsfichas.js";
import { abrirModalCrearPrograma } from "./CreatePrograms/createPrograms.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { deletePrograma } from "./deletePrograms/deleteProgram.js";

/**
 * @description This function is the main entry point for the programs management page.
 * It fetches the program data, renders it in a table, and handles user interactions such as creating, editing, viewing, and deleting programs.
 */
export default async () => {
    // Get references to DOM elements
    const tbody = document.querySelector(".seccion-dashboard .table tbody"); // Table body where program data will be inserted
    const btnNuevoPrograma = document.getElementById("btnNuevoPrograma"); // Button to open the modal for creating a new program
    const inputBuscar = document.querySelector(".input-filter"); // Input field for searching programs
    const btnBuscar = document.querySelector(".btn-outline"); // Button to trigger the search

    // ===== CONTROL DE BOTÓN NUEVO PROGRAMA =====
    // Check if the "Nuevo Programa" button exists
    if (btnNuevoPrograma) {
        // Check if the user has permission to create programs
        if (tienePermiso("programs.store")) {
            // If both conditions are true, add an event listener to the button
            btnNuevoPrograma.addEventListener("click", () => {
                abrirModalCrearPrograma(); // Open the modal to create a new program
            });
        } else {
            // If the user doesn't have permission, hide the button
            btnNuevoPrograma.style.display = "none";
        }
    }

    /**
     * @description Function to load program data from the API and display it in the table.
     * @param {string} [search=""] - The search term to filter programs.
     */
    const cargarProgramas = async (search = "") => {
        try {
            // Fetch program data from the API with an optional search parameter
            const response = await get(`programa?search=${search}`);
            tbody.innerHTML = ""; // Clear the table body before adding new data

            // Check if the response contains data and if there are any programs
            if (response && response.data && response.data.length > 0) {
                // Iterate over each program in the data
                response.data.forEach((item, index) => {
                    const tr = document.createElement("tr"); // Create a new table row for each program

                    // ===== # =====
                    const td1 = document.createElement("td"); // Create a table data cell for the index
                    td1.textContent = index + 1; // Set the index as the text content of the cell

                    // ===== PROGRAMA =====
                    const td2 = document.createElement("td"); // Create a table data cell for the program name
                    td2.textContent = item.training_program || "—"; // Set the program name as the text content of the cell, or "—" if it doesn't exist

                    // ===== ACCIONES =====
                    const td3 = document.createElement("td"); // Create a table data cell for the action buttons

                    // Botón VER siempre visible
                    const btnVer = document.createElement("button"); // Create a button to view the program
                    btnVer.classList.add("btn-ver"); // Add a class for styling
                    btnVer.textContent = "Ver"; // Set the button text
                    btnVer.addEventListener("click", () => {
                        abrirModalPrograma(item, index); // Open the modal to view the program data
                    });
                    td3.appendChild(btnVer); // Add the view button to the cell

                    // Botón EDITAR condicional
                    // Check if the user has permission to update programs
                    if (tienePermiso("programs.update")) {
                        const btnEditar = document.createElement("button"); // Create a button to edit the program
                        btnEditar.classList.add("btn-editar"); // Add a class for styling
                        btnEditar.textContent = "Editar"; // Set the button text
                        btnEditar.addEventListener("click", () => {
                            editarModalPrograma(item, index); // Open the modal to edit the program
                        });
                        td3.appendChild(btnEditar); // Add the edit button to the cell
                    }

                    // Botón ELIMINAR condicional
                    if (tienePermiso("programs.destroy")) {
                        const btnEliminar = document.createElement("button");
                        btnEliminar.classList.add("btn-eliminar");
                        btnEliminar.textContent = "Eliminar";
                        btnEliminar.addEventListener("click", () => {
                            deletePrograma(item, index);
                        });
                        td3.appendChild(btnEliminar);
                    }

                    // ===== APPEND FINAL =====
                    tr.appendChild(td1); // Add the index cell to the row
                    tr.appendChild(td2); // Add the program name cell to the row
                    tr.appendChild(td3); // Add the action buttons cell to the row

                    tbody.appendChild(tr); // Add the row to the table body
                });
            } else {
                // If there are no programs registered, display a message
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 3;
                td.textContent = "No hay programas registrados";
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        } catch (error) {
            // If there is an error loading programs, display an error message
            console.error("Error cargando programas:", error);
            tbody.innerHTML = "";
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 3;
            td.textContent = "Error al cargar programas.";
            td.style.textAlign = "center";
            td.style.color = "red";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    };

    // Add event listeners to the search button and input field
    if (btnBuscar && inputBuscar) {
        btnBuscar.addEventListener("click", () => {
            cargarProgramas(inputBuscar.value.trim()); // Load programs based on the search input
        });

        inputBuscar.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                cargarProgramas(inputBuscar.value.trim()); // Load programs when Enter key is pressed in the search input
            }
        });
    }

    await cargarProgramas(); // Load all programs when the page loads
};
