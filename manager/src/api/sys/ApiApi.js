import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 接口信息接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/api';
    }

    /**
     * 查询接口树状数据
     * 
     * @return 请求对象
     */
    static tree() {
        return axios.get(`${this.basePath()}/tree`);
    }

};
