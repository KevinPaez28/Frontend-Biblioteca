import { cerrarTodos } from './modalManagement.js';
import { error } from './alertas.js';

const url = `${import.meta.env.VITE_API_URL}/api/`;

/* ================================
   🔥 CIERRE TOTAL DE SESIÓN
================================ */
export const cerrarSesion = () => {
    localStorage.clear();
    sessionStorage.clear();

    cerrarTodos();
    error("Sesión expirada");

    window.location.href = '#/Home';
};

/* ================================
   🔁 REFRESH TOKEN
================================ */
export const refreshToken = async () => {
    try {
        await fetch(`${url}refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Error al refrescar token:', err);
    }
};

/* ================================
   🌐 GET
================================ */
export const get = async (endpoint) => {
    try {
        let response = await fetch(`${url}${endpoint}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                cerrarSesion();
                return null;
            }
        }

        return await response.json();
    } catch (err) {
        console.error('Error en GET:', err);
        return null;
    }
};

/* ================================
   📤 EXPORT FILE
================================ */
export const exportFile = async (endpoint) => {
    try {
        let response = await fetch(`${url}${endpoint}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            });

            if (response.status === 401) {
                cerrarSesion();
                return null;
            }
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.blob();
    } catch (err) {
        console.error('Error en exportFile:', err);
        throw err;
    }
};

/* ================================
   📥 POST
================================ */
export const post = async (endpoint, datos) => {
    try {
        let response = await fetch(`${url}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            if (response.status === 401) {
                cerrarSesion();
                return null;
            }
        }

        return await response.json();
    } catch (err) {
        console.error('Error en POST:', err);
        return null;
    }
};

/* ================================
   📎 POST FILE
================================ */
export const postFile = async (endpoint, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        let response = await fetch(`${url}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.status === 401) {
                cerrarSesion();
                return null;
            }
        }

        return await response.json();
    } catch (err) {
        console.error('Error en POST FILE:', err);
        return null;
    }
};

/* ================================
   ✏️ PATCH
================================ */
export const patch = async (endpoint, datos) => {
    try {
        let response = await fetch(`${url}${endpoint}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            if (response.status === 401) {
                cerrarSesion();
                return null;
            }
        }

        return await response.json();
    } catch (err) {
        console.error('Error en PATCH:', err);
        return null;
    }
};

/* ================================
   🗑️ DELETE
================================ */
export const delet = async (endpoint) => {
    try {
        let response = await fetch(`${url}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                cerrarSesion();
                return null;
            }
        }

        return await response.json();
    } catch (err) {
        console.error('Error en DELETE:', err);
        return null;
    }
};

/* ================================
   🔐 LOGIN
================================ */
export const login = async (content) => {
    try {
        const response = await fetch(`${url}login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(content)
        });

        const data = await response.json();

        return {
            ok: response.ok,
            message: data.message || "Error desconocido",
            errors: data.errors || [],
            data: data.data || null
        };
    } catch (err) {
        console.error("Error en login:", err);
        return {
            ok: false,
            message: "Error inesperado al iniciar sesión",
            errors: [],
            data: null
        };
    }
};