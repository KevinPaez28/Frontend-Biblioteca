export function isAuth() {
    const role = localStorage.getItem('role_id');
    const permissions = localStorage.getItem('permissions');

    // Si falta algo del estado mínimo → NO autenticado
    if (!role || !permissions) return false;

    // Si el navegador NO tiene cookies activas → NO autenticado
    if (!navigator.cookieEnabled) return false;

    return true;
}

export function isAdmin() {
    const rolesPermitidos = [1, 5]; // Admin = 1, Ayudante = 5
    const role = parseInt(localStorage.getItem('role_id'));

    if (isNaN(role)) return false; // si no hay rol guardado
    return rolesPermitidos.includes(role); // devuelve true si es 1 o 5
}

export function isAuthorize(permissionEntry) {
    const permisosString = localStorage.getItem('permissions');
    if (!permisosString) return false;

    // Parseamos el JSON si es un array
    let permissions = [];
    try {
        permissions = JSON.parse(permisosString);
    } catch (e) {
        console.error("Error parseando permisos:", e);
        return false;
    }

    return permissions.includes(permissionEntry);
}

export const tienePermiso = (permiso) => {
  const permisosGuardados = localStorage.getItem('permissions');
  if (!permisosGuardados) return false;

  try {
    const permisosArray = JSON.parse(permisosGuardados);
    const permisos = Array.isArray(permisosArray) ? permisosArray : [];
    
    return permisos.includes(permiso);
  } catch (e) {
    console.error("Error parseando:", e);
    return false;
  }
};



export const convertirPermisosArray = (permisos) => {
    // Convierte la cadena de permisos en un array de caracteres
    permisos = permisos.split("");
    // Variable auxiliar para construir la cadena limpia
    let aux = "";
    // Recorre cada carácter de la cadena de permisos
    for (let n = 0; n < permisos.length; n++) {
        // Si es el primer carácter, el último o un espacio, lo omite
        if (n == 0 || n == permisos.length - 1 || permisos[n] == " ") continue
        // Agrega el carácter a la variable auxiliar
        aux += permisos[n];
    }
    // Divide la cadena auxiliar por comas para obtener el array de permisos
    permisos = aux.split(",");
    // Retorna el array de permisos
    return permisos;
}

export const cerrarSesion = () => {
    //  limpiar TODO el estado del navegador
    localStorage.clear();

    // (opcional pero recomendado)
    sessionStorage.clear();

    // cerrar modales, alertar y mandar al home/login
    cerrarTodos();
    error("Sesión expirada");

    window.location.href = '#/Home';
};
