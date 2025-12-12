import homeController from "../Views/Home/homeController"
import logincontroller from "../Views/Login/logincontroller"
import Registercontroller from "../Views/register/Registercontroller"
import codePasswordController from "../Views/CodePassword/codePasswordController"
import passwordControllerjs from "../Views/password/DocumentController.js"
import resetController from "../Views/ResetPassword/resetController"

export const routes = {
    Home: {
        path: "Home/index.html",
        controller: homeController,
        private: false
    },
    Register: {
        path: "register/index.html",
        controller: Registercontroller,
        private: false
    },
    Login: {
        path: "Login/index.html",
        controller: logincontroller,
        private: false
    },
    Reset: {
        path: "password/index.html",
        controller: passwordControllerjs,
        private: false
    },
    Resetcode: {
        path: "CodePassword/index.html",
        controller: codePasswordController,
        private: false
    },
    ResetPassword: {
        path: "ResetPassword/index.html",
        controller: resetController,
        private: false
    }
    
}

