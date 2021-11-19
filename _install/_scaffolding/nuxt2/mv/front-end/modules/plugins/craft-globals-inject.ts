import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import { CraftGlobals } from 'Types/types';

declare module 'vue/types/vue' {
  // this.$craftGlobals inside Vue components
  interface Vue {
    $craftGlobals: CraftGlobals;
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$craftGlobals inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $craftGlobals: CraftGlobals;
  }
  // nuxtContext.$craftGlobals
  interface Context {
    $craftGlobals: CraftGlobals;
  }
}

export default defineNuxtPlugin((ctx, inject) => {
  const globals = JSON.parse(`<%= (options.data).replace(/\\"/g, '“') %>`);
  // console.log('Craft globals:', globals);
  inject('craftGlobals', globals);
});
