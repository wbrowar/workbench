<template>
  <div>
    <main>
      <nuxt />
    </main>

    <DevBar v-if="devMode" />
  </div>
</template>

<script>
import { faviconVueMeta } from 'JS/favicons';
import settings from 'JS/automated/settings.js';

export default {
  components: {
    DevBar: () => import('Components/dev_bar/DevBar.vue'),
  },
  head() {
    return {
      ...faviconVueMeta,
    };
  },
  data() {
    return {
      devMode: settings.devMode,
    };
  },
};
</script>

<style>
.page-enter-active {
  transition: opacity 0.3s;
}
.page-enter {
  opacity: 0;
}
</style>
