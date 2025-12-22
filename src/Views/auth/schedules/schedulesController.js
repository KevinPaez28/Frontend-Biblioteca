import "../../../Styles/Schedules/Schedules.css"
export default async (params = null) => {
    const jornadas = await get("jornadas/horarios");

    const tbody = document.querySelector(".seccion-dashboard .table tbody");

    if (jornadas && jornadas.data && jornadas.data.length > 0) {
        jornadas.data.forEach((item, index) => {
            const tr = document.createElement("tr");

            const td1 = document.createElement("td");
            td1.textContent = index + 1;

            const td2 = document.createElement("td");
            td2.textContent = item.jornada;

            const td3 = document.createElement("td");
            const spanInicio = document.createElement("span");
            spanInicio.classList.add("badge-time");
            spanInicio.textContent = item.start_time;
            td3.appendChild(spanInicio);

            const td4 = document.createElement("td");
            const spanFin = document.createElement("span");
            spanFin.classList.add("badge-time");
            spanFin.textContent = item.end_time;
            td4.appendChild(spanFin);

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

            const td6 = document.createElement("td");
            const btnVer = document.createElement("button");
            btnVer.classList.add("btn-ver");
            btnVer.textContent = "Ver";
            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn-editar");
            btnEditar.textContent = "Editar";
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn-eliminar");
            btnEliminar.textContent = "Eliminar";
            td6.appendChild(btnVer);
            td6.appendChild(btnEditar);
            td6.appendChild(btnEliminar);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);

            tbody.appendChild(tr);
        });
    } else {
        tbody.textContent = "No hay horarios registrados";
    }

}