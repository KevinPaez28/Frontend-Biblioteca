import './style.css';
import { router } from './Routers/router';

const app = document.querySelector('#app');
let sidebarCargado = false;

// Cargar sidebar solo si hay rol
async function cargarSidebar() {
  const role = localStorage.getItem("role_id");

  if (!role || sidebarCargado) return;

  try {
    const resp = await fetch('./src/layouts/sidebar/index.html');
    const html = await resp.text();
    document.body.insertAdjacentHTML('afterbegin', html);
    sidebarCargado = true;
  } catch (e) {
    console.error("Error cargando sidebar", e);
  }
}

//  Mostrar u ocultar sidebar
function manejarSidebar() {
  const role = localStorage.getItem("role_id");
  const sidebar = document.querySelector('.sidebar');

  // SIEMPRE definir estado visual
  document.body.classList.remove("no-role", "with-role");

  if (role) {
    document.body.classList.add("with-role");
    if (sidebar) {
      sidebar.style.display = "block";
    }
  } else {
    document.body.classList.add("no-role");
    if (sidebar) {
      sidebar.style.display = "none";
    }
  }
}


//  Inicio
window.addEventListener('DOMContentLoaded', async () => {
  await cargarSidebar();   // primero existe
  manejarSidebar();        // luego se muestra
  router(app);
});

// Cambio de ruta
window.addEventListener('hashchange', async () => {
  await cargarSidebar();   // por si entra directo con rol
  manejarSidebar();
  router(app);
});
