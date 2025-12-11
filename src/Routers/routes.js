import homeController from "../Views/Home/homeController"
import logincontroller from "../Views/Login/logincontroller"
import Registercontroller from "../Views/register/Registercontroller"
import resetcontroller from "../Views/password/resetcontroller"

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
        controller: resetcontroller,
        private: false
    }

}

