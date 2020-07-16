import { Common } from 'cby.assist';
import SystemApi from '@/api/SystemApi';
import main from '@/views/main/';
import router from '@/router';

/**
 * 路由组件
 */
const constcomp =  {template: '<div><transition name="move" mode="out-in"><router-view/></transition></div>'};

/**
 * 加载视图组件
 */
const loadView = view => () => import(`@/views/module${view}`);

/**
 * 菜单转路由
 */
function menuToRoute(item, component) {
    if (component) {
        item.component = component;
    } else {
        item.component = item.funcType == 'menu' ? loadView(item.path) : constcomp;
    }
    if (item.children && item.children.length) {
        item.children.forEach(subItem => menuToRoute(subItem));
    }
}

/**
 * 菜单
 */
export default {
    state: {
        menu: [],
    },
    getters: {
        getMenu: state => state.menu,//获取菜单信息
        getMenuItem: state => menuId => Common.recursiveQuery(menuId, state.menu, 'funcId')//获取菜单项
    },
    actions: {
        //加载菜单数据
        loadMenu: ({commit}, params) => {
            SystemApi.menu(params).then(menu => {
                if (menu && menu.length) {
                    menu.forEach(item => menuToRoute(item, main));
                    router.addRoutes(menu);
                    commit('setMenu', menu);
                } else {
                    commit('setMenu', []);
                }
            });
        }
    },
    mutations: {
        setMenu: (state, menu) => state.menu = menu,//设置菜单项
        clearMenu: state => state.menu = [],//清除菜单数据
    }
};