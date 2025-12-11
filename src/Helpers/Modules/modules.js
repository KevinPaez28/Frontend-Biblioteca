// Teclas especiales permitidas
const teclasEspeciales = [
  "Backspace",
  "Tab",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "Delete",
];

// ================== VALIDACIONES DE TECLADO ==================

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
  const regex = /^[0-9]$/;

  if (!regex.test(key) && !teclasEspeciales.includes(key)) {
    event.preventDefault();
  }
};

// Máximo de caracteres
export const validarMaximo = (event, maximo) => {
  const key = event.key;
  if (!teclasEspeciales.includes(key) && event.target.value.length >= maximo) {
    event.preventDefault();
  }
};

// Mínimo de caracteres
export const validarMinimo = (event, minimo) => {
  const valor = event.target.value.trim();
  if (valor.length < minimo) {
    event.target.classList.add('error'); // Opcional: agregar clase CSS
  } else {
    event.target.classList.remove('error'); // Quitar clase si cumple
  }
};

// ================== ERRORES GENÉRICOS ==================

// Validar campo vacío / select sin opción
export const validarCampo = (event) => {
  const campo = event.target;
  const campoContenedor = campo.closest(".form__grupo");

  if (
    ((campo.tagName === "INPUT" || campo.tagName === "TEXTAREA") &&
      campo.value.trim() === "") ||
    (campo.tagName === "SELECT" && campo.selectedIndex === 0)
  ) {
    agregarError(campoContenedor);
    return false;
  }

  quitarError(campoContenedor);
  return true;
};

// Agregar error
export const agregarError = (
  campoContenedor,
  mensaje = "El campo es obligatorio."
) => {
  if (!campoContenedor) return;
  campoContenedor.classList.add("error");
  campoContenedor.style.setProperty("--error-message", `'${mensaje}'`);
};

// Quitar error
export const quitarError = (campoContenedor) => {
  if (!campoContenedor) return;
  campoContenedor.classList.remove("error");
};

// ================== VALIDACIÓN ESPECÍFICA: CORREO ==================
export const validarCorreo = (e) => {
  const correo = e.target;
  const campoContenedor = correo.closest(".form__grupo");
  const valor = correo.value.trim();

  const regexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (valor === "") {
    agregarError(campoContenedor, "El campo es obligatorio");
    return false;
  }

  if (!regexp.test(valor)) {
    agregarError(campoContenedor, "Formato de correo inválido");
    return false;
  }

  quitarError(campoContenedor);
  return true;
};

// ================== VALIDACIÓN ESPECÍFICA: CONTRASEÑA ==================
export const validarPassword = (e) => {
  const contrasena = e.target;
  const campoContenedor = contrasena.closest(".form__grupo");
  const valor = contrasena.value;

  const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!/[A-Z]/.test(valor)) {
    agregarError(campoContenedor, "Debe tener una mayúscula");
    return false;
  }

  if (!/[a-z]/.test(valor)) {
    agregarError(campoContenedor, "Debe tener una minúscula");
    return false;
  }

  if (!/\d/.test(valor)) {
    agregarError(campoContenedor, "Debe tener un número");
    return false;
  }

  if (!/[\W_]/.test(valor)) {
    agregarError(campoContenedor, "Debe tener un caracter especial");
    return false;
  }

  if (!/^.{8,}$/.test(valor)) {
    agregarError(campoContenedor, "Mínimo 8 caracteres");
    return false;
  }

  if (!regexp.test(valor)) {
    agregarError(campoContenedor, "Formato inválido");
    return false;
  }

  quitarError(campoContenedor);
  return true;
};

// Validar password en login
export const validarPasswordLogin = (e) => {
  const campo = e.target;
  const contenedor = campo.closest(".form__grupo");
  const valor = campo.value.trim();

  if (valor === "") {
    agregarError(contenedor, "La contraseña es obligatoria");
    return false;
  }

  quitarError(contenedor);
  return true;
};


// ================== VALIDAR FORMULARIO COMPLETO ==================
export let datos = null;

export const validarCampos = (event, contexto = null) => {
  let valido = true;
  datos = {};

  // Tomar todos los campos INPUT, TEXTAREA y SELECT (no solo required)
  const campos = [...event.target].filter(
    (elemento) =>
      elemento.tagName === "INPUT" ||
      elemento.tagName === "TEXTAREA" ||
      elemento.tagName === "SELECT"
  );

  campos.forEach((campo) => {
    const nombre = campo.name;
    const valor = campo.value.trim();

    // Validaciones específicas
    if (campo.type === "email") {
      valido = validarCorreo({ target: campo }) && valido;
    }

    if (campo.type === "password") {
      if(contexto === "login"){
        valido = validarPasswordLogin({ target: campo }) && valido;
      }else{
        valido = validarPassword({ target: campo }) && valido;
      }
    }


    // Validación de vacío solo si es required
    if (campo.hasAttribute("required")) {
      const okCampo = validarCampo({ target: campo });
      if (!okCampo) valido = false;
    }

    // Guardar datos limpios
    if (nombre === "documento" || nombre === "telefono") {
      datos[nombre] = valor; // siempre string
    } else if (!isNaN(valor) && valor !== "") {
      datos[nombre] = Number(valor); // otros campos numéricos sí se convierten
    } else {
      datos[nombre] = valor; // texto o select aunque no sea requerido
    }
  });

  return valido;
};
