import "../../../Styles/Assitances/assistances.css";
import { get } from "../../../Helpers/api.js";

export default async () => {

    // BOTON FILTROS AVANZADOS
    const btnFiltros = document.getElementById('btnFiltros');
    const filtrosAvanzados = document.getElementById('filtrosAvanzados');

    btnFiltros.addEventListener('click', () => {
        if (filtrosAvanzados.style.display === "none") {
            filtrosAvanzados.style.display = "grid";
        } else {
            filtrosAvanzados.style.display = "none";
        }
    });

    // TABLA
    const tabla = document.getElementById("tablaAsistencias");
    if (!tabla) return console.error("No se encontró el tbody #tablaAsistencias");

    const asistencias = await get("asistencia");
    console.log(asistencias);

    // Limpiar la tabla
    tabla.innerHTML = "";

    if (asistencias && asistencias.data && asistencias.data.length > 0) {

        asistencias.data.forEach((item, index) => {

            const tr = document.createElement("tr");

            // Cada celda mantiene la estructura de tu card original
            tr.innerHTML = `
                 <td>${index + 1}</td>
                 <td>${item.Ficha || "Sin ficha"}</td>
                 <td>${item.FirstName || "Sin nombre"}</td>
                 <td>${item.LastName || ""}</td>
                 <td>${item.DateTime || ""}</td>
                 <td>${item.Reason || "Sin motivo"}</td>
                 <td>
                     <button class="btn-ver">Ver</button>
                 </td>
             `;

            // Evento del botón
            tr.querySelector(".btn-ver").addEventListener("click", () => {
                console.log("Ver asistencia", item);
            });

            tabla.appendChild(tr);
        });

    } else {
        tabla.innerHTML = `
             <tr>
                 <td colspan="7" style="color:var(--color-gris);text-align:center">
                     No hay asistencias registradas
                 </td>
             </tr>
         `;
    }
};