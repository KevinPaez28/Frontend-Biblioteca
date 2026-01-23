import sidebarHtml from './index.html?raw';
import { isAuthorize } from '../../helpers/auth.js';
import { confirm } from '../../Helpers/alertas.js';

export const renderSidebar = (elemento) => {
  elemento.innerHTML = sidebarHtml;

  const items = elemento.querySelectorAll(".sidebar__menu li");

  items.forEach(li => {
    const permiso = li.dataset.permiso; 

    // Clase universal
    const clase = 'permiso-' + permiso.replace(/\./g, '_');
    li.classList.add(clase);

    // Ocultar si no tiene permiso
    if (permiso && !isAuthorize(permiso)) {
      li.style.display = 'none';
    }
  });

  const usuarioSpan = elemento.querySelector('.name');
  if (usuarioSpan) {
    const nombres = localStorage.getItem("nombres") || "";
    const apellido = localStorage.getItem("apellido") || "";
    usuarioSpan.textContent = `${nombres} ${apellido}`;
  }

  // ================= BOTÓN CERRAR SESIÓN =================
  const btnLogout = elemento.querySelector('.sidebar__logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => { 
      const result = await confirm("¿Desea cerrar sesión?");
      if (!result.isConfirmed) return;

      // Borra localStorage
      localStorage.clear();

      // Borra todas las cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Redirige al login
      location.hash = '#/Login';
      location.reload();
    });
  }

};
