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
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ 'Views/About.vue'),
  // },
];

if (process.env.VUE_APP_ENABLE_DOCS) {
  routes.push({
    path: `/dev/docs/:slug`,
    name: `dev_docs`,
    component: () => import(`JS/automated/ComponentDocs.vue`),
  });
}

const router = new VueRouter({
  mode: 'hash',
  base: '/',
  routes,
});

export default router;
