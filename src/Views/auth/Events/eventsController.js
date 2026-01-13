// import "../../../Styles/Eventos/Eventos.css";
import { get } from "../../../Helpers/api.js";
import { abrirModalCrearEvento } from "./CreateEvents/createController.js";
import { deleteEvento } from "./deleteEvents/eventsController.js";
import { editModalEvento } from "./EditEvents/editController.js";
import { abrirModalEvento } from "./viewevents/viewController.js";

export default async () => {

    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    const btnNuevoEvento = document.querySelector("#btnnuevoevento");

    btnNuevoEvento.addEventListener("click", () => {
        abrirModalCrearEvento();
    });

    const cargarEventos = async (search = "") => {

        const eventos = await get(`eventos?search=${search}`);
        tbody.innerHTML = "";

        if (eventos && eventos.data && eventos.data.length > 0) {

            console.log(eventos);

            eventos.data.forEach((item, index) => {

                const tr = document.createElement("tr");

                // ===== # =====
                const td1 = document.createElement("td");
                td1.textContent = index + 1;

                // ===== NOMBRE =====
                const td2 = document.createElement("td");
                td2.textContent = item.name || "—";

                // ===== ENCARGADO =====
                const td3 = document.createElement("td");
                td3.textContent = item.mandated || "—";

                // ===== SALA =====
                const td4 = document.createElement("td");
                td4.textContent = item.room?.name || "—";

                // ===== FECHA =====
                const td5 = document.createElement("td");
                const spanFecha = document.createElement("span");
                spanFecha.classList.add("badge-time");
                spanFecha.textContent = item.date || "—";
                td5.appendChild(spanFecha);

                // ===== ESTADO =====
                const td6 = document.createElement("td");
                const spanEstado = document.createElement("span");
                spanEstado.classList.add("badge-time");
                spanEstado.textContent = item.state?.name || "—";
                td6.appendChild(spanEstado);

                // ===== ACCIONES =====
                const td7 = document.createElement("td");

                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => {
                    abrirModalEvento(item);
                });

                const btnEditar = document.createElement("button");
                btnEditar.classList.add("btn-editar");
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener("click", () => {
                    editModalEvento(item);
                });

                const btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.addEventListener("click", () => {
                    deleteEvento(item);
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

    await cargarEventos();
};
