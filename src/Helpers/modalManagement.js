const app = document.querySelector('#app');
let modalesAbiertos = [];

/**
 * Muestra un modal con contenido HTML
 */
export const mostrarModal = (contenido) => {


    // Ocultar último modal si existe
    const ultimo = modalesAbiertos[modalesAbiertos.length - 1];
    if (ultimo) ultimo.classList.add('invisible');

    const modal = document.createElement('dialog');
    modal.classList.add('modal');

    modal.innerHTML = contenido;
    app.appendChild(modal);

    modalesAbiertos.push(modal);
    modal.showModal();

    requestAnimationFrame(() => {
        modal.classList.add('animationStart');
    });
};

/**
 * Cierra el modal actual
 */
export const cerrarModal = () => {
    if (modalesAbiertos.length === 0) return;

    const modal = modalesAbiertos.pop();
    modal.classList.add('animationEnd');

    setTimeout(() => {
        modal.close();
        app.removeChild(modal);

        const ultimo = modalesAbiertos[modalesAbiertos.length - 1];
        if (ultimo) ultimo.classList.remove('invisible');
    }, 300);
};

/**
 * Cierra TODOS los modales
 */
export const cerrarTodos = () => {
    modalesAbiertos.forEach(modal => {
        modal.close();
        app.removeChild(modal);
    });

    modalesAbiertos = [];
};
