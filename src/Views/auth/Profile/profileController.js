import "../../../Styles/Profile/profile.css";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { editUserModal } from "./editProfile/editprofile.js";
import { abrirModalCambiarPassword } from "./Reset_password/resetController.js"; 

export default async () => {
  const contenedor = document.querySelector(".contenido-dashboard");
  const btnEditar = document.getElementById("btnEditarPerfil");
  const linkCambiarPass = document.getElementById("perfil-cambiar-pass"); 
  const camposPerfil = {
    documento: document.getElementById("perfil-documento"),
    nombres: document.getElementById("perfil-nombres"),
    apellidos: document.getElementById("perfil-apellidos"),
    correo: document.getElementById("perfil-correo"),
    telefono: document.getElementById("perfil-telefono"),
  };

  if (!tienePermiso("users.update") && btnEditar) {
    btnEditar.style.display = "none";
  }

  const cargarPerfil = async () => {
    try {
      showSpinner(contenedor);

      const userId = localStorage.getItem("user_id");
      const res = await get(`user/profile/${userId}`);
      const data = res.data;

      btnEditar?.addEventListener("click", () => {
        editUserModal(data);
      });

      linkCambiarPass?.addEventListener("click", (e) => {
        e.preventDefault();
        abrirModalCambiarPassword(data);
      });

      if (data) {
        camposPerfil.documento.textContent = data.document || "-";
        camposPerfil.nombres.textContent = data.first_name || "-";
        camposPerfil.apellidos.textContent = data.last_name || "-";
        camposPerfil.correo.textContent = data.email || "-";
        camposPerfil.telefono.textContent = data.phone_number || "-";
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      hideSpinner(contenedor);
    }
  };

  await cargarPerfil();
};
