
const url = "http://localhost:8000/api/"

export const get = async (endpoint, params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${url}${endpoint}${queryString}`, {
            // headers: await getAuthHeaders()
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Error en GET:", data?.error || "Error desconocido");
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error en GET:", error);
        return null;
    }
};

export const post = async (endpoint, data) => {
    try {
        const response = await fetch(`${url}${endpoint}`, {
            // method: 'POST',
            // headers: await getAuthHeaders(),
            // body: JSON.stringify(data)
        });
        const responseData = await response.json();

        return {
            ok: response.ok,
            message: responseData.message || "",
            errors: responseData.erros || [],
            data: responseData.data || null
        };

    } catch (error) {
        console.error("Error en POST:", error);
        return { ok: false, message: "Error inesperado", errors: [], data: null };
    }
};


export const login = async (documento, contrasena) => {
    try {
        const response = await fetch(`${url}/api/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documento, contrasena })
        });

        const data = await response.json();
        return {
            ok: response.ok,
            message: data.message || "",
            errors: data.erros || [],
            data: data.data || null,
            token: data.token || null
        };

    } catch (error) {
        console.error("Error en login:", error);
        return { ok: false, message: "Error inesperado al iniciar sesión", errors: [], data: null, token: null };
    }
};