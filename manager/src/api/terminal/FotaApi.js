import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 终端程序升级接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/fota';
    }

    /**
     * 执行FOTA升级
     * 
     * @param data
     *            系统参数信息
     * @return 请求对象
     */
    static execute(data) {
        return axios.post(`${this.basePath()}/execute`, data);
    }

    /**
     * 中断FOTA升级
     * 
     * @param data
     *            系统参数信息
     * @return 请求对象
     */
    static interrupt(data) {
        return axios.post(`${this.basePath()}/interrupt`, data);
    }

    /**
     * 强制关闭FOTA升级
     * 
     * @param data
     *            系统参数信息
     * @return 请求对象
     */
    static close(data) {
        return axios.post(`${this.basePath()}/close`, data);
    }

    /**
     * 检查该类型的终端是否在升级中
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static check(params) {
        return axios.get(`${this.basePath()}/check`, {params});
    }

    /**
     * 清除FOTA升级缓存
     * 
     * @param upgradeId
     *            升级编号
     * @return 请求对象
     */
    static clearCache(upgradeId) {
        return axios.delete(`${this.basePath()}/clearCache/${upgradeId}`);
    }

};
