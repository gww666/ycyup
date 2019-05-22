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
    if (data.status === 200 && data.data.returnCode === 1) {
        return data.data;
    } else {
        message.open({
            content: data.data.message,
            duration: 2
        });
        //返回后台包装的对象{message: "", returnCode: "", data: ""}
        return data.data;
    }
}