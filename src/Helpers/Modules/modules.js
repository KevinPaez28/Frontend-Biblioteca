const teclasEspeciales = ["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Delete"];

// Validar solo texto (sin números)
export const validarTexto = (event) => {
  const key = event.key;
  const regex = /^[\D]*$/i;

  if (!regex.test(key) && !teclasEspeciales.includes(key)) {
    event.preventDefault();
  }
};

// Validar solo números
export const validarNumeros = (event) => {
  const key = event.key;
  const regex = /^[\d]*$/i;

  if (!regex.test(key) && !teclasEspeciales.includes(key)) {
    event.preventDefault();
  }
};

// Validar campo vacío
export const validarCampo = (event) => {
  let campo = event.target;
  const campoContenedor = campo.closest('.form__grupo');

  if (
    ((campo.tagName === "INPUT" || campo.tagName === "TEXTAREA") && campo.value.trim() === "") ||
    (campo.tagName === "SELECT" && campo.selectedIndex === 0)
  ) {
    agregarError(campoContenedor);
    return false;
  }

  quitarError(campoContenedor);
  return true;
};

// Agregar error
export const agregarError = (campoContenedor, mensaje = "El campo es obligatorio.") => {
  if (!campoContenedor) return;
  campoContenedor.classList.add('error');
  campoContenedor.style.setProperty('--error-message', `"${mensaje}"`);
};

// Quitar error
export const quitarError = (campoContenedor) => {
  if (!campoContenedor) return;
  campoContenedor.classList.remove('error');
};

// Validar correo
export const validarCorreo = (e) => {
  const correo = e.target;
  const campoContenedor = correo.closest('.form__grupo');
  const regexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

  if (!regexp.test(correo.value)) {
    agregarError(campoContenedor, 'Formato de correo inválido');
    return false;
  }

  quitarError(campoContenedor);
  return true;
};

// Validar contraseña
export const validarPassword = (e) => {
  const contrasena = e.target;
  const campoContenedor = contrasena.closest('.form__grupo');
  const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!/[A-Z]/.test(contrasena.value)) {
    agregarError(campoContenedor, 'Debe tener una mayúscula');
    return false;
  }

  if (!/[a-z]/.test(contrasena.value)) {
    agregarError(campoContenedor, 'Debe tener una minúscula');
    return false;
  }

  if (!/\d/.test(contrasena.value)) {
    agregarError(campoContenedor, 'Debe tener un número');
    return false;
  }

  if (!/\W/.test(contrasena.value)) {
    agregarError(campoContenedor, 'Debe tener un caracter especial');
    return false;
  }

  if (!/^.{8,}$/.test(contrasena.value)) {
    agregarError(campoContenedor, 'Mínimo 8 caracteres');
    return false;
  }

  if (!regexp.test(contrasena.value)) {
    agregarError(campoContenedor, 'Formato inválido');
    return false;
  }

  quitarError(campoContenedor);
  return true;
};

// Validar todos los campos del formulario
export let datos = null;
export const validarCampos = (event) => {
  
  let valido = true;
  datos = {};

  const campos = [...event.target].filter(
    (elemento) =>
      elemento.hasAttribute("required") &&
      (elemento.tagName === "INPUT" || elemento.tagName === "TEXTAREA" || elemento.tagName === "SELECT") ||
      elemento.value
  );

  campos.forEach((campo) => {
    if (campo.type === "password") valido = validarPassword({ target: campo }) && valido;


    if (!validarCampo({ target: campo })) valido = false;

    if (!isNaN(campo.value)) datos[campo.getAttribute("name")] = Number(campo.value.trim());
    else datos[campo.getAttribute("name")] = campo.value.trim();

  });

  return valido;
};
