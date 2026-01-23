import { getCookie } from './getCookies.js';
import { cerrarTodos } from './modalManagement.js';
import { error } from './alertas.js';

const url = "http://localhost:8000/api/"

export const refreshToken = async () => {
    try {
        await fetch(`${url}refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('refresh_token')}`
            },
            body: JSON.stringify([])
        });
    } catch (err) {
        console.error('Error al refrescar token:', err);
    }
};

// GET
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
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/Home';
                return null;
            }
        }

        return await response.json();
    } catch (err) {
        console.error('Error en GET:', err);
        return null;
    }
};

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
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/Home';
                return null;
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return await response.blob();

    } catch (err) {
        console.error('Error en exportFile:', err);
        throw err;
    }
};


// POST
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
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/Home';
                return null;
            }
        }

        return await response.json();
    } catch (err) {
        console.error('Error en POST:', err);
        return null;
    }
};
// POST IMPORT FILE
export const postFile = async (endpoint, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        let response = await fetch(`${url}${endpoint}`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: formData
        });

        if (response.status === 401) {
            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
                body: formData
            });

            if (response.status === 401) {
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = "#/Home";
                return null;
            }
        }

        return await response.json();

    } catch (err) {
        console.error("Error en POST FILE:", err);
        return null;
    }
};

// PATCH
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
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/Home';
                return null;
            }
        }

        return await response.json();
    } catch (err) {
        console.error('Error en PATCH:', err);
        return null;
    }
};

// DELETE
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
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/Home';
                return null;
            }
        }

        return await response.json();
    } catch (err) {
        console.error('Error en DELETE:', err);
        return null;
    }
};



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



