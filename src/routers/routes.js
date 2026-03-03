// ================= CONTROLADORES =================
import homeController from "@views/home/homeController.js";
import Registercontroller from "@views/auth/register/registercontroller.js";
import logincontroller from "@views/auth/login/logincontroller.js";
import passwordControllerjs from "@views/auth/password-code/DocumentController.js";
import codePasswordController from "@views/auth/verify-code/codePasswordController.js";
import resetController from "@views/auth/reset-password/resetController.js";
import dashboardController from "@views/auth/dashboard/dashboardController.js";
import schedulesController from "@views/auth/schedules/schedulesController.js";
import shiftsController from "@views/auth/shifts/shiftsController.js";
import AssitancessController from "@views/auth/assitances/AssitancessController.js";
import ReasonController from "@views/auth/reasons/ReasonController.js";
import roomsController from "@views/auth/rooms/roomsController.js";
import eventsController from "@views/auth/events/eventsController.js";
import UsersController from "@views/auth/users/UsersController.js";
import ApprenticesController from "@views/auth/apprentices/ApprenticesController.js";
import FichasController from "@views/auth/fichas/FichasController.js";
import ProgramsController from "@views/auth/programs/ProgramsController.js";
import AssitanceController from "@views/auth/eventAssistance/AssitanceController.js";
import rolescontroller from "@views/auth/roles/rolescontroller.js";
import HistoriesController from "@views/auth/histories/HistoriesController.js";
import asistenciaController from "@views/asistencia/asistenciaController.js";
import profileController from "@views/auth/profile/profileController.js";

// Nota: normaliza nombres de hash a minúscula para evitar #/Home vs home
export const routes = {
  home: {
    view: "home/index.html",
    controller: homeController,
    meta: { public: true }
  },

  asistencia: {
    view: "asistencia/index.html",
    controller: asistenciaController,
    meta: { public: true }
  },

  login: {
    view: "auth/login/index.html",
    controller: logincontroller,
    meta: { public: true }
  },

  register: {
    view: "auth/register/index.html",
    controller: Registercontroller,
    meta: { public: true, noLayout: true }
  },

  reset: {
    view: "auth/password-code/index.html",
    controller: passwordControllerjs,
    meta: { public: true, noLayout: true }
  },

  verifycode: {
    view: "auth/verify-code/index.html",
    controller: codePasswordController,
    meta: { public: true, noLayout: true }
  },

  resetpassword: {
    view: "auth/reset-password/index.html",
    controller: resetController,
    meta: { public: true, noLayout: true }
  },

  dashboard: {
    view: "auth/dashboard/index.html",
    controller: dashboardController,
    meta: { can: "auth.login" }
  },

  horarios: {
    view: "auth/schedules/index.html",
    controller: schedulesController,
    meta: { can: "schedules.index" }
  },

  jornadas: {
    view: "auth/shifts/index.html",
    controller: shiftsController,
    meta: { can: "shifts.index" }
  },

  asistencias: {
    view: "auth/assitances/index.html",
    controller: AssitancessController,
    meta: { can: "assistances.index" }
  },

  motivos: {
    view: "auth/reasons/index.html",
    controller: ReasonController,
    meta: { can: "reasons.index" }
  },

  areas: {
    view: "auth/rooms/index.html",
    controller: roomsController,
    meta: { can: "rooms.index" }
  },

  eventos: {
    view: "auth/events/index.html",
    controller: eventsController,
    meta: { can: "events.index" }
  },

  usuarios: {
    view: "auth/users/index.html",
    controller: UsersController,
    meta: { can: "users.index" }
  },

  aprendices: {
    view: "auth/apprentices/index.html",
    controller: ApprenticesController,
    meta: { can: "users.index" }
  },

  programas: {
    view: "auth/programs/index.html",
    controller: ProgramsController,
    meta: { can: "programs.index" }
  },

  fichas: {
    view: "auth/fichas/index.html",
    controller: FichasController,
    meta: { can: "fichas.index" }
  },

  asistencia_eventos: {
    view: "auth/eventAssistance/index.html",
    controller: AssitanceController,
    meta: { can: "assistances.index" }
  },

  roles: {
    view: "auth/roles/index.html",
    controller: rolescontroller,
    meta: { can: "roles.index" }
  },

  historial: {
    view: "auth/histories/index.html",
    controller: HistoriesController,
    meta: { can: "history.index" }
  },

  perfil: {
    view: "auth/profile/index.html",
    controller: profileController,
    meta: { can: "history.index" }
  }
};
