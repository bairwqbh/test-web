import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 地区地区
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/area';
    }

    /**
     * 查询地区树状列表
     * 
     * @param areaId
     *            地区编号
     * @return 请求对象
     */
    static tree(areaId) {
        return axios.get(`${this.basePath()}/tree`, {params: {areaId}});
    }

};
