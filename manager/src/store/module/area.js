import {Common, areaTree} from 'cby.assist';

/**
 * 地区
 */
export default {
    state: {
        area: areaTree
    },
    getters: {
        getArea: state => state.area,//获取地区
        getAreaItem: state => areaId => Common.recursiveQuery(areaId, state.area, 'areaId'),//获取地区项
        getAreaName: (state, getters) => areaId => {//获取地区名称
            let area = getters.getAreaItem(areaId);
            return area ? area.name : '';
        }
    }
};