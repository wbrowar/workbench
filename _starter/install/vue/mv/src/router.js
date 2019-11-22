import { docsComponents } from 'JS/automated/docs.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';
import Home from 'Views/Home.vue';

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});
Vue.use(VueRouter);

let routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ 'Views/About.vue'),
  },
];

console.table(process.env);

if (process.env.VUE_APP_ENABLE_DOCS) {
  docsComponents.forEach((item) => {
    routes.push({
      path: `/dev/docs/${item}`,
      name: `dev_docs_${item}`,
      component: () => import(`JS/automated/dev/${item}.vue`),
    });
  });
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
