import axios from 'axios';
import BaseApi from '@/api/BaseApi';
import { download } from '@/service/util';

/**
 * 通信模组接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/commodu';
    }

    /**
     * 获取模组绑定信息
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static bindInfo(params) {
        return axios.get(`${this.basePath()}/bindInfo`, {params});
    }

    /**
     * 导出数据模板
     */
    static expTpl() {
        download(`${this.basePath()}/expTpl`);
    }

    /**
     * 导出数据
     * 
     * @return 请求对象
     */
    static expData(params) {
        download(`${this.basePath()}/expData`, params);
    }

};
