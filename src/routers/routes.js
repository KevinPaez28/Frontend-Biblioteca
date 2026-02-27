// ================= CONTROLADORES =================
import homeController from "../../public/home/homeController.js";
import Registercontroller from "../../public/auth/register/registercontroller.js";
import logincontroller from "../../public/auth/login/logincontroller.js";
import passwordControllerjs from "../../public/auth/password-code/DocumentController.js";
import codePasswordController from "../../public/auth/verify-code/codePasswordController.js";
import resetController from "../../public/auth/reset-password/resetController.js";
import dashboardController from "../../public/auth/dashboard/dashboardController.js";
import schedulesController from "../../public/auth/schedules/schedulesController.js";
import shiftsController from "../../public/auth/shifts/shiftsController.js";
import AssitancessController from "../../public/auth/assitances/AssitancessController.js";
import ReasonController from "../../public/auth/reasons/ReasonController.js";
import roomsController from "../../public/auth/rooms/roomsController.js";
import eventsController from "../../public/auth/events/eventsController.js";
import UsersController from "../../public/auth/users/UsersController.js";
import ApprenticesController from "../../public/auth/apprentices/ApprenticesController.js";
import FichasController from "../../public/auth/fichas/FichasController.js";
import ProgramsController from "../../public/auth/programs/ProgramsController.js";
import AssitanceController from "../../public/auth/eventAssistance/AssitanceController.js";
import rolescontroller from "../../public/auth/roles/rolescontroller.js";
import HistoriesController from "../../public/auth/histories/HistoriesController.js";
import asistenciaController from "../../public/asistencia/asistenciaController.js";
import profileController from "../../public/auth/profile/profileController.js";
// ================= RUTAS =================
export const routes = {

  Home: {
    path: "home/index.html",
    controller: homeController,
    meta: { public: true }
  },

  Asistencia:{
    path: "Asistencia/index.html",
    controller: asistenciaController,
    meta: { public: true }
  },

  Login: {
    path: "auth/login/index.html",
    controller: logincontroller,
    meta: { public: true }
  },

  Register: {
    path: "auth/register/index.html",
    controller: Registercontroller,
    meta: { public: true, noLayout: true }
  },

  Reset: {
    path: "auth/password-code/index.html",
    controller: passwordControllerjs,
    meta: { public: true, noLayout: true }
  },

  Verifycode: {
    path: "auth/verify-code/index.html",
    controller: codePasswordController,
    meta: { public: true, noLayout: true }
  },

  ResetPassword: {
    path: "auth/reset-password/index.html",
    controller: resetController,
    meta: { public: true, noLayout: true }
  },

  Dashboard: {
    path: "auth/dashboard/index.html",
    controller: dashboardController,
    meta: { can: "auth.login" }
  },

  Horarios: {
    path: "auth/schedules/index.html",
    controller: schedulesController,
    meta: { can: "schedules.index" }
  },

  Jornadas: {
    path: "auth/shifts/index.html",
    controller: shiftsController,
    meta: { can: "shifts.index" }
  },

  Asistencias: {
    path: "auth/Assitances/index.html",
    controller: AssitancessController,
    meta: { can: "assistances.index" }
  },

  Motivos: {
    path: "auth/Reasons/index.html",
    controller: ReasonController,
    meta: { can: "reasons.index" }
  },

  Areas: {
    path: "auth/Rooms/index.html",
    controller: roomsController,
    meta: { can: "rooms.index" }
  },

  Eventos: {
    path: "auth/Events/index.html",
    controller: eventsController,
    meta: { can: "events.index" }
  },

  Usuarios: {
    path: "auth/Users/index.html",
    controller: UsersController,
    meta: { can: "users.index" }
  },

  Aprendices: {
    path: "auth/Apprentices/index.html",
    controller: ApprenticesController,
    meta: { can: "users.index" }
  },

  Programas: {
    path: "auth/Programs/index.html",
    controller: ProgramsController,
    meta: { can: "programs.index" }
  },

  Fichas: {
    path: "auth/Fichas/index.html",
    controller: FichasController,
    meta: { can: "fichas.index" }
  },

  Asistencia_Eventos: {
    path: "auth/EventAssistance/index.html",
    controller: AssitanceController,
    meta: { can: "assistances.index" }
  },

  Roles: {
    path: "auth/Roles/index.html",
    controller: rolescontroller,
    meta: { can: "roles.index" }
  },
  Historial: {
    path: "auth/Histories/index.html",
    controller: HistoriesController,
    meta: { can: "history.index" }
  },
  Perfil: {
    path: "auth/Profile/index.html",
    controller: profileController,
    meta: { can: "history.index" }
  },
  
};
