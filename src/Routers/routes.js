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
  }

};
