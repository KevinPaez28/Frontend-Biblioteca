import { routes } from './routes';
import { renderSidebar } from '../components/sidebar/sidebar.js';
import { isAuth, isAdmin } from '../helpers/auth.js';

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

  // Solo usuarios autenticados
  if (ruta.private && !isAuth()) {
    location.hash = '#/login';
    return;
  }

  // Mostrar sidebar solo si es admin
  if (!sidebarCargado && isAdmin()) {
    renderSidebar(sidebar);
    sidebarCargado = true;
  }

  // Cargar la vista en main
  if (ruta.path) {
    await cargarVista(ruta.path, app);
  }

  // Ejecutar controlador si existe
  if (ruta.controller) await ruta.controller(params);
};

const cargarVista = async (path, elemento) => {
  try {
    const response = await fetch(`./src/views/${path}`);
    if (!response.ok) throw new Error("No se pudo cargar la vista");
    const html = await response.text();
    elemento.innerHTML = html;
  } catch (err) {
    console.error(err);
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
    if (rutaActual[segmento]) rutaActual = rutaActual[segmento];
    else return null;
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
