import './style.css';
import { router } from './Routers/router.js';


const main = document.querySelector('#app');




window.addEventListener('hashchange', async (e) => {
  router(main);
})

window.addEventListener('DOMContentLoaded', async () => {
  router(main);
})

   