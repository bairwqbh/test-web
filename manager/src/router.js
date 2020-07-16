import Vue from 'vue';
import Router from 'vue-router';
import main from '@/views/main/';

Vue.use(Router);

export const router = new Router({
    routes: [{
        path: '/login',
        component: () => import('@/views/main/Login')
    }, {
        path: '',
        redirect: 'index',
        component: main,
        children: [{
            path: 'index',
            component: () => import('@/views/main/Welcome')
        }]
    }]
});

export default router;
