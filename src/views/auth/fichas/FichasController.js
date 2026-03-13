import "../../../styles/schedules/schedules.css";
import { get } from "../../../helpers/api.js";
import { abrirModalFicha } from "./viewFichas/FichasModal.js";
import { editarmodalFicha } from "./editsFichas/editsfichas.js";
import { abrirModalCrearFicha } from "./CreateFichas/createFichas.js";
import { deleteFicha } from "./deleteFichas/deleteFichas.js";
import { tienePermiso } from "../../../helpers/auth.js";

/**
 * Controlador principal del módulo de fichas
 * Este archivo se encarga de:
 * - consultar las fichas en la API
 * - aplicar filtros de búsqueda
 * - renderizar la tabla
 * - manejar permisos de usuario
 */
export default async () => {

    /* =========================================
       REFERENCIAS A ELEMENTOS DEL DOM
    ========================================= */

    // tbody donde se renderizarán las fichas
    const tbody = document.querySelector(".seccion-dashboard .table tbody");

    // botón para crear nueva ficha
    const btnNuevaFicha = document.getElementById("btnNuevaFicha");

    // input de búsqueda
    const inputBuscar = document.querySelector(".input-filter");

    // botón de búsqueda
    const btnBuscar = document.querySelector(".btn-outline");


    /* =========================================
       CONTROL DE PERMISOS PARA CREAR FICHAS
    ========================================= */

    if (btnNuevaFicha && tienePermiso("fichas.store")) {

        // si tiene permiso abrimos el modal
        btnNuevaFicha.addEventListener("click", () => {
            abrirModalCrearFicha();
        });

    } else if (btnNuevaFicha) {

        // si no tiene permiso ocultamos el botón
        btnNuevaFicha.style.display = "none";
    }


    /* =========================================
       OBJETO DE FILTROS
       Permite escalar filtros fácilmente
    ========================================= */

    const filtros = {
        search: inputBuscar
    };


    /* =========================================
       FUNCIÓN PRINCIPAL PARA CARGAR FICHAS
    ========================================= */

    const cargarFichas = async () => {

        try {

            // creamos los parámetros de búsqueda
            const params = new URLSearchParams();

            Object.entries(filtros).forEach(([key, input]) => {

                if (input && input.value.trim() !== "") {
                    params.append(key, input.value.trim());
                }

            });

            // endpoint de búsqueda
            const url = `ficha/search?${params.toString()}`;

            // petición a la API
            const response = await get(url);

            // limpiamos la tabla antes de renderizar
            tbody.innerHTML = "";


            /* =========================================
               DESESTRUCTURAR RESPUESTA
               records = datos
               meta = info de paginación
            ========================================= */

            const records = response?.data?.records || [];
            const meta = response?.data?.meta || {};


            /* =========================================
               VALIDACIÓN SI NO HAY DATOS
            ========================================= */

            if (records.length === 0) {

                const tr = document.createElement("tr");
                const td = document.createElement("td");

                td.colSpan = 4;
                td.textContent = "No hay fichas registradas";
                td.style.textAlign = "center";

                tr.appendChild(td);
                tbody.appendChild(tr);

                return;
            }


            /* =========================================
               RENDERIZAR FILAS
            ========================================= */

            records.forEach((item, index) => {

                const tr = document.createElement("tr");


                /* -------- COLUMNA # -------- */

                const td1 = document.createElement("td");
                td1.textContent = index + 1;


                /* -------- COLUMNA FICHA -------- */

                const td2 = document.createElement("td");
                td2.textContent = item.ficha;


                /* -------- COLUMNA PROGRAMA -------- */

                const td3 = document.createElement("td");
                td3.textContent = item.programa?.training_program || "—";


                /* -------- COLUMNA ACCIONES -------- */

                const td4 = document.createElement("td");


                /* ===== BOTÓN VER ===== */

                const btnVer = document.createElement("button");
                btnVer.classList.add("btn-ver");
                btnVer.textContent = "Ver";

                btnVer.addEventListener("click", () => {
                    abrirModalFicha(item, index);
                });

                td4.appendChild(btnVer);


                /* ===== BOTÓN EDITAR ===== */

                if (tienePermiso("fichas.update")) {

                    const btnEditar = document.createElement("button");

                    btnEditar.classList.add("btn-editar");
                    btnEditar.textContent = "Editar";

                    btnEditar.addEventListener("click", () => {
                        editarmodalFicha(item, index);
                    });

                    td4.appendChild(btnEditar);
                }


                /* ===== BOTÓN ELIMINAR ===== */

                if (tienePermiso("fichas.destroy")) {

                    const btnEliminar = document.createElement("button");

                    btnEliminar.classList.add("btn-eliminar");
                    btnEliminar.textContent = "Eliminar";

                    btnEliminar.addEventListener("click", () => {
                        deleteFicha(item);
                    });

                    td4.appendChild(btnEliminar);
                }


                /* -------- AGREGAR CELDAS A LA FILA -------- */

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);

                tbody.appendChild(tr);

            });


        } catch (error) {

            /* =========================================
               MANEJO DE ERRORES
            ========================================= */

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


    /* =========================================
       EVENTOS DE BÚSQUEDA
    ========================================= */

    // botón buscar
    btnBuscar.addEventListener("click", () => {
        cargarFichas();
    });

    // búsqueda en tiempo real
    inputBuscar.addEventListener("input", () => {
        cargarFichas();
    });


    /* =========================================
       CARGA INICIAL
    ========================================= */

    await cargarFichas();

};