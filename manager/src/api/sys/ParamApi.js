import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 系统参数接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/param';
    }

};
