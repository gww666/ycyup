import axios from "axios";
import {message} from "ant-design-vue";


export const AUTO_LOGIN = "/api/autoLogin";
export const LOGIN = "/api/login";
export const TODO = "/api/todo";
export const TODO_LIST = "/api/todoList";


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