import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 终端程序升级关系接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/terminalFota';
    }

    /**
     * 绑定FOTA升级终端关系
     * 
     * @param data
     *            提交数据
     * @return 请求对象
     */
    static bind(data) {
        return axios.post(`${this.basePath()}/bind`, data);
    }

};
