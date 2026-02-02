import { get } from "../../../Helpers/api.js";
import { abrirModalCrearMotivo } from "./CreateReason/CreateReason.js";
import { deleteShifts } from "./deleteReason/deleteReason.js";
import { editmodalreason } from "./EditReason/EditReason.js";
import { abrirModalReason } from "./viewReason/viewReason.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";

export default async () => {
    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    const contenedor = document.querySelector(".seccion-dashboard");
    const btnNuevoMotivo = document.querySelector("#btnNuevoMotivo");
    const inputBuscar = document.querySelector(".input-filter");
    const btnBuscar = document.querySelector(".btn-outline");

    // 🔹 BOTÓN NUEVO MOTIVO
    if (btnNuevoMotivo) {
        btnNuevoMotivo.onclick = null; // limpia eventos anteriores

        if (tienePermiso("reasons.store")) {
            btnNuevoMotivo.onclick = () => {
                abrirModalCrearMotivo();
            };
        } else {
            btnNuevoMotivo.style.display = "none";
        }
    }

    const cargarMotivos = async (search = "") => {
        try {
            showSpinner(contenedor);

            const motivos = await get(`motivos?search=${search}`);
            tbody.innerHTML = "";

            if (motivos && motivos.data && motivos.data.length > 0) {

                motivos.data.forEach((item, index) => {
                    const tr = document.createElement("tr");

                    const td1 = document.createElement("td");
                    td1.textContent = index + 1;

                    const td2 = document.createElement("td");
                    td2.textContent = item.name;

                    const td3 = document.createElement("td");
                    const maxChars = 50;
                    td3.textContent = item.description
                        ? (item.description.length > maxChars
                            ? item.description.substring(0, maxChars) + "..."
                            : item.description)
                        : "";

                    const td4 = document.createElement("td");
                    const spanEstado = document.createElement("span");
                    spanEstado.classList.add("badge-time");
                    spanEstado.textContent = item.state.name;
                    td4.appendChild(spanEstado);

                    const td5 = document.createElement("td");

                    const btnVer = document.createElement("button");
                    btnVer.classList.add("btn-ver");
                    btnVer.textContent = "Ver";
                    btnVer.onclick = () => abrirModalReason(item, index);
                    td5.appendChild(btnVer);

                    if (tienePermiso("reasons.update")) {
                        const btnEditar = document.createElement("button");
                        btnEditar.classList.add("btn-editar");
                        btnEditar.textContent = "Editar";
                        btnEditar.onclick = () => editmodalreason(item, index);
                        td5.appendChild(btnEditar);
                    }

                    if (tienePermiso("reasons.destroy")) {
                        const btnEliminar = document.createElement("button");
                        btnEliminar.classList.add("btn-eliminar");
                        btnEliminar.textContent = "Eliminar";
                        btnEliminar.onclick = () => deleteShifts(item);
                        td5.appendChild(btnEliminar);
                    }

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
        } catch (error) {
            console.error("Error cargando motivos:", error);
            tbody.innerHTML = "";
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 5;
            td.textContent = "Error al cargar motivos.";
            td.style.textAlign = "center";
            td.style.color = "red";
            tr.appendChild(td);
            tbody.appendChild(tr);
        } finally {
            if (contenedor) hideSpinner(contenedor);
        }
    };

    // 🔹 FILTROS (SIN DUPLICAR EVENTOS)
    if (btnBuscar && inputBuscar) {
        btnBuscar.onclick = () => {
            cargarMotivos(inputBuscar.value.trim());
        };

        inputBuscar.onkeyup = (e) => {
            if (e.key === "Enter") {
                cargarMotivos(inputBuscar.value.trim());
            }
        };
    }

    await cargarMotivos();
};
