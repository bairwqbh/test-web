import SystemApi from '@/api/SystemApi';
import config from '@/config';

/**
 * 登录信息
 */
export default {
    state: {
        info: {}
    },
    getters: {
        getInfo: state => state.info,//获取登录信息
        getUser: state => state.info.user,//获取用户信息
        getOrg: state => state.info.org,//获取机构信息
        getRoles: state => state.info.roles,//获取角色列表
        getAuths: state => state.info.auths || [],//获取权限列表
        getApis: state => state.info.apis,//获取接口列表
        isAuth: state => auth => {//是否拥有权限
            if (auth && state.info && state.info.auths && state.info.auths.length) {
                return state.info.auths.includes(auth);
            }
            return false;
        },
        getAuthData: state => module => {//根据模块获取权限数据
            if (module && state.info && state.info.auths && state.info.auths.length) {
                return {
                    addBtn: state.info.auths.includes(`${module}:add`),
                    editBtn: state.info.auths.includes(`${module}:mod`),
                    delBtn: state.info.auths.includes(`${module}:del`)
                };
            }
            return {
                addBtn: false,
                editBtn: false,
                delBtn: false
            };
        },
        getUserId: state => {
            if (state.info && state.info.user) {
                return state.info.user.userId;
            }
            return "未登录";
        }
    },
    actions: {
        loadInfo: ({dispatch, commit}) => {//加载登录信息
            SystemApi.info().then(info => {
                commit('setInfo', info);
                if (info) {
                    dispatch('loadMenu', {
                        sysId: config.sysId,
                        roleIds: info.roles
                    });
                }
            });
        }
    },
    mutations: {
        setInfo: (state, info) => state.info = info,//设置登录信息
        clearInfo: state => state.info = {}//清除登录信息
    }
};
