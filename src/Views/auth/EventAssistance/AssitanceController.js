import "../../../Styles/Schedules/Schedules.css"; 
import { get } from "../../../Helpers/api.js";
import { abrirModalAsistencia } from "./viewAssistance/AssitancesModal.js";
import { abrirModalCrearAsistenciaEvento } from "./CreateAssistance/createAsistencias.js";


export default async () => {

    const tbody = document.getElementById("asistencias-tbody");
    const btnAsistenciaMasiva = document.getElementById("btnAsistenciaMasiva");
    const inputBuscar = document.querySelector(".input-filter");
    const btnBuscar = document.querySelector(".btn-outline");

    const cargarAsistencias = async (search = "") => {
        // Llamada a tu backend
        const response = await get(`asistencia/events${search}`);
        tbody.innerHTML = "";

        if (response && response.data && response.data.length > 0) {

            response.data.forEach((item, index) => {

                const tr = document.createElement("tr");

                // ===== # =====
                const td1 = document.createElement("td");
                td1.textContent = index + 1;

                // ===== EVENTO =====
                const td2 = document.createElement("td");
                td2.textContent = item.Event || "—";

                // ===== # FICHA =====
                const td3 = document.createElement("td");
                td3.textContent = item.Ficha || "—";

                // ===== FECHA Y HORA =====
                const td4 = document.createElement("td");
                td4.textContent = item.DateTime
                    ? new Date(item.DateTime).toLocaleString()
                    : "—";

                // ===== ACCIONES =====
                const td5 = document.createElement("td");

                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => {
                    abrirModalAsistencia(item, index);
                });

                const btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar");
                btnEliminar.textContent = "Eliminar";

                td5.appendChild(btnVer);
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
            td.textContent = "No hay asistencias registradas";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    };

    // ===== BOTÓN ASISTENCIA MASIVA =====
    btnAsistenciaMasiva.addEventListener("click", () => {
        abrirModalCrearAsistenciaEvento();
    });

    // ===== FILTROS =====
    btnBuscar.addEventListener("click", () => {
        cargarAsistencias(inputBuscar.value.trim());
    });

    inputBuscar.addEventListener("keyup", () => {
        cargarAsistencias(inputBuscar.value.trim());
    });

    // ===== CARGA INICIAL =====
    await cargarAsistencias();
};
