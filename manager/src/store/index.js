import Vue from 'vue';
import Vuex from 'vuex';
import area from './module/area';
import info from './module/info';
import dict from './module/dict';
import menu from './module/menu';
import SystemApi from '@/api/SystemApi';
import router from '@/router';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: { area, info, dict, menu }
});

SystemApi.isAuthen().then(isAuthen => {
    if (isAuthen) {
        store.dispatch('loadDict');
        store.dispatch('loadInfo');
    } else {
        router.push('/login');
    }
});

export default store;
