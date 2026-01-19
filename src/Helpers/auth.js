export function isAuth() {

    if (localStorage.getItem('role_id')) return true;

    return false;

}

export function isAdmin() {

    const rolesPermitidos = [1];

    if (rolesPermitidos.includes(parseInt(localStorage.getItem('role_id')))) return true;

    return false;
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
