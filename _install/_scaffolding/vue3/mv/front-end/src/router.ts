import { createRouter, createWebHashHistory } from 'vue-router';
import Home from 'Pages/Home.vue';

const routes = [{ path: '/', component: Home }];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
