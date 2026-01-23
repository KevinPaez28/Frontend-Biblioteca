import "../../../Styles/Schedules/Schedules.css"; 
import { get } from "../../../Helpers/api.js";
import { abrirModalFicha } from "./viewFichas/FichasModal.js";
import { editarmodalFicha } from "./editsFichas/editsfichas.js";
import { abrirModalCrearFicha } from "./CreateFichas/createFichas.js";
import { deleteFicha } from "./deleteFichas/deleteFichas.js";
import { tienePermiso } from "../../../helpers/auth.js";

export default async () => {
    const tbody = document.querySelector(".seccion-dashboard .table tbody");
    const btnNuevaFicha = document.getElementById("btnNuevaFicha");
    const inputBuscar = document.querySelector(".input-filter");
    const btnBuscar = document.querySelector(".btn-outline");

    if (btnNuevaFicha && tienePermiso("fichas.store")) {
        btnNuevaFicha.addEventListener("click", () => {
            abrirModalCrearFicha();
        });
    } else if (btnNuevaFicha) {
        btnNuevaFicha.style.display = "none";
    }

    const cargarFichas = async (search = "") => {
        try {
            const response = await get(`ficha?search=${search}`);
            tbody.innerHTML = "";

            if (response && response.data && response.data.length > 0) {
                response.data.forEach((item, index) => {
                    const tr = document.createElement("tr");

                    const td1 = document.createElement("td");
                    td1.textContent = index + 1;

                    const td2 = document.createElement("td");
                    td2.textContent = item.ficha;

                    const td3 = document.createElement("td");
                    td3.textContent = item.programa?.training_program || "—";

                    const td4 = document.createElement("td");

                    const btnVer = document.createElement("button");
                    btnVer.classList.add("btn-ver");
                    btnVer.textContent = "Ver";
                    btnVer.addEventListener("click", () => {
                        abrirModalFicha(item, index);
                    });
                    td4.appendChild(btnVer);

                    if (tienePermiso("fichas.update")) {
                        const btnEditar = document.createElement("button");
                        btnEditar.classList.add("btn-editar");
                        btnEditar.textContent = "Editar";
                        btnEditar.addEventListener("click", () => {
                            editarmodalFicha(item, index);
                        });
                        td4.appendChild(btnEditar);
                    }

                    if (tienePermiso("fichas.destroy")) {
                        const btnEliminar = document.createElement("button");
                        btnEliminar.classList.add("btn-eliminar");
                        btnEliminar.textContent = "Eliminar";
                        btnEliminar.addEventListener("click", () => {
                            deleteFicha(item);
                        });
                        td4.appendChild(btnEliminar);
                    }

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);

                    tbody.appendChild(tr);
                });
            } else {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 4;
                td.textContent = "No hay fichas registradas";
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        } catch (error) {
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

    btnBuscar.addEventListener("click", () => {
        cargarFichas(inputBuscar.value.trim());
    });

    inputBuscar.addEventListener("keyup", () => {
        cargarFichas(inputBuscar.value.trim());
    });

    await cargarFichas();
};
