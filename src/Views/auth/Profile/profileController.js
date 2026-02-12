import "../../../Styles/Profile/profile.css";
import { get } from "../../../Helpers/api.js";
import { showSpinner, hideSpinner } from "../../../Helpers/spinner.js";
import { tienePermiso } from "../../../helpers/auth.js";
import { editUserModal } from "./editProfile/editprofile.js";
import { abrirModalCambiarPassword } from "./Reset_password/resetController.js";

/**
 * @description This function is the main entry point for the profile page.
 * It fetches the user's profile data, renders it, and sets up event listeners for interacting with the profile.
 */
export default async () => {
  // Get references to DOM elements
  const contenedor = document.querySelector(".contenido-dashboard"); // Main content container
  const btnEditar = document.getElementById("btnEditarPerfil"); // Button to edit the profile
  const linkCambiarPass = document.getElementById("perfil-cambiar-pass"); // Link to change the password

  // Object containing references to the profile data display fields
  const camposPerfil = {
    documento: document.getElementById("perfil-documento"),
    nombres: document.getElementById("perfil-nombres"),
    apellidos: document.getElementById("perfil-apellidos"),
    correo: document.getElementById("perfil-correo"),
    telefono: document.getElementById("perfil-telefono"),
  };

  // Check if the user has permission to update user profiles
  if (!tienePermiso("users.update") && btnEditar) {
    // If the user doesn't have permission, hide the edit button
    btnEditar.style.display = "none";
  }

  /**
   * @description Function to load the user's profile data from the API and display it on the page.
   */
  const cargarPerfil = async () => {
    try {
      // Show a loading spinner while fetching data
      showSpinner(contenedor);

      // Get the user ID from local storage
      const userId = localStorage.getItem("user_id");
      // Fetch the user's profile data from the API
      const res = await get(`user/profile/${userId}`);
      const data = res.data;

      // Add an event listener to the edit button to open the edit modal
      btnEditar?.addEventListener("click", () => {
        editUserModal(data);
      });

      // Add an event listener to the change password link to open the change password modal
      linkCambiarPass?.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the default link behavior
        abrirModalCambiarPassword(data);
      });

      // If the profile data is available, display it in the corresponding fields
      if (data) {
        camposPerfil.documento.textContent = data.document || "-";
        camposPerfil.nombres.textContent = data.first_name || "-";
        camposPerfil.apellidos.textContent = data.last_name || "-";
        camposPerfil.correo.textContent = data.email || "-";
        camposPerfil.telefono.textContent = data.phone_number || "-";
      }
    } catch (error) {
      // Log any errors that occur during the profile loading process
      console.error("Error cargando perfil:", error);
    } finally {
      // Hide the loading spinner, regardless of whether the profile loaded successfully
      hideSpinner(contenedor);
    }
  };

  // Call the function to load the profile data when the page loads
  await cargarPerfil();
};
