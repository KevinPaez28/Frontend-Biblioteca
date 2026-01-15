import "../../../Styles/Schedules/Schedules.css"; 
import { get } from "../../../Helpers/api.js";
import { abrirModalPrograma } from "./viewPrograms/FichasModal.js";
// import { abrirModalPrograma } from "./viewPrograms/ProgramModal.js";
import { editarModalPrograma } from "./editsPrograms/editsfichas.js";
import { abrirModalCrearPrograma } from "./CreatePrograms/createPrograms.js";
// import { abrirModalCrearPrograma } from "./CreatePrograms/createProgram.js";

export default async () => {

    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    const btnNuevoPrograma = document.getElementById("btnNuevoPrograma");
    const inputBuscar = document.querySelector(".input-filter");
    const btnBuscar = document.querySelector(".btn-outline");

    const cargarProgramas = async (search = "") => {

        const response = await get(`programa?search=${search}`);
        tbody.innerHTML = "";

        if (response && response.data && response.data.length > 0) {

            response.data.forEach((item, index) => {

                const tr = document.createElement("tr");

                // ===== # =====
                const td1 = document.createElement("td");
                td1.textContent = index + 1;

                // ===== PROGRAMA =====
                const td2 = document.createElement("td");
                td2.textContent = item.training_program || "—";

                // ===== ACCIONES =====
                const td3 = document.createElement("td");

                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => {
                    abrirModalPrograma(item, index);
                });

                const btnEditar = document.createElement("button");
                btnEditar.classList.add("btn-editar");
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener("click", () => {
                    editarModalPrograma(item, index);
                });

                const btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar");
                btnEliminar.textContent = "Eliminar";

                td3.appendChild(btnVer);
                td3.appendChild(btnEditar);
                td3.appendChild(btnEliminar);

                // ===== APPEND FINAL =====
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                tbody.appendChild(tr);
            });

        } else {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 3; // #, Programa, Acciones
            td.textContent = "No hay programas registrados";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    };

    btnNuevoPrograma.addEventListener("click", () => {
        abrirModalCrearPrograma();
    });

    btnBuscar.addEventListener("click", () => {
        cargarProgramas(inputBuscar.value.trim());
    });

    inputBuscar.addEventListener("keyup", () => {
        cargarProgramas(inputBuscar.value.trim());
    });

    await cargarProgramas();
};
