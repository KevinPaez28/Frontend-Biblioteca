export const getCookie = (name) => {
    const stringCookies = document.cookie; // obtiene todas las cookies
    const arrayCookies = stringCookies.split("; ");
    let cookie = null;

    arrayCookies.forEach((elemento) => {
        const [key, value] = elemento.split('=');
        if (key === name) cookie = value;
    });

    if (!cookie || cookie === "undefined" || cookie === "") return null;

    return decodeURIComponent(cookie);
};
