// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue';
import VueMq from 'vue-mq';

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout);

  // Set global media queries used for Grid and Stack components
  // Customize `defaultBreakpoint` for SSR
  Vue.use(VueMq, {
    breakpoints: {
      sm: 500,
      md: 768,
      lg: 1300,
      xlg: Infinity,
    },
    defaultBreakpoint: 'sm',
  });
}
