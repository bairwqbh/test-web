import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 功能接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/func';
    }

    /**
     * 功能上移
     * 
     * @param data
     *            功能信息
     * @return 请求对象
     */
    static up(data) {
        return axios.put(`${this.basePath()}/up`, data);
    }

    /**
     * 功能下移
     * 
     * @param data
     *            功能信息
     * @return 请求对象
     */
    static down(data) {
        return axios.put(`${this.basePath()}/down`, data);
    }

    /**
     * 根据条件获取功能树
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static tree(params) {
        return axios.get(`${this.basePath()}/tree`, {params});
    }

    /**
     * 根据条件获取功能菜单树
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static menu(params) {
        return axios.get(`${this.basePath()}/menu`, {params});
    }

};
