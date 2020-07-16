import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 终端通信模组关系接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/terminalCommodu';
    }

    /**
     * 绑定终端模组关系
     * 
     * @param data
     *            提交数据
     * @return 请求对象
     */
    static bindCommodu(data) {
        return axios.post(`${this.basePath()}/bindCommodu`, data);
    }

    /**
     * 绑定模组终端关系
     * 
     * @param data
     *            提交数据
     * @return 请求对象
     */
    static bindTerminal(data) {
        return axios.post(`${this.basePath()}/bindTerminal`, data);
    }

};
