export function isAuth() {

    if (localStorage.getItem('role_id')) return true;

    return false;

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
