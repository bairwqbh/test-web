import axios from 'axios';
import {Common} from 'cby.assist';
import ElementUI from 'element-ui';
import config from '@/config';
import router from '@/router';

//axios默认配置
if (config && config.baseUrl) {
    axios.defaults.baseURL = config.baseUrl;
}
axios.defaults.timeout = 1000 * 60 * 10;
axios.defaults.validateStatus = status => status >= 200 && status <= 500;
axios.defaults.withCredentials = true;

let loading = null;

//HTTPrequest拦截
axios.interceptors.request.use(request => {
    request.headers.token = Common.getCookie('token');
    if (loading !== false) {
        loading = ElementUI.Loading.service({background: 'rgba(255, 255, 255, 0.1)'});
    }
    return request;
}, error => Promise.reject(error));

//HTTPresponse拦截
axios.interceptors.response.use(response => {
    if (loading) {
        loading.close();
    }
    if (Number(response.status) !== 200) {
        return Promise.reject(new Error(response.statusText || '未知错误'));
    }
    const data = response.data;
    if (!data || data.code === undefined) {
        return data;
    }
    const code = Number(data.code);
    if (code !== 0) {
        const message = data.message || '未知错误';
        if (code === 2 || code === 3) {
            router.push('/login');
            return false;
        } else {
            ElementUI.Message({
                type: 'error',
                message: message,
            });
        }
        return Promise.reject(new Error(message));
    }
    return data.data;
}, error => {
    if (loading) {
        loading.close();
    }
    return Promise.reject(new Error(error));
});

export default axios;