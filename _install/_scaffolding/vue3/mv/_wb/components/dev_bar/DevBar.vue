<template>
  <teleport to="body">
    <div
      class="c-dev_bar flex flex-row flex-no-wrap justify-between w-full bg-dev-black bg-opacity-60 leading-none text-dev-white overflow-x-scroll scrolling-touch z-50"
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
        <!--      <div class="flex flex-row items-center" v-if="showColorSchemeToggles">-->
        <!--        <span class="p-3 text-white whitespace-nowrap text-xs">Color Scheme:</span>-->
        <!--        <ColorSchemeToggle-->
        <!--          class="mx-2 focus:outline-none"-->
        <!--          remember-->
        <!--          scheme-id="default"-->
        <!--          title="Reset to default color scheme"-->
        <!--          v-if="showColorSchemeToggles"-->
        <!--          >🚫</ColorSchemeToggle-->
        <!--        >-->
        <!--        <ColorSchemeToggle-->
        <!--          class="mx-2 focus:outline-none"-->
        <!--          remember-->
        <!--          :scheme-id="index"-->
        <!--          v-for="(label, index) in colorSchemes"-->
        <!--          :key="index"-->
        <!--          >{{ label }}</ColorSchemeToggle-->
        <!--        >-->
        <!--      </div>-->
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
import wb from 'JS/automated/settings.js';
import Button from 'Components/button/Button.vue';
// import ColorSchemeToggle from 'Components/color_scheme_toggle/ColorSchemeToggle.vue';

// To determine color schemes and labels
// :color-schemes="{ dark: '🌑', light: '🌕', high-contrast: '🔲' }"

export default defineComponent({
  name: 'DevBar',
  components: {
    Button,
    // ColorSchemeToggle,
  },
  props: {
    colorSchemes: {
      type: Object,
      default() {
        return { dark: '🌑', light: '🌕' };
      },
    },
    links: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props) {
    const state = reactive({
      devMode: wb.devMode,
      isSticky: false,
      isVisible: true,
      showDocsLink: wb.enableDocs,
      showColorSchemeToggles: false,
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
      toggleSticky,
    };
  },
  mounted() {
    log('WB Config', wb);

    this.isSticky = localStorage.getItem('devMode:sticky') ? localStorage.getItem('devMode:sticky') === 'true' : false;
  },
});
</script>

<style>
.c-dev_bar {
  backdrop-filter: blur(0.9rem);
}
</style>
