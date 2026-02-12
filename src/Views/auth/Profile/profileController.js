import "../../../Styles/Profile/profile.css";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { editUserModal } from "./editProfile/editprofile.js";
import { abrirModalCambiarPassword } from "./Reset_password/resetController.js";

/**
 * @description Esta función es el punto de entrada principal para la página de perfil.
 * Obtiene los datos del perfil del usuario, los renderiza y establece los listeners de eventos para interactuar con el perfil.
 */
export default async () => {
  // Obtiene referencias a los elementos del DOM
  const contenedor = document.querySelector(".contenido-dashboard"); // Contenedor principal del contenido
  const btnEditar = document.getElementById("btnEditarPerfil"); // Botón para editar el perfil
  const linkCambiarPass = document.getElementById("perfil-cambiar-pass"); // Enlace para cambiar la contraseña

  // Objeto que contiene referencias a los campos de visualización de datos del perfil
  const camposPerfil = {
    documento: document.getElementById("perfil-documento"),
    nombres: document.getElementById("perfil-nombres"),
    apellidos: document.getElementById("perfil-apellidos"),
    correo: document.getElementById("perfil-correo"),
    telefono: document.getElementById("perfil-telefono"),
  };

  // Comprueba si el usuario tiene permiso para actualizar los perfiles de usuario
  if (!tienePermiso("users.update") && btnEditar) {
    // Si el usuario no tiene permiso, oculta el botón de edición
    btnEditar.style.display = "none";
  }

  /**
   * @description Función para cargar los datos del perfil del usuario desde la API y mostrarlos en la página.
   */
  const cargarPerfil = async () => {
    try {
      // Muestra un spinner de carga mientras se obtienen los datos
      showSpinner(contenedor);

      // Obtiene el ID del usuario del almacenamiento local
      const userId = localStorage.getItem("user_id");
      // Obtiene los datos del perfil del usuario desde la API
      const res = await get(`user/profile/${userId}`);
      const data = res.data;

      // Agrega un listener de eventos al botón de edición para abrir el modal de edición
      btnEditar?.addEventListener("click", () => {
        editUserModal(data);
      });

      // Agrega un listener de eventos al enlace de cambio de contraseña para abrir el modal de cambio de contraseña
      linkCambiarPass?.addEventListener("click", (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del enlace
        abrirModalCambiarPassword(data);
      });

      // Si los datos del perfil están disponibles, los muestra en los campos correspondientes
      if (data) {
        camposPerfil.documento.textContent = data.document || "-";
        camposPerfil.nombres.textContent = data.first_name || "-";
        camposPerfil.apellidos.textContent = data.last_name || "-";
        camposPerfil.correo.textContent = data.email || "-";
        camposPerfil.telefono.textContent = data.phone_number || "-";
      }
    } catch (error) {
      // Registra cualquier error que ocurra durante el proceso de carga del perfil
      console.error("Error cargando perfil:", error);
    } finally {
      // Oculta el spinner de carga, independientemente de si el perfil se cargó correctamente
      hideSpinner(contenedor);
    }
  };

  // Llama a la función para cargar los datos del perfil cuando se carga la página
  await cargarPerfil();
};
