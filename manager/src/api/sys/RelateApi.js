import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 关联关系接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/relate';
    }

    /**
     * 查询关联关系列表
     * 
     * @param objectId
     *            对象编号
     * @param relateType
     *            关系类型
     * @return 请求对象
     */
    static getTargetList(objectId, relateType) {
        return axios.get(`${this.basePath()}/getTargetList`, {params: {objectId, relateType}});
    }

};
