import Vue from 'vue';
import config from '@/config';
import { Common } from "cby.assist";

/**
 * Vue组件文件下载功能
 */
Vue.prototype.$download = ({ name, storage, bucket }) => download(`${config.basePath}/download?name=${name}&storage=${storage}&bucket=${bucket}`);

/**
 * 通用文件下载地址
 */
export const downloadUrl = ({ name, storage, bucket }) => `${config.basePath}/download?name=${name}&storage=${storage}&bucket=${bucket}&token=${Common.getCookie("token")}`;

/**
 * 通用文件下载功能
 */
export const download = (url, params) => {
    if (!url.startsWith("http")) {
        url = config.baseUrl + url;
    }
    if (!params) {
        params = {};
    }
    params.token = Common.getCookie("token");
    url = Common.parseParam(url, params);
    window.open(url);
};

