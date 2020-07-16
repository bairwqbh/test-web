import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 版本信息接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/appVersion';
    }

    /**
     * 获取应用最新版本信息
     * 
     * @param appId
     *            应用编号
     * @return 请求对象
     */
    static currVersion(appId) {
        return axios.get(`${this.basePath()}/currVersion`, {params: {appId}});
    }

};
