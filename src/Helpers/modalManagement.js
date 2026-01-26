const app = document.querySelector('#app');
let modalesAbiertos = [];

/**
 * Muestra un modal con contenido HTML y devuelve la referencia
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

    return modal;
};

/**
 * Cierra un modal específico
 */
export const cerrarModal = (modal) => {
    if (!modal) return;
    modal.classList.add('animationEnd');

    setTimeout(() => {
        modal.close();
        app.removeChild(modal);

        const index = modalesAbiertos.indexOf(modal);
        if (index > -1) modalesAbiertos.splice(index, 1);

        // Mostrar último modal si hay
        const ultimo = modalesAbiertos[modalesAbiertos.length - 1];
        if (ultimo) ultimo.classList.remove('invisible');
    }, 100);
};

/**
 * Cierra todos los modales
 */
export const cerrarTodos = () => {
    modalesAbiertos.forEach(modal => {
        modal.close();
        app.removeChild(modal);
    });
    modalesAbiertos = [];
};
