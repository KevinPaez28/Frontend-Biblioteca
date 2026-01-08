// import "../../../Styles/Motivos/Motivos.css";
import { get } from "../../../Helpers/api.js";
import { abrirModalCrearMotivo } from "./CreateReason/CreateReason.js";
import { deleteShifts } from "./deleteReason/deleteReason.js";
import { editmodalreason } from "./EditReason/EditReason.js";
import { abrirModalReason } from "./viewReason/viewReason.js";

export default async () => {

    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    const btnNuevoMotivo = document.getElementById("btnNuevoMotivo");
    const inputBuscar = document.querySelector(".input-filter");
    const btnBuscar = document.querySelector(".btn-outline");

    btnNuevoMotivo.addEventListener("click", () => {
        abrirModalCrearMotivo();
    });

    const cargarMotivos = async (search = "") => {

        const motivos = await get(`motivos?search=${search}`);
        tbody.innerHTML = "";

        if (motivos && motivos.data && motivos.data.length > 0) {

            console.log(motivos);
            
            motivos.data.forEach((item, index) => {

                const tr = document.createElement("tr");

                // ===== # =====
                const td1 = document.createElement("td");
                td1.textContent = index + 1;

                // ===== NOMBRE =====
                const td2 = document.createElement("td");
                td2.textContent = item.name;

                // ===== DESCRIPCIÓN =====
                const td3 = document.createElement("td");
                // Limitamos la descripción a 50 caracteres
                const maxChars = 50;
                td3.textContent = item.description
                    ? (item.description.length > maxChars 
                        ? item.description.substring(0, maxChars) + "..." 
                        : item.description)
                    : "";

                // ===== ESTADO =====
                const td4 = document.createElement("td");
                const spanEstado = document.createElement("span");

                if (item.state_reason_id === "activo" || item.state_reason_id === 1) {
                    spanEstado.classList.add("badge-time");
                    spanEstado.textContent = "Activo";
                } else {
                    spanEstado.classList.add("badge-time");
                    spanEstado.textContent = "Inactivo";
                }

                td4.appendChild(spanEstado);

                // ===== ACCIONES =====
                const td5 = document.createElement("td");

                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => {
                    abrirModalReason(item, index);
                });

                const btnEditar = document.createElement("button");
                btnEditar.classList.add("btn-editar");
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener("click", () => {
                    editmodalreason(item, index);
                });
                
                const btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.addEventListener("click", () => {
                    deleteShifts(item)
                });
                
                td5.appendChild(btnVer);
                td5.appendChild(btnEditar);
                td5.appendChild(btnEliminar);

                // ===== APPEND FINAL =====
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);

                tbody.appendChild(tr);
            });

        } else {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 5;
            td.textContent = "No hay motivos registrados";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    };


    await cargarMotivos();
};
