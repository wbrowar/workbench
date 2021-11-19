import Vue from 'vue';

declare global {
  interface Window {
    dl: any; // Datalayer for GTM
  }
}

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $metaInfo: any;
  }
}
