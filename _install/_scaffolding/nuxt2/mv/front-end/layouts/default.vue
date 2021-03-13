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
import DevBar from 'Components/dev_bar/DevBar.vue';

export default {
  components: {
    DevBar,
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
  mounted() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client && this.$config.livePreview) {
      window.addEventListener(
        'message',
        ({ data }) => {
          if (data === 'livepreview' && this.$preview) {
            this.$nuxt.refresh();
          }
        },
        false
      );
    }
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
