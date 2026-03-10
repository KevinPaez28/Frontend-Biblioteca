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
            credentials: 'include'
        });
    } catch (err) {
        console.error('Error refrescando token:', err);
    }
};

/* ================================
   🌐 CLIENTE BASE
================================ */
const apiFetch = async (endpoint, options = {}) => {

    let response = await fetch(`${url}${endpoint}`, {
        ...options,
        credentials: 'include'
    });

    if (response.status === 401) {

        await refreshToken();

        response = await fetch(`${url}${endpoint}`, {
            ...options,
            credentials: 'include'
        });

        if (response.status === 401) {
            cerrarSesion();
            return null;
        }
    }

    return response;
};

/* ================================
   🌐 GET
================================ */
export const get = async (endpoint) => {
    try {
        const response = await apiFetch(endpoint, {
            method: 'GET'
        });

        return response ? await response.json() : null;
    } catch (err) {
        console.error('Error en GET:', err);
        return null;
    }
};

/* ================================
   📥 POST
================================ */
export const post = async (endpoint, datos) => {
    try {
        const response = await apiFetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        return response ? await response.json() : null;
    } catch (err) {
        console.error('Error en POST:', err);
        return null;
    }
};

/* ================================
   ✏️ PATCH
================================ */
export const patch = async (endpoint, datos) => {
    try {
        const response = await apiFetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        return response ? await response.json() : null;
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
        const response = await apiFetch(endpoint, {
            method: 'DELETE'
        });

        return response ? await response.json() : null;
    } catch (err) {
        console.error('Error en DELETE:', err);
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

        const response = await apiFetch(endpoint, {
            method: 'POST',
            body: formData
        });

        return response ? await response.json() : null;
    } catch (err) {
        console.error('Error en POST FILE:', err);
        return null;
    }
};

/* ================================
   📤 EXPORT FILE
================================ */
export const exportFile = async (endpoint) => {
    try {
        const response = await apiFetch(endpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        return await response.blob();
    } catch (err) {
        console.error('Error exportando archivo:', err);
        throw err;
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