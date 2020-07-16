import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 组织机构接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/org';
    }

    /**
     * 查询组织机构树状数据
     * 
     * @param parentId
     *            上级机构编号
     * @return 请求对象
     */
    static tree(parentId) {
        return axios.get(`${this.basePath()}/tree`, {params: {parentId}});
    }

    /**
     * 组织机构上移
     * 
     * @param data
     *            组织机构信息
     * @return 请求对象
     */
    static up(data) {
        return axios.put(`${this.basePath()}/up`, data);
    }

    /**
     * 组织机构下移
     * 
     * @param data
     *            组织机构信息
     * @return 请求对象
     */
    static down(data) {
        return axios.put(`${this.basePath()}/down`, data);
    }

};
