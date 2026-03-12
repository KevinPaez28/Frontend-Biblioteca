import "../../../styles/schedules/schedules.css";
import { get } from "../../../helpers/api.js";
import { abrirModalPrograma } from "./viewPrograms/FichasModal.js";
import { editarModalPrograma } from "./editsPrograms/editsfichas.js";
import { abrirModalCrearPrograma } from "./CreatePrograms/createPrograms.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { deletePrograma } from "./deletePrograms/deleteProgram.js";

export default async () => {

    const tbody = document.getElementById("programas-tbody");
    const pagination = document.querySelector(".pagination");

    const btnNuevoPrograma = document.getElementById("btnNuevoPrograma");
    const inputBuscar = document.getElementById("inputBuscarPrograma");
    const btnBuscar = document.getElementById("btnBuscarPrograma");

    let currentPage = 1;

    // =============================
    // BOTÓN NUEVO PROGRAMA (RBAC)
    // =============================
    if (btnNuevoPrograma && tienePermiso("programs.store")) {
        btnNuevoPrograma.addEventListener("click", () => abrirModalCrearPrograma());
    } else if (btnNuevoPrograma) {
        btnNuevoPrograma.style.display = "none";
    }

    // =============================
    // CARGAR PROGRAMAS
    // =============================
    const cargarProgramas = async (page = 1, search = "") => {

        currentPage = page;

        try {

            const response = await get(`programa/search?page=${page}&nombre=${search}`);

            tbody.innerHTML = "";
            pagination.innerHTML = "";

            if (!response?.data?.records || response.data.records.length === 0) {

                const tr = document.createElement("tr");
                const td = document.createElement("td");

                td.colSpan = 3;
                td.style.textAlign = "center";
                td.textContent = "No hay programas registrados";

                tr.appendChild(td);
                tbody.appendChild(tr);

                return;
            }

            const records = response.data.records;
            const meta = response.data.meta;

            // =============================
            // RENDER TABLA
            // =============================
            records.forEach((item, index) => {

                const tr = document.createElement("tr");

                // NUMERO
                const td1 = document.createElement("td");
                td1.textContent = (meta.current_page - 1) * meta.per_page + index + 1;

                // PROGRAMA
                const td2 = document.createElement("td");
                td2.textContent = item.training_program || "—";

                // ACCIONES
                const td3 = document.createElement("td");

                // VER (siempre)
                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";
                btnVer.addEventListener("click", () => abrirModalPrograma(item));
                td3.append(btnVer);

                // EDITAR (RBAC)
                if (tienePermiso("programs.update")) {

                    const btnEditar = document.createElement("button");
                    btnEditar.classList.add("btn-editar");
                    btnEditar.textContent = "Editar";

                    btnEditar.addEventListener("click", () => {
                        editarModalPrograma(item);
                    });

                    td3.append(btnEditar);
                }

                // ELIMINAR (RBAC)
                if (tienePermiso("programs.destroy")) {

                    const btnEliminar = document.createElement("button");
                    btnEliminar.classList.add("btn-eliminar");
                    btnEliminar.textContent = "Eliminar";

                    btnEliminar.addEventListener("click", () => {
                        deletePrograma(item);
                    });

                    td3.append(btnEliminar);
                }

                tr.append(td1, td2, td3);
                tbody.appendChild(tr);

            });

            // =============================
            // PAGINACIÓN
            // =============================

            const btnPrev = document.createElement("button");
            btnPrev.textContent = "« Anterior";
            btnPrev.disabled = meta.current_page === 1;

            btnPrev.addEventListener("click", () => {
                cargarProgramas(meta.current_page - 1, inputBuscar.value.trim());
            });

            pagination.appendChild(btnPrev);

            for (let i = 1; i <= meta.last_page; i++) {

                const btn = document.createElement("button");

                btn.textContent = i;
                btn.classList.add("btn-pag");

                if (i === meta.current_page) btn.disabled = true;

                btn.addEventListener("click", () => {
                    cargarProgramas(i, inputBuscar.value.trim());
                });

                pagination.appendChild(btn);
            }

            const btnNext = document.createElement("button");

            btnNext.textContent = "Siguiente »";
            btnNext.disabled = meta.current_page === meta.last_page;

            btnNext.addEventListener("click", () => {
                cargarProgramas(meta.current_page + 1, inputBuscar.value.trim());
            });

            pagination.appendChild(btnNext);

        } catch (error) {

            console.error("Error cargando programas:", error);

            tbody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center;color:red">
                        Error al cargar programas
                    </td>
                </tr>
            `;
        }
    };

    // =============================
    // BUSCAR
    // =============================
    if (btnBuscar && inputBuscar) {

        btnBuscar.addEventListener("click", () => {
            cargarProgramas(1, inputBuscar.value.trim());
        });

        inputBuscar.addEventListener("keyup", (e) => {

            if (e.key === "Enter") {
                cargarProgramas(1, inputBuscar.value.trim());
            }

        });
    }

    // =============================
    // CARGA INICIAL
    // =============================
    await cargarProgramas(1);
};