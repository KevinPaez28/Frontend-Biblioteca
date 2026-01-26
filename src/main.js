import { getCookie } from './Helpers/getCookies.js';
import { router } from './Routers/router.js';
import { isAuth, isAdmin } from './helpers/auth.js';
import './style.css';

const sidebar = document.querySelector("#sidebar");
const app = document.querySelector("#app");

// Función para manejar clases del body según rol
const actualizarBody = () => {
  if (getCookie("access_token")) {
    console.log("Si se activa");
    document.body.classList.add('with-role');
    document.body.classList.remove('no-role');
  } else {
    console.log("No se activa");
    document.body.classList.add('no-role');
    document.body.classList.remove('with-role');
  }
};

// Inicialización al cargar la página
window.addEventListener('DOMContentLoaded', async () => {
  actualizarBody();
  await router(sidebar, app);
});

// Reaccionar a cambios de hash (rutas)
window.addEventListener('hashchange', async () => {
  actualizarBody();
  await router(sidebar, app);
});
