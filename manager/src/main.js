import 'element-ui/lib/theme-chalk/index.css';
import '@smallwei/avue/lib/index.css';
import '@/assets/css/index.css';

import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import ElementUI from 'element-ui';
import Avue from '@smallwei/avue';
import config from '@/config';
import Cache from 'cache-base';
import axios from 'axios';
import '@/service/axios';
import '@/service/util';
import store from '@/store';

Vue.use(ElementUI);
Vue.use(Avue);
Vue.prototype.$axios = axios;
Vue.prototype.$cache = new Cache();
Vue.prototype.$config = config;

Vue.prototype.yes = true;
Vue.prototype.no = false;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
