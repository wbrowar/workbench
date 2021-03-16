declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module '@nuxt/types' {
  interface Context {
    $craft(params: object): Promise<any> | object;
  }
}
