import axios from 'axios';
import BaseApi from '@/api/BaseApi';
import { download } from '@/service/util';

/**
 * 终端接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/terminal';
    }

    /**
     * 获取终端绑定信息
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static bindInfo(params) {
        return axios.get(`${this.basePath()}/bindInfo`, {params});
    }

    /**
     * 获取终端FOTA绑定信息
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static fotaBindInfo(params) {
        return axios.get(`${this.basePath()}/fotaBindInfo`, {params});
    }

    /**
     * 导出数据模板
     * 
     * @return 请求对象
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

    /**
     * 报文下发
     * 
     * @param data
     *            数据
     * @return 请求对象
     */
    static messageIssued(data) {
        return axios.post(`${this.basePath()}/messageIssued`, data);
    }

    /**
     * 终端配置
     * 
     * @param data
     *            数据
     * @return 请求对象
     */
    static config(data) {
        return axios.post(`${this.basePath()}/config`, data);
    }

};
