import axios from 'axios';
import BaseApi from '@/api/BaseApi';

/**
 * 角色信息接口
 */
export default class extends BaseApi {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '/role';
    }

};
