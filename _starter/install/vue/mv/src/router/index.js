import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from 'Views/Home.vue';

Vue.use(VueRouter);

const routes = [
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

if (process.env.ENABLE_DOCS) {
  const componentDocPages = glob.sync(`./_source/_js/automated/dev/*.vue`);
  componentDocPages.forEach((item) => {
    routes.push({
      path: `/dev/docs/${path.basename(item, '.vue')}`,
      name: "docs_${ path.basename(item, '.vue') }",
      component: () => import(`JS/automated/dev/${path.basename(item)}`),
    });
  });
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
