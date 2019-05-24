import Vuex from "vuex";
import Vue from "vue";
import {formatDate} from "../util";
import {
    mAxios as axios,
    handleData,
    LOGIN,
    AUTO_LOGIN,
    TODO,
    TODO_LIST
} from "../config/api";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        userInfo: null,
        todoList: []
    },
    getters: {
        todoListTrans: state => {
            return state.todoList.filter(item => item.state).map(item => {
                return {
                    ...item,
                    createDate: formatDate(item.createDate),
                    endDate: formatDate(item.endDate),
                }
            });
        }
    },
    mutations: {
        setUserInfo(state, info) {
            //存储到localStorage中
            if (info) {
                localStorage.setItem("sessionId", info.sessionId);
                state.userInfo = info;
            }
        },
        setTodoList(state, list) {
            state.todoList = list;
        }
    },
    actions: {
        async autoLogin({commit}, ) {
            let data = await axios({
                url: AUTO_LOGIN,
                method: "get"
            });
            data = handleData(data);
            commit("setUserInfo", data.data[0]);
            return data;
        },
        async login({commit}, params) {
            let data = await axios({
                url: LOGIN,
                data: params,
                method: "post"
            });
            data = handleData(data);
            commit("setUserInfo", data.data[0]);
            return data;
        },
        async todo({commit}, params) {
            let data = await axios({
                url: TODO,
                data: params,
                method: "post"
            });
            data = handleData(data);
        },
        //查询todo列表
        async todoList({commit}, params) {
            let data = await axios({
                url: TODO_LIST,
                params,
            });
            data = handleData(data);
            commit("setTodoList", data.data);
        }
    }
});