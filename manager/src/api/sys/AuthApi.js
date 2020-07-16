import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 权限信息接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/auth';
    }

    /**
     * 根据对象编号及关系类型查询权限信息
     * 
     * @param objectId
     *            对象编号
     * @param relateType
     *            关系类型
     * @return 请求对象
     */
    static getAuth(objectId, relateType) {
        return axios.get(`${this.basePath()}/getAuth`, {params: {objectId, relateType}});
    }

    /**
     * 通用授权
     * 
     * @param data
     *            权限信息
     * @return 请求对象
     */
    static authorize(data) {
        return axios.post(`${this.basePath()}/authorize`, data);
    }

};
