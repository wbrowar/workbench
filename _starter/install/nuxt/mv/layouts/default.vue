<template>
  <div>
    <main>
      <nuxt />
    </main>

    <DevBar v-if="devMode || showDocsLink" />
  </div>
</template>

<script>
import wb from 'JS/automated/wb.js';

export default {
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

<style lang="scss">
.page-enter-active {
  transition: opacity 0.3s;
}
.page-enter {
  opacity: 0;
}
</style>
