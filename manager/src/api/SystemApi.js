import axios from 'axios';
import config from '@/config';

/**
 * 系统接口
 */
export default class {

    /**
     * 当前会话是否在线
     * 
     * @return 请求对象
     */
    static isAuthen() {
        return axios.get('/authen/isAuthen');
    }

    /**
     * 用户登录服务
     * 
     * @param data
     *            登录信息
     * @return 请求对象
     */
    static login(data) {
        return axios.post('/authen/login', data);
    }

    /**
     * 退出当前会话登录
     * 
     * @return 请求对象
     */
    static logout() {
        return axios.delete('/authen/logout');
    }

    /**
     * 获取当前会话认证信息
     * 
     * @return 请求对象
     */
    static info() {
        return axios.get('/authen/info');
    }

    /**
     * 用户密码修改
     * 
     * @param data
     *            密码修改信息
     * @return 请求对象
     */
    static modPwd(data) {
        return axios.put('/authen/modPwd', data);
    }

    /**
     * 根据条件获取功能菜单树
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static menu(params) {
        return axios.get(`${config.basePath}/func/menu`, {params});
    }

    /**
     * 查询业务字典全集
     * 
     * @return 请求对象
     */
    static dict() {
        return axios.get(`${config.basePath}/dict/tree`);
    }

    /**
     * 反向代理
     * 
     * @param option
     *            代理请求项
     * @return 请求对象
     */
    static proxy(option) {
        option.url = `/proxy/${option.url}`;
        return axios(option);
    }

};
