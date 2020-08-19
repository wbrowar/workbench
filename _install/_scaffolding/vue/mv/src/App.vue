<template>
  <div>
    <router-view />
    <DevBar v-if="devMode || showDocsLink" />
  </div>
</template>

<script>
  import wb from 'JS/automated/wb.js';

  export default {
    name: 'App',
    components: {
      DevBar: () => import('Components/dev_bar/DevBar.vue'),
    },
    data() {
      return {
        devMode: wb.devMode,
        showDocsLink: wb.enableDocs,
      };
    },
  };
</script>