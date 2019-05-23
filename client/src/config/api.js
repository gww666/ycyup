import axios from "axios";
import {message} from "ant-design-vue";
import router from "../routers";

export const BASE_URL = "http://120.78.221.14:3343";
export const AUTO_LOGIN = "/api/autoLogin";
export const LOGIN = "/api/login";
export const TODO = "/api/todo";
export const TODO_LIST = "/api/todoList";

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return {
        ...config,
        url: BASE_URL + config.url
    };
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    let {response} = error;
    if (response.status === 401) {
        //跳到登录页面
        router.push("/login");
        return Promise.reject(error);
    }
    
});
export const mAxios = (options = {}) => {
    return axios(options);
}

export const handleData = (data) => {
    if (data.data.returnCode === 0) {
        message.open({
            content: data.data.message,
            duration: 2
        });
    }
    return data.data;
}