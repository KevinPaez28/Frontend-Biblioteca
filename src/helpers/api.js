import { getCookie } from '../helpers/getCookies.js';
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

        const response = await fetch(`${url}refresh-token`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("No se pudo refrescar el token");
        }

        return await response.json();

    } catch (err) {
        console.error('Error al refrescar token:', err);
        cerrarSesion();
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            }
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
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
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Authorization': `Bearer ${getCookie('access_token')}`
            }
        });

        // Manejo de 401
        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${url}${endpoint}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                }
            });

            if (response.status === 401) {
                cerrarSesion();
                return null;
            }
        }

        const contentType = response.headers.get('Content-Type');

        // Si el backend devuelve JSON (error)
        if (contentType?.includes('application/json')) {
            const data = await response.json();
            throw new Error(data?.message || `HTTP ${response.status}`);
        }

        // Si no es Excel ni JSON
        if (!response.ok) {
            throw new Error(`HTTP ${response.message}`);
        }

        // Respuesta tipo Excel
        return await response.blob();

    } catch (err) {
        console.error('Error en exportFile:', err);
        throw err; // El modal lo captura
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
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
            headers: {
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: formData
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            }
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
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