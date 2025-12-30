import homeController from "../Views/home/homeController.js"
import Registercontroller from "../Views/auth/register/registercontroller.js" 
import codePasswordController from "../Views/auth/verify-code/codePasswordController.js"
import passwordControllerjs from "../Views/auth/password-code/DocumentController.js"
import resetController from "../Views/auth/reset-password/resetController.js"
import logincontroller from "../Views/auth/login/logincontroller.js"
import dashboardController from "../Views/auth/dashboard/dashboardController.js"
import schedulesController from "../Views/auth/schedules/schedulesController.js"
import shiftsController from "../Views/auth/shifts/shiftsController.js"

export const routes = {
    Home: {
        path: "home/index.html",
        controller: homeController,
        private: false
    },
    Register: {
        path: "auth/register/index.html",
        controller: Registercontroller,
        private: false
    },
    Login: {
        path: "auth/login/index.html",
        controller: logincontroller,
        private: false
    },
    Reset: {
        path: "auth/password-code/index.html",
        controller: passwordControllerjs,
        private: false
    },
    Verifycode: {
        path: "auth/verify-code/index.html",
        controller: codePasswordController,
        private: false
    },
    ResetPassword: {
        path: "auth/reset-password/index.html",
        controller: resetController,
        private: false
    },
    Dashboard: {
        path: "auth/dashboard/index.html",
        controller: dashboardController,
        private: false
    },
    Horarios: {
        path: "auth/schedules/index.html",
        controller: schedulesController,
        private: false
    },
    Jornadas:{
        path:"auth/shifts/index.html",
        controller: shiftsController,
        private:false
    }
}

