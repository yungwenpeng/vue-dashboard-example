import Axios from 'axios';
import { ElMessage } from 'element-plus';

export const serverConfig = {
    localhost: 'localhost',
    port: '9090',
};

const baseURL = 'http://' + serverConfig.localhost + ':' + serverConfig.port;

const axios = Axios.create({
    baseURL,
    //timeout: 20000,
});

axios.interceptors.request.use(
    (response) => {
        //console.log('Axios request.use:', response);
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        //console.log('Axios response.use:', response);
        return response;
    },
    (error) => {
        if (error.response && error.response.data) {
            const code = error.response.status;
            const msg = error.response.data.message;
            ElMessage.error(`Code: ${code}, Message: ${msg}`);
            console.error(`[Axios Error]`, error.response);
        } else {
            ElMessage.error(`${error}`);
        }
        return Promise.reject(error);
    }
);

export default axios;