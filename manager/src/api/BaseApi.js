import axios from 'axios';
import config from '@/config';

/**
 * 基础接口
 */
export default class {

    /**
     * 获取基础路径
     * 
     * @return 基础路径
     */
    static basePath() {
        return `${config.basePath}${this.bizPath()}`;
    }

    /**
     * 获取业务路径
     * 
     * @return 基础路径
     */
    static bizPath() {
        return '';
    }

    /**
     * 新增数据
     * 
     * @param data
     *            数据
     * @return 请求对象
     */
    static add(data) {
        return axios.post(`${this.basePath()}/add`, data);
    }

    /**
     * 删除数据
     * 
     * @param id
     *            编号
     * @return 请求对象
     */
    static del(id) {
        return axios.delete(`${this.basePath()}/del/${id}`);
    }

    /**
     * 修改数据
     * 
     * @param data
     *            数据
     * @return 请求对象
     */
    static mod(data) {
        return axios.put(`${this.basePath()}/mod`, data);
    }

    /**
     * 查询数据列表
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static list(params) {
        return axios.get(`${this.basePath()}/list`, {params});
    }

    /**
     * 分页查询数据
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static page(params) {
        return axios.get(`${this.basePath()}/page`, {params});
    }

    /**
     * 查询单条数据
     * 
     * @param params
     *            查询参数
     * @return 请求对象
     */
    static find(params) {
        return axios.get(`${this.basePath()}/find`, {params});
    }

};
