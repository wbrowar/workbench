import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import store from './store.js';
import VueMq from 'vue-mq';
import { wb } from 'JS/automated/wb.js';
import 'CSS/tailwind.css';
import 'CSS/app.scss';

Vue.config.productionTip = false;
Vue.config.ignoredElements = ['g-link'];

Vue.use(VueMq, {
  breakpoints: {
    ...wb.mq,
    xxl: Infinity,
  },
  defaultBreakpoint: 'sm',
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
