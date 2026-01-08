import "../../../Styles/Schedules/Schedules.css";
import { get } from "../../../Helpers/api.js";
import { abrirModalHorario } from "./viewSchedules/SchedulesModal.js";
import { editarmodalHorario } from "./editschedules/editschedules.js";
import { abrirModalCrearHorario } from "./Createschedules/createSchedules.js";

export default async () => {

    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    const btnNuevoHorario = document.getElementById("btnNuevoHorario");
    const inputBuscar = document.querySelector(".input-filter");
    const btnBuscar = document.querySelector(".btn-outline");

    const cargarHorarios = async (search = "") => {

        const jornadas = await get(`horarios/jornadas?search=${search}`);
        tbody.innerHTML = "";

        if (jornadas && jornadas.data && jornadas.data.length > 0) {

            jornadas.data.forEach((item, index) => {

                const tr = document.createElement("tr");

                // ===== # =====
                const td1 = document.createElement("td");
                td1.textContent = index + 1;

                // ===== NOMBRE =====
                const td2 = document.createElement("td");
                td2.textContent = item.horario;

                // ===== HORA INICIO =====
                const td3 = document.createElement("td");
                const spanInicio = document.createElement("span");
                spanInicio.classList.add("badge-time");
                spanInicio.textContent = item.start_time;
                td3.appendChild(spanInicio);

                // ===== HORA FIN =====
                const td4 = document.createElement("td");
                const spanFin = document.createElement("span");
                spanFin.classList.add("badge-time");
                spanFin.textContent = item.end_time;
                td4.appendChild(spanFin);

                // ===== JORNADA =====
                const td5 = document.createElement("td");
                const spanJornada = document.createElement("span");

                const jornadaLower = item.jornada.toLowerCase();

                if (jornadaLower.includes("mañana")) {
                    spanJornada.classList.add("badge-morning");
                    spanJornada.textContent = "Mañana";
                } else if (jornadaLower.includes("tarde")) {
                    spanJornada.classList.add("badge-afternoon");
                    spanJornada.textContent = "Tarde";
                } else {
                    spanJornada.classList.add("badge-night");
                    spanJornada.textContent = "Noche";
                }

                td5.appendChild(spanJornada);

                // ===== ACCIONES =====
                const td6 = document.createElement("td");

                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => {
                    abrirModalHorario(item, index);
                });

                const btnEditar = document.createElement("button");
                btnEditar.classList.add("btn-editar");
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener("click", () => {
                    editarmodalHorario(item, index);
                });

                const btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar");
                btnEliminar.textContent = "Eliminar";

                td6.appendChild(btnVer);
                td6.appendChild(btnEditar);
                td6.appendChild(btnEliminar);

                // ===== APPEND FINAL =====
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tr.appendChild(td6);

                tbody.appendChild(tr);
            });

        } else {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 6;
            td.textContent = "No hay horarios registrados";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    };

    btnNuevoHorario.addEventListener("click", () => {
        abrirModalCrearHorario();
    });

    btnBuscar.addEventListener("click", () => {
        cargarHorarios(inputBuscar.value.trim());
    });

    inputBuscar.addEventListener("keyup", () => {
        cargarHorarios(inputBuscar.value.trim());
    });

    await cargarHorarios();
};
