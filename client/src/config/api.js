import axios from "axios";
import {message} from "ant-design-vue";


export const LOGIN = "/api/login";


export const mAxios = (options = {}) => {
    // let _options = {
    //     method: "post",
    //     ...options
    // };
    return axios(options);
}

export const handleData = (data) => {
    if (data.status === 200 && data.data.returnCode === 1) {
        return data.data.data;
    } else {
        message.open({
            content: data.data.message,
            duration: 2
        });
    }
}