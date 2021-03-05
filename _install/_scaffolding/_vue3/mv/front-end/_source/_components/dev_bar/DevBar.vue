<template>
  <teleport to="body">
    <div
      class="c-dev-bar flex flex-row flex-no-wrap justify-between w-full bg-dev-black bg-opacity-60 leading-none text-dev-white overflow-x-scroll scrolling-touch z-50"
      :class="classes"
      v-if="isVisible"
    >
      <div class="flex flex-row">
        <div class="flex flex-row flex-no-wrap items-center">
          <span class="p-3 text-white whitespace-nowrap text-xs"
            >Dev Mode: {{ devMode ? '⚙️&thinsp;ON' : '🚀&thinsp;OFF' }}</span
          >
          <span class="p-3 text-white text-xs">Links:</span>
          <Button
            class="p-3 text-sm text-white hover:text-black whitespace-nowrap hover:bg-white hover:bg-opacity-80 transition-colors duration-500 cursor-pointer"
            unstyle
            v-bind="link"
            v-for="(link, index) in allLinks"
            :key="index"
            ><span v-html="link.labelText"></span
          ></Button>
        </div>
      </div>
      <div class="flex flex-row">
        <div class="p-3 flex flex-row relative items-center space-x-2" v-if="dataToReset === 'none'">
          <span class="text-white whitespace-nowrap text-xs">Clear:</span>
          <span class="cursor-pointer" title="Clear localStorage" @click="dataToReset = 'localStorage'">🗄</span>
          <!--          <span class="cursor-pointer" title="Clear Cookies" @click="dataToReset = 'cookies'">🍪</span>-->
        </div>
        <div class="p-3 flex flex-row relative items-center space-x-2" v-else>
          <span class="text-white whitespace-nowrap text-xs">Clear {{ dataToReset }}?</span>
          <span
            class="px-2 py-1 rounded bg-dev-gray-500 hover:bg-error text-xs cursor-pointer"
            @click="clearLocalData(dataToReset)"
            >Yes</span
          >
          <span
            class="px-2 py-0.5 rounded bg-dev-gray-500 hover:bg-dev-gray-600 text-xs cursor-pointer"
            @click="dataToReset = 'none'"
            >No</span
          >
        </div>
        <div class="p-3 flex flex-row items-center space-x-2">
          <span class="text-white whitespace-nowrap text-xs">Display:</span>
          <span class="cursor-pointer" @click="toggleSticky" v-if="isSticky">❄️</span>
          <span class="cursor-pointer" @click="toggleSticky" v-else>🌊</span>
          <span class="cursor-pointer" @click="isVisible = false">❌</span>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { log } from 'JS/global';
import settings from 'JS/automated/settings.js';
import Button from 'Components/button/Button.vue';

export default defineComponent({
  name: 'DevBar',
  components: {
    Button,
  },
  props: {
    links: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props) {
    const state = reactive({
      dataToReset: 'none',
      devMode: settings.devMode,
      isSticky: false,
      isVisible: true,
      showDocsLink: settings.enableDocs,
    });

    /*
     * Computes classes based on changes in the component.
     */
    const allLinks = computed(() => {
      return [
        { href: '/', labelText: '🏠&thinsp;Home' },
        { href: '/', labelText: '📚&thinsp;Components' },
        { href: '/', labelText: '🎨&thinsp;Design System' },
        ...props.links,
      ];
    });

    /*
     * Computes classes based on changes in the component.
     */
    const classes = computed(() => {
      const classes = [];

      if (state.isSticky) {
        classes.push('fixed bottom-0 left-0');
      }

      return classes;
    });

    /*
     * Wipe all localStorage items for the current site
     */
    function clearLocalData(target) {
      if (target === 'cookies') {
        // TODO figure out how to clear all cookies (or delete this option)
      } else if (target === 'localStorage') {
        localStorage.clear();
      }
      state.dataToReset = 'none';
    }

    /*
     * Makes the bar stick to the bottom of the viewport, or displays it at the bottom of the page.
     */
    function toggleSticky() {
      this.isSticky = !this.isSticky;
      localStorage.setItem('devMode:sticky', this.isSticky ? 'true' : 'false');
    }

    return {
      ...toRefs(state),
      allLinks,
      classes,
      clearLocalData,
      toggleSticky,
    };
  },
  mounted() {
    log('WB Config', settings);

    this.isSticky = localStorage.getItem('devMode:sticky') ? localStorage.getItem('devMode:sticky') === 'true' : false;
  },
});
</script>

<style>
.c-dev-bar {
  backdrop-filter: blur(0.9rem);
}
</style>
