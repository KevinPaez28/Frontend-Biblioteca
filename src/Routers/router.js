  import { routes } from './routes';
  import { renderSidebar } from '../Components/Sidebar/sidebar.js';
  import { isAuth } from '../helpers/auth.js';
  import hasPermisos from '../Helpers/Utils/haspermisos.js';

  let sidebarCargado = false;

  export const router = async (sidebar, app) => {
    const hash = location.hash.slice(1);
    const segmentos = hash.split('/').filter(Boolean);

    const resultado = encontrarRuta(routes, segmentos);
    if (!resultado) {
      app.innerHTML = `<h2>Ruta no encontrada</h2>`;
      return;
    }

    const [ruta, params] = resultado;
    const meta = ruta.meta || {};

    // ================= RUTAS PUBLICAS =================
    if (!meta.public && !isAuth()) {
      sidebar.innerHTML = "";
      app.innerHTML = "";
      sidebarCargado = false;
      location.hash = '#/Login';
      return;
    }

    // ================= PERMISOS =================
    if (meta.can) {
      const permisosUsuario = JSON.parse(localStorage.getItem("permissions")) || [];
      const requeridos = Array.isArray(meta.can) ? meta.can : [meta.can];

      const permitido = requeridos.some(permiso =>
        hasPermisos(permiso, permisosUsuario)
      );

      if (!permitido) {
        app.innerHTML = `<h2>No tienes permisos</h2>`;
        window.history.back();
        return;
      }
    }

    // ================= SIDEBAR =================
    if (!sidebarCargado && isAuth()) {
      renderSidebar(sidebar);
      sidebarCargado = true;
    }

    // ================= CARGAR VISTA =================
    if (ruta.path) {
      await cargarVista(ruta.path, app);
    }

    // ================= CONTROLLER =================
    if (ruta.controller) {
      await ruta.controller(params);
    }
  };

  // ==================================================
  // ================= FUNCIONES AUX ===================
  // ==================================================

  const cargarVista = async (path, elemento) => {
    try {
      const response = await fetch(`./src/views/${path}`);
      if (!response.ok) throw new Error("No se pudo cargar la vista");
      const html = await response.text();
      elemento.innerHTML = html;
    } catch (error) {
      console.error(error);
      elemento.innerHTML = `<h2>Error al cargar la vista</h2>`;
    }
  };

  const encontrarRuta = (routes, segmentos) => {
    let rutaActual = routes;
    let parametros = {};

    if (segmentos.length > 0) {
      const ultimo = segmentos[segmentos.length - 1];
      if (ultimo.includes("=")) {
        parametros = extraerParametros(ultimo);
        segmentos.pop();
      }
    }

    for (let i = 0; i < segmentos.length; i++) {
      const segmento = segmentos[i];
      if (rutaActual[segmento]) {
        rutaActual = rutaActual[segmento];
      } else {
        return null;
      }
    }

    return [rutaActual, parametros];
  };

  const extraerParametros = (paramStr) => {
    const params = {};
    paramStr.split("&").forEach(par => {
      const [key, value] = par.split("=");
      params[key] = value;
    });
    return params;
  };
