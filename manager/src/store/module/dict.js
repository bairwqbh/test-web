import SystemApi from '@/api/SystemApi';

/**
 * 字典
 */
export default {
    state: {
        dict: [],
        dictList: {},
        dictMap: {}
    },
    getters: {
        getDict: state => state.dict,//获取字典
        dictMap: state => state.dictMap,//获取字典MAP
        dictList: state => state.dictList,//获取字典列表
        getDictMap: state => parentId => state.dictMap[parentId],//获取字典MAP
        getDictList: state => parentId => state.dictList[parentId],//获取字典列表
        getDictName: state => (parentId, code) => {//获取字典名称
            if (state.dictMap && state.dictMap[parentId]) {
                return state.dictMap[parentId][code];
            } else {
                return null;
            }
        }
    },
    actions: {
        loadDict: ({commit}) => SystemApi.dict().then(dict => commit('setDict', dict))//加载字典数据
    },
    mutations: {
        setDict: (state, dict) => {//设置字典数据
            state.dict = dict;
            let dictList = {};
            let dictMap = {};
            if (dict) {
                dict.forEach(({code, children}) => {
                    dictList[code] = [];
                    dictMap[code] = {};
                    if (children && children.length) {
                        dictList[code] = children.map(({code, name}) => ({label: name, value: code}));
                        let dm = {};
                        children.forEach(({code, name}) => dm[code] = name);
                        dictMap[code] = dm;
                    }
                });
            }
            state.dictList = dictList;
            state.dictMap = dictMap;
        }
    }
};