import Login from "../containers/Login";
import Home from "../containers/Home";
import Router from "vue-router";
import Vue from "vue";
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: "/",
            redirect: {
                path: "login"
            }
        },
        {
            path: "/login",
            component: Login
        },
        {
            path: "/home",
            component: Home
        },
    ]
});