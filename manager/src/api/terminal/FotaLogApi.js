import axios from 'axios';
import BaseApi from '@/api/BaseApi';
import { download } from '@/service/util';

/**
 * 终端程序升级日志接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/fotaLog';
    }

    /**
     * 导出数据
     * 
     * @return 请求对象
     */
    static exp(params) {
        download(`${this.basePath()}/exp`, params);
    }

};
