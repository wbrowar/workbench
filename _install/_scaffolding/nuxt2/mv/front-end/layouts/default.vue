<template>
  <div>
    <div class="sr-only">Skip to <a href="#page-content">content</a>.</div>

    <main id="page-content">
      <nuxt />
    </main>

    <DevBar v-if="devMode" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  useMeta,
} from '@nuxtjs/composition-api';
import { faviconVueMeta } from 'JS/favicons';
import settings from 'JS/automated/settings.js';
import DevBar from 'Components/dev_bar/DevBar.vue';

export default defineComponent({
  name: 'LayoutDefault',
  components: {
    DevBar,
  },
  head: {},
  setup() {
    const state = reactive({
      devMode: settings.devMode,
      scrollPosition: 0,
      ticking: false,
    });

    useMeta((): object => {
      const meta = {
        bodyAttrs: {
          // class: [store.state.darkMode ? 'dark' : '', store.state.reduceMotion ? 'reduce-motion' : ''],
        },
        meta: [
          // {
          //   hid: 'theme-color',
          //   name: 'theme-color',
          //   content: '',
          // },
        ],
        script: [] as Record<string, any>[],
      };

      return meta;
    });

    useMeta((): object => {
      return {
        ...faviconVueMeta,
      };
    });

    return {
      ...toRefs(state),
    };
  },
  mounted() {
    if (this.$preview) {
      const storageKey = `scrollPosition:${this.$route.path}`;

      // Record scroll position in session storage to retain scroll position in Live Preview
      setTimeout(() => {
        // If scroll position is set, scroll to it
        this.$nextTick(() => {
          if (sessionStorage.getItem(storageKey)) {
            const yValue = sessionStorage.getItem(storageKey);

            if (yValue) {
              window.scrollTo(0, parseInt(yValue));
            }
          }
        });

        window.addEventListener('scroll', () => {
          this.scrollPosition = window.scrollY;

          if (!this.ticking) {
            window.requestAnimationFrame(() => {
              sessionStorage.setItem(storageKey, this.scrollPosition.toString());
              this.ticking = false;
            });

            this.ticking = true;
          }
        });
      }, 1000);
    }

    log('LayoutDefault loaded');
  },
});
</script>

<style>
.page-enter-active {
  transition: opacity 0.3s;
}
.page-enter {
  opacity: 0;
}
</style>
