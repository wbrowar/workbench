import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import store from './store.js';
import VueMq from 'vue-mq';
import 'CSS/app.scss';

Vue.config.productionTip = false;
Vue.config.ignoredElements = ['g-link'];

Vue.use(VueMq, {
  breakpoints: {
    sm: 500,
    md: 768,
    lg: 1300,
    xlg: Infinity,
  },
  defaultBreakpoint: 'sm',
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
