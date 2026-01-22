import "../../../Styles/Histories/Histories.css";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";

export default async () => {

    const contenedor = document.getElementById("historial-lista");

    const inputs = document.querySelectorAll(".input-filter");
    const inputAccion  = inputs[0];
    const inputUsuario = inputs[1];
    const inputModulo  = inputs[2];

    const btnFiltrar = document.querySelector(".btn-outline");

    const cargarHistorial = async () => {

        const params = new URLSearchParams({
            action: inputAccion.value.trim(),
            user: inputUsuario.value.trim(),
            module: inputModulo.value.trim(),
        }).toString();
    
        try {
            showSpinner(contenedor);
    
            const response = await get(`historial?${params}`);
            contenedor.innerHTML = "";
    
            if (response?.data?.length) {
                response.data.forEach(item => {
    
                    const divItem = document.createElement("div");
                    divItem.classList.add("historial-item");
    
                    const divAccion = document.createElement("div");
                    divAccion.classList.add("historial-accion");
    
                    const accion = item.action?.name?.toLowerCase() || "crear";
                    divAccion.classList.add(accion);
                    divAccion.textContent = item.action?.name || "Acción";
    
                    const divInfo = document.createElement("div");
                    divInfo.classList.add("historial-info");
    
                    const strong = document.createElement("strong");
                    strong.textContent = item.user?.perfil?.name || "Usuario";
    
                    const p = document.createElement("p");
                    p.innerHTML = item.description || "Sin descripción";
    
                    divInfo.append(strong, p);
    
                    const divFecha = document.createElement("div");
                    divFecha.classList.add("historial-fecha");
    
                    const fecha = new Date(item.created_at);
                    divFecha.innerHTML = `
                        <span>${fecha.toLocaleDateString()}</span>
                        <small>${fecha.toLocaleTimeString()}</small>
                    `;
    
                    divItem.append(divAccion, divInfo, divFecha);
                    contenedor.appendChild(divItem);
                });
            } else {
                contenedor.innerHTML = `
                    <div class="historial-empty">
                        No hay registros en el historial
                    </div>
                `;
            }
    
        } catch (e) {
            console.error(e);
        } finally {
            hideSpinner(contenedor); 
        }
    };
    

    btnFiltrar.addEventListener("click", cargarHistorial);
    inputs.forEach(i => i.addEventListener("keyup", cargarHistorial));

    await cargarHistorial();
};
