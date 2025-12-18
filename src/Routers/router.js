// Función principal del enrutador SPA
import { routes } from './routes.js';


// Redirecciona a una ruta determinada
export const redirigirARuta = (ruta) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Acceso no autorizado");
  }
  location.hash = ruta; // siempre redirige a la ruta indicada
};


export const router = async (app) => {
  const hash = location.hash.slice(2);
  const segmentos = hash.split('/').filter(Boolean);

  const resultado = encontrarRuta(routes, segmentos);
  if (!resultado) {
    app.innerHTML = `<h2>Ruta no encontrada</h2>`;
    return;
  }

  const [ruta, params] = resultado;

  //  Autenticación
  if (ruta.private && !isAuth()) {
    location.hash = '#/login';
    return;
  }

  //  Permisos
  if (ruta.permissions && !tienePermisos(ruta.permissions)) {
    app.innerHTML = `<h2>No tienes permisos</h2>`;
    return;
  }

  // AQUÍ SÍ se usa cargarVista
  await cargarVista(ruta, app, params);
};


export const encontrarRuta = (routes, segmentos) => {
  let rutaActual = routes;
  let rutaEncontrada = false;
  let parametros = {};

  if (segmentos.length === 3 && segmentos[2].includes("=")) {
    parametros = extraerParametros(segmentos[2]);
    segmentos.pop();
  }

  for (let i = 0; i < segmentos.length; i++) {
    const segmento = segmentos[i];

    if (rutaActual[segmento]) {
      rutaActual = rutaActual[segmento];
      rutaEncontrada = true;
    } else {
      rutaEncontrada = false;
      break;
    }

    // 🔥 Aquí estaba la diferencia
    if (esGrupoRutas(rutaActual)) {
      if (rutaActual["/"] && i === segmentos.length - 1) {
        rutaActual = rutaActual["/"];
        rutaEncontrada = true;
      }
    }
  }

  return rutaEncontrada ? [rutaActual, parametros] : null;
};


// Extrae un objeto clave-valor desde un string de parámetros tipo "id=1&modo=editar"
const extraerParametros = (parametros) => {
  const pares = parametros.split("&");
  const params = {};
  pares.forEach(par => {
    const [clave, valor] = par.split("=");
    params[clave] = valor;
  });
  return params;
};

// Carga una vista HTML externa dentro de un elemento
const cargarVista = async (ruta, elemento, params = {}) => {
  try {
    if (ruta.private) {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario) {
        alert("Acceso no autorizado");
        location.hash = "#/Home";
        return;
      }
    }

    const response = await fetch(`./src/views/${ruta.path}`);
    if (!response.ok) throw new Error("Vista no encontrada");

    const contenido = await response.text();
    elemento.innerHTML = contenido;

    if (ruta.controller) {
      ruta.controller(params); // ahora sí pasa los parámetros correctamente
    }

  } catch (error) {
    console.error(error);
    elemento.innerHTML = `<h2>Error al cargar la vista</h2>`;
  }
};


// Verifica si un objeto representa un grupo de rutas (todas sus claves son objetos)
const esGrupoRutas = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] !== 'object' || obj[key] === null) {
      return false;
    }
  }
  return true;
};