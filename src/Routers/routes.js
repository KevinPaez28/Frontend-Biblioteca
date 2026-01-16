// ================= CONTROLADORES =================
import homeController from "../Views/home/homeController.js";
import Registercontroller from "../Views/auth/register/registercontroller.js";
import logincontroller from "../Views/auth/login/logincontroller.js";
import passwordControllerjs from "../Views/auth/password-code/DocumentController.js";
import codePasswordController from "../Views/auth/verify-code/codePasswordController.js";
import resetController from "../Views/auth/reset-password/resetController.js";
import dashboardController from "../Views/auth/dashboard/dashboardController.js";
import schedulesController from "../Views/auth/schedules/schedulesController.js";
import shiftsController from "../Views/auth/shifts/shiftsController.js";
import AssitancessController from "../Views/auth/Assitances/AssitancessController.js";
import ReasonController from "../Views/auth/Reasons/ReasonController.js";
import roomsController from "../Views/auth/Rooms/roomsController.js";
import eventsController from "../Views/auth/Events/eventsController.js";
import UsersController from "../Views/auth/Users/UsersController.js";
import ApprenticesController from "../Views/auth/Apprentices/ApprenticesController.js";
import FichasController from "../Views/auth/Fichas/FichasController.js";
import ProgramsController from "../Views/auth/Programs/ProgramsController.js";
import AssitanceController from "../Views/auth/EventAssistance/AssitanceController.js";
// ================= RUTAS =================
export const routes = {

  // ==== HOME ====
  Home: {
    path: "home/index.html",
    controller: homeController,
    meta: { public: true }
  },

  // ==== AUTH ====
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

  // ==== DASHBOARD ====
  Dashboard: {
    path: "auth/dashboard/index.html",
    controller: dashboardController,
    meta: { can: "auth.login" }
  },

  // ==== HORARIOS ====
  Horarios: {
    path: "auth/schedules/index.html",
    controller: schedulesController,
    meta: { can: "schedules.index" }
  },

  // ==== JORNADAS ====
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
  }

};
