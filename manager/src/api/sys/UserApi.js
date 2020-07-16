import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 用户信息接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/user';
    }

    /**
     * 获取用户信息
     * 
     * @param userId
     *            用户编号
     * @return 请求对象
     */
    static getUser(userId) {
        return axios.get(`${this.basePath()}/getUser`, {params: {userId}});
    }

    /**
     * 获取用户角色列表
     * 
     * @param userId
     *            用户编号
     * @return 请求对象
     */
    static getRoles(userId) {
        return axios.get(`${this.basePath()}/getRoles`, {params: {userId}});
    }

    /**
     * 获取用户权限列表
     * 
     * @param userId
     *            用户编号
     * @return 请求对象
     */
    static getAuths(userId) {
        return axios.get(`${this.basePath()}/getAuths`, {params: {userId}});
    }

    /**
     * 获取用户接口列表
     * 
     * @param userId
     *            用户编号
     * @return 请求对象
     */
    static getApis(userId) {
        return axios.get(`${this.basePath()}/getApis`, {params: {userId}});
    }

    /**
     * 重置用户密码
     * 
     * @param data
     *            用户信息
     * @return 请求对象
     */
    static resetPwd(data) {
        return axios.put(`${this.basePath()}/resetPwd`, data);
    }

};
