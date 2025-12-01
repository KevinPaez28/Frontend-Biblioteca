import homeController from "../Views/Home/homeController"
import Registercontroller from "../Views/register/Registercontroller"


export const routes = {
    Home:{
        path: "Home/index.html",
        controller: homeController,
        private: false
    },
    Register:{
        path:"register/index.html",
        controller: Registercontroller,
        private: false
    }
}

