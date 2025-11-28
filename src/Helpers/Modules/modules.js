
const teclasEspeciales = ["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Delete"];

export const validarTexto = (event) => {
  const key = event.key;
  const regex = /^[\D]*$/i;

  if (!regex.test(key) && !teclasEspeciales.includes(key)) { 

    event.preventDefault();
  }
};

export const validarNumeros = (event) => {
    const key = event.key;
    const regex = /^[\d]*$/i;

    if (!regex.test(key) && !teclasEspeciales.includes(key)) { 

        event.preventDefault();
    }
}

export const validarCampo = (event) => {

  let campo = event.target;

  if (((campo.tagName == "INPUT" || campo.tagName == "TEXTAREA") && campo.value.trim() == "") || (campo.tagName == "SELECT" && campo.selectedIndex == 0)) {
    agregarError(campo.parentElement);
    return false;
  }

  if (campo.parentElement.className.includes('error'))
    quitarError(campo.parentElement);

  return true;
};

export const agregarError = (campo, mensaje = "El campo es obligatorio.") => {
  campo.classList.add('error');
  campo.style.setProperty('--error-message', `"${mensaje}"`);
};


export const quitarError = (campo) => {
  campo.classList.remove('error');
};

export const validarMaximo = (event, maximo) => {
  const key = event.key;
  if (!teclasEspeciales.includes(key) && event.target.value.length >= maximo) event.preventDefault(); 
};

export const validarCorreo = (e) => {

  let correo = e.target;

  const regexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if(!regexp.test(correo.value))    {
    agregarError(correo.parentElement, 'Formato de correo inválido');
    return false;
  } 

  if (correo.parentElement.className.includes('error'))
    quitarError(correo.parentElement);
  return true;

}

export const validarPassword = (e) => {

  const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  let contrasena = e.target;
  
  if(!/[A-Z]/.test(contrasena.value))    {
    agregarError(contrasena.parentElement, 'Debe tener una mayúscula');
    return false;
  } 

  if(!/[a-z]/.test(contrasena.value))    {
    agregarError(contrasena.parentElement, 'Debe tener una minúscula');
    return false;
  } 

  if(!/\d/.test(contrasena.value))    {
    agregarError(contrasena.parentElement, 'Debe tener un número');
    return false;
  } 

  if(!/\W/.test(contrasena.value))    {
    agregarError(contrasena.parentElement, 'Debe tener un caracter especial');
    return false;
  } 

  if(!/^.{8,}$/.test(contrasena.value))    {
    agregarError(contrasena.parentElement, 'Mínimo 8 caracteres');
    return false;
  } 

  if(!regexp.test(contrasena.value)) {
    agregarError(contrasena.parentElement, 'Formato inválido');
    return false;
  }

  if (contrasena.parentElement.className.includes('error'))
    quitarError(contrasena.parentElement);
  return true;
}

export let datos = null;
export const validarCampos = (event) => {

  let valido = true;
  datos = {};

  const campos = [...event.target].filter((elemento) => elemento.hasAttribute("required") && (elemento.tagName == "INPUT" || elemento.tagName == "TEXTAREA" || elemento.tagName == "SELECT") || elemento.value);

  campos.forEach((campo) => {
    
    if(campo.type == "email") valido = validarCorreo({ target: campo });
    if(campo.type == "password") valido = validarPassword({ target: campo });
    
    if (!validarCampo({ target: campo })) valido = false;

    if(!isNaN(campo.value)) 
        datos[campo.getAttribute("name")] = Number(campo.value.trim());
    else 
        datos[campo.getAttribute("name")] = campo.value.trim();
  });

  
  return valido;
};
