export function isAuth() {

    if(localStorage.getItem('user_id')) return true;

    return false;

}

export function isAdmin() {

    const rolesPermitidos = [1];
    
    if(rolesPermitidos.includes(parseInt(localStorage.getItem('role_id')))) return true;

    return false;
}

export function isAuthorize(permissionEntry) {

    const permissions = localStorage.getItem('permissions').split(',');
    
    return permissions.some(permission => permission == permissionEntry);
    
}