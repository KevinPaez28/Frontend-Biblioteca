import { cerrarTodos } from './modalManagement.js';
import { error } from './alertas.js';

const url = `${import.meta.env.VITE_API_URL}/api/`;

let refreshing = false;
let refreshPromise = null;

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

    if (refreshing) {
        return refreshPromise;
    }

    refreshing = true;

    refreshPromise = fetch(`${url}refresh-token`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(res => {
        refreshing = false;

        if (!res.ok) {
            cerrarSesion();
            throw new Error("Refresh token inválido");
        }

        return res;
    })
    .catch(err => {
        refreshing = false;
        cerrarSesion();
        throw err;
    });

    return refreshPromise;
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

        try {

            await refreshToken();

            response = await fetch(`${url}${endpoint}`, {
                ...options,
                credentials: 'include'
            });

        } catch (err) {

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

    const response = await apiFetch(endpoint, {
        method: 'GET'
    });

    return response ? await response.json() : null;
};

/* ================================
   📥 POST
================================ */
export const post = async (endpoint, datos) => {

    const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    return response ? await response.json() : null;
};

/* ================================
   ✏️ PATCH
================================ */
export const patch = async (endpoint, datos) => {

    const response = await apiFetch(endpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    return response ? await response.json() : null;
};

/* ================================
   🗑️ DELETE
================================ */
export const delet = async (endpoint) => {

    const response = await apiFetch(endpoint, {
        method: 'DELETE'
    });

    return response ? await response.json() : null;
};

/* ================================
   📎 POST FILE
================================ */
export const postFile = async (endpoint, file) => {

    const formData = new FormData();
    formData.append("file", file);

    const response = await apiFetch(endpoint, {
        method: 'POST',
        body: formData
    });

    return response ? await response.json() : null;
};

/* ================================
   📤 EXPORT FILE
================================ */
export const exportFile = async (endpoint) => {

    const response = await apiFetch(endpoint, {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.blob();
};

/* ================================
   🔐 LOGIN
================================ */
export const login = async (content) => {

    const response = await fetch(`${url}login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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
};