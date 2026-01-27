import "../../../Styles/Profile/profile.css";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { editUserModal } from "./editProfile/editprofile.js";

export default async () => {
  const contenedor = document.querySelector(".contenido-dashboard");
  const btnEditar = document.getElementById("btnEditarPerfil");

  // Campos del perfil
  const camposPerfil = {
    documento: document.getElementById("perfil-documento"),
    nombres: document.getElementById("perfil-nombres"),
    apellidos: document.getElementById("perfil-apellidos"),
    correo: document.getElementById("perfil-correo"),
    telefono: document.getElementById("perfil-telefono"),
  };

  // Ocultar botón si no tiene permiso de actualización
  if (!tienePermiso("users.update") && btnEditar) {
    btnEditar.style.display = "none";
  }

  // Función para cargar datos del perfil
  const cargarPerfil = async () => {
    try {
      showSpinner(contenedor);

      const userId = localStorage.getItem("user_id");
      const res = await get(`user/profile/${userId}`);
      const data = res.data;
    
      console.log(res);
      
      if (data) {
        camposPerfil.documento.textContent = data.document || "-";
        camposPerfil.nombres.textContent = data.first_name || "-";
        camposPerfil.apellidos.textContent = data.last_name || "-";
        camposPerfil.correo.textContent = data.email || "-";
        camposPerfil.telefono.textContent = data.phone_number || "-";
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      Object.values(camposPerfil).forEach((campo) => {
      });
    } finally {
      try {
        hideSpinner(contenedor);
      } catch (spinnerError) {
        console.error("Error al ocultar spinner:", spinnerError);
      }
    }
  };

    btnEditar.addEventListener("click", () => {
      editUserModal();
    });
  

  // INIT
  await cargarPerfil();
};
