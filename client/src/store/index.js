import Vuex from "vuex";
import Vue from "vue";
import {
    mAxios as axios,
    handleData,
    LOGIN
} from "../config/api";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        userInfo: null
    },
    mutations: {
        setUserInfo(state, info) {
            state.userInfo = info;
        }
    },
    actions: {
        async login({commit}, params) {
            let data = await axios({
                // url: "http://120.78.221.14:3343" + LOGIN,
                url: LOGIN,
                data: params,
                method: "post"
            });
            data = handleData(data);
            commit("setUserInfo", data[0]);
        }
    }
});