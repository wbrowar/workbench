<template>
  <div class="c-dev_bar sm:flex sm:flex-row sm:justify-between w-full bg-black-60" :class="classes">
    <div class="flex flex-row">
      <div class="flex flex-row items-center">
        <span class="p-3 text-white text-xs">Dev Mode: {{ devMode ? 'ON ⚙️' : 'OFF' }}</span>
        <span class="p-3 text-white text-xs">Dev Links:</span>
        <router-link class="p-3 text-white hover:text-black hover:bg-white transition-colors duration-150" to="/">Home</router-link>
        <router-link class="p-3 text-white hover:text-black hover:bg-white transition-colors duration-150" to="/dev/docs/general/" v-if="showDocsLink">Docs</router-link>
      </div>
    </div>
    <div class="flex flex-row">
      <div class="flex flex-row items-center" v-if="showColorSchemeToggles">
        <span class="p-3 text-white text-xs">Color Scheme:</span>
        <ColorSchemeToggle class="mx-2" remember scheme-id="default" title="Reset to default color scheme" v-if="showColorSchemeToggles">❌</ColorSchemeToggle>
        <ColorSchemeToggle class="mx-2" remember scheme-id="dark" title="Turn on dark color scheme (override browser setting)" v-if="showColorSchemeToggles">🌑</ColorSchemeToggle>
        <ColorSchemeToggle class="mx-2" remember scheme-id="light" title="Turn on light color scheme (override browser setting)" v-if="showColorSchemeToggles">🌕</ColorSchemeToggle>
      </div>
      <div class="flex flex-row items-center">
        <span class="p-3 text-white text-xs">Fixed:</span>
        <span class="pr-3 cursor-pointer" @click="toggleSticky" v-if="isSticky">❄️</span>
        <span class="pr-3 cursor-pointer" @click="toggleSticky" v-else>🌊</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { log } from 'JS/global.js';
  import wb from 'JS/automated/wb.js';
  import ColorSchemeToggle from 'Components/color_scheme_toggle/ColorSchemeToggle.vue';

  export default {
    components: {
      ColorSchemeToggle,
    },
    data() {
      return {
        devMode: wb.devMode,
        isSticky: false,
        showDocsLink: wb.enableDocs,
        showColorSchemeToggles: false,
      }
    },
    computed: {
      classes() {
        let classes = [];

        if (this.isSticky) {
          classes.push('fixed bottom-0 left-0');
        }

        return classes;
      },
    },
    methods: {
      toggleSticky() {
        this.isSticky = !this.isSticky;
        localStorage.setItem('devMode:sticky', this.isSticky);
      },
    },
    mounted() {
      log('WB Config', wb);

      if (Object.keys(wb.colors).length > 1) {
        this.showColorSchemeToggles = true;
      }

      this.isSticky = localStorage.getItem('devMode:sticky') ? localStorage.getItem('devMode:sticky') === 'true' : false;
    }
  }
</script>

<style lang="scss">
  .c-dev_bar {
    $self: &;

    backdrop-filter: blur(0.9rem);
  }
</style>