
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
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        // Manejar errores HTTP como 422
        if (!response.ok) {
            return {
                success: false,
                message: responseData.message || "Error desconocido",
                errors: responseData.errors || [],
                data: null
            };
        }

        return {
            success: true,
            message: responseData.message || "",
            errors: responseData.errors || [],
            data: responseData.data || null
        };

    } catch (error) {
        console.error("Error en POST:", error);
        return { success: false, message: "Error inesperado", errors: [], data: null };
    }
};



export const login = async (documento, contrasena) => {
    try {
        const response = await fetch(`${url}user/login`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ documento, contrasena })
        });

        const data = await response.json();

        return {
            ok: response.ok,
            message: data.message || "",
            errors: data.errors || [],  
            data: data.data || null,
            token: data.token || null
        };

    } catch (error) {
        console.error("Error en login:", error);
        return {
            ok: false,
            message: "Error inesperado al iniciar sesión",
            errors: [],
            data: null,
            token: null
        };
    }
};
