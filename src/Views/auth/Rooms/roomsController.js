import { get } from "../../../Helpers/api.js";
import { abrirModalCrearArea } from "./createrooms/createrooms.js";
import { editmodalreason } from "./EditRooms/editrooms.js";
import { deleteAreas } from "./DeleteRooms/deleterooms.js";
import { abrirModalReason } from "./viewRooms/viewrooms.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";

export default async () => {
    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    const contenedor = document.querySelector(".seccion-dashboard");
    const btnNuevo = document.querySelector("#btnnuevorooms");

    const filtros = {
        nombre: document.querySelector("input.input-filter"),
        estado: document.querySelector("#filter"),
    };

    if (btnNuevo) {
        if (tienePermiso("rooms.store")) {
            btnNuevo.addEventListener("click", () => {
                abrirModalCrearArea();
            });
        } else {
            btnNuevo.style.display = "none";
        }
    }

    const cargarSelects = async () => {
        const estados = await get("estadosalas");

        if (estados?.data?.length) {
            estados.data.forEach(e => {
                const option = document.createElement("option");
                option.value = e.id;
                option.textContent = e.name;
                filtros.estado.appendChild(option);
            });
        }
    };

    const cargarSalas = async () => {
        try {
            showSpinner(contenedor);

            const query = [];

            for (const key in filtros) {
                const input = filtros[key];
                if (input && input.value && input.value.trim() !== "") {
                    query.push(`${key}=${encodeURIComponent(input.value)}`);
                }
            }

            const url = query.length ? `salas?${query.join("&")}` : "salas";
            const salas = await get(url);

            tbody.innerHTML = "";

            if (salas?.data?.length) {
                salas.data.forEach((item, index) => {
                    const tr = document.createElement("tr");

                    const td1 = document.createElement("td");
                    td1.textContent = index + 1;

                    const td2 = document.createElement("td");
                    td2.textContent = item.name || "—";

                    const td3 = document.createElement("td");
                    if (item.description) {
                        td3.textContent =
                            item.description.length > 50
                                ? item.description.substring(0, 50) + "..."
                                : item.description;
                    } else {
                        td3.textContent = "—";
                    }

                    const td4 = document.createElement("td");
                    const spanEstado = document.createElement("span");
                    spanEstado.className = "badge-time";
                    spanEstado.textContent = item.state?.name || "—";
                    td4.appendChild(spanEstado);

                    const td5 = document.createElement("td");

                    const btnVer = document.createElement("button");
                    btnVer.className = "btn-ver";
                    btnVer.textContent = "Ver";
                    btnVer.onclick = () => abrirModalReason(item, index);
                    td5.append(btnVer);

                    if (tienePermiso("rooms.update")) {
                        const btnEditar = document.createElement("button");
                        btnEditar.className = "btn-editar";
                        btnEditar.textContent = "Editar";
                        btnEditar.onclick = () => editmodalreason(item, index);
                        td5.append(btnEditar);
                    }

                    if (tienePermiso("rooms.destroy")) {
                        const btnEliminar = document.createElement("button");
                        btnEliminar.className = "btn-eliminar";
                        btnEliminar.textContent = "Eliminar";
                        btnEliminar.onclick = () => deleteAreas(item);
                        td5.append(btnEliminar);
                    }

                    tr.append(td1, td2, td3, td4, td5);
                    tbody.appendChild(tr);
                });
            } else {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 5;
                td.style.textAlign = "center";
                td.textContent = "No se encontraron resultados";

                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        } catch (error) {
            console.error(" Error cargando salas:", error);
            tbody.innerHTML = "";
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 5;
            td.style.textAlign = "center";
            td.style.color = "red";
            td.textContent = "Error al cargar salas.";
            tr.appendChild(td);
            tbody.appendChild(tr);
        } finally {
            try {
                if (contenedor) {
                    hideSpinner(contenedor);
                }
            } catch (spinnerError) {
                console.error("Error al ocultar spinner:", spinnerError);
            }
        }
    };

    Object.values(filtros).forEach(input => {
        if (!input) return;

        if (input.tagName === "SELECT") {
            input.addEventListener("change", cargarSalas);
        } else {
            input.addEventListener("input", cargarSalas);
        }
    });

    await cargarSelects();
    cargarSalas();
};
