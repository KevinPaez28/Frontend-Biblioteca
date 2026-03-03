import { routes } from './routes.js';
import { renderSidebar } from '@components/sidebar/sidebar.js';
import { isAuth } from '@helpers/auth.js';
import hasPermisos from '@helpers/utils/haspermisos.js';

let sidebarCargado = false;

export const router = async (sidebar, app) => {
  const raw = (location.hash || '#/home').slice(2); // quita "#/"
  const segmentos = raw.split('/').filter(Boolean);
  const key = (segmentos[0] || 'home').toLowerCase();

  const ruta = routes[key];
  if (!ruta) {
    app.innerHTML = `<h2>Ruta no encontrada: ${key}</h2>`;
    return;
  }

  const meta = ruta.meta || {};

  // Rutas públicas
  if (!meta.public && !isAuth()) {
    sidebar.innerHTML = "";
    app.innerHTML = "";
    sidebarCargado = false;
    location.hash = '#/home';
    return;
  }

  // Permisos
  if (meta.can) {
    const permisosUsuario = JSON.parse(localStorage.getItem("permissions")) || [];
    const requeridos = Array.isArray(meta.can) ? meta.can : [meta.can];
    const permitido = requeridos.some((permiso) => hasPermisos(permiso, permisosUsuario));

    if (!permitido) {
      app.innerHTML = `<h2>No tienes permisos</h2>`;
      return;
    }
  }

  // Sidebar
  if (!sidebarCargado && isAuth()) {
    renderSidebar(sidebar);
    sidebarCargado = true;
  }
  if (!isAuth()) {
    sidebar.innerHTML = "";
    sidebarCargado = false;
  }

  // Cargar vista HTML (PROD safe)
  // Coloca tus html en: public/views/...
  // y se pedirán como /views/xxxx/index.html
  if (ruta.view) {
    const url = `/views/${ruta.view}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      app.innerHTML = `<h2>Error cargando vista (${res.status})</h2><p>${url}</p>`;
      return;
    }
    app.innerHTML = await res.text();
  }

  // Controller
  if (ruta.controller) {
    await ruta.controller({});
  }
};
