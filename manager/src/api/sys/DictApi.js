import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 字典接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/dict';
    }

    /**
     * 查询字典树状数据
     * 
     * @return 请求对象
     */
    static tree() {
        return axios.get(`${this.basePath()}/tree`);
    }

    /**
     * 字典上移
     * 
     * @param data
     *            字典信息
     * @return 请求对象
     */
    static up(data) {
        return axios.put(`${this.basePath()}/up`, data);
    }

    /**
     * 字典下移
     * 
     * @param data
     *            字典信息
     * @return 请求对象
     */
    static down(data) {
        return axios.put(`${this.basePath()}/down`, data);
    }

    /**
     * 查询字典树状数据
     * 
     * @param parentId
     *            上级字典代码
     * @return 请求对象
     */
    static dictList(parentId) {
        return axios.get(`${this.basePath()}/dictList`, {params: {parentId}});
    }

    /**
     * 查询业务字典全集
     * 
     * @return 请求对象
     */
    static dictMap() {
        return axios.get(`${this.basePath()}/dictMap`);
    }

};
