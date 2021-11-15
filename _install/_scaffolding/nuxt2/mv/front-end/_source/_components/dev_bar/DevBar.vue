<template>
  <portal selector="body">
    <div
      class="c-dev-bar flex flex-row flex-nowrap justify-between w-full bg-dev-black bg-opacity-60 leading-none text-dev-white overflow-x-scroll scrolling-touch scoll-hide z-50"
      :class="classes"
      v-if="isVisible"
    >
      <div class="flex flex-row">
        <div class="flex flex-row flex-nowrap items-center">
          <span class="p-3 text-white whitespace-nowrap text-xs"
            >Dev Mode: {{ devMode ? '⚙️&thinsp;ON' : '🚀&thinsp;OFF' }}</span
          >
          <span class="p-3 text-white whitespace-nowrap text-xs sm:hidden" v-if="tailwindBreakpoints.length"
            >📱: –</span
          >
          <span
            class="hidden p-3 text-white whitespace-nowrap text-xs sm:inline md:hidden"
            v-if="tailwindBreakpoints.includes('sm')"
            >📱: sm</span
          >
          <span
            class="hidden p-3 text-white whitespace-nowrap text-xs md:inline lg:hidden"
            v-if="tailwindBreakpoints.includes('md')"
            >📱: md</span
          >
          <span
            class="hidden p-3 text-white whitespace-nowrap text-xs lg:inline xl:hidden"
            v-if="tailwindBreakpoints.includes('lg')"
            >📱: lg</span
          >
          <span
            class="hidden p-3 text-white whitespace-nowrap text-xs xl:inline"
            v-if="tailwindBreakpoints.includes('xl')"
            >📱: xl</span
          >
          <span class="p-3 text-white whitespace-nowrap text-xs">$mq: {{ $mq }}</span>
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
  </portal>
</template>

<script>
import { Portal } from '@linusborg/vue-simple-portal';
import { log } from 'JS/global.ts';
import settings from 'JS/automated/settings.js';
import Button from 'Components/button/Button.vue';

export default {
  name: 'DevBar',
  components: {
    Button,
    Portal,
  },
  props: {
    links: {
      type: Array,
      default() {
        return [];
      },
    },
    tailwindBreakpoints: {
      type: Array,
      default() {
        return ['sm', 'md', 'lg', 'xl'];
      },
    },
    urlBuild: {
      type: String,
      default: `https://${settings.name}-dist.ddev.site/`,
    },
    urlCms: {
      type: String,
      default: settings.cmsUrl || null,
    },
    urlDocs: {
      type: String,
      default: settings.docsUrl || null,
    },
    urlTailwind: {
      type: String,
      default: `/_tailwind/`,
    },
    urlHome: {
      type: String,
      default: `/`,
    },
  },
  data() {
    return {
      dataToReset: 'none',
      devMode: settings.devMode,
      isSticky: false,
      isVisible: true,
    };
  },
  computed: {
    allLinks() {
      const links = [
        { href: this.urlHome, labelText: '🏠&thinsp;&thinsp;Home' },
        { href: this.urlBuild, labelText: '🧱&thinsp;&thinsp;Build', newWindow: true },
      ];

      if (this.urlCms) {
        links.push({ href: this.urlCms, labelText: '🥃&thinsp;&thinsp;CMS', newWindow: true });
      }

      links.push({ href: this.urlTailwind, labelText: '🎨&thinsp;&thinsp;Design System', newWindow: true });

      if (this.urlDocs) {
        links.push({ href: this.urlStorybook, labelText: '📚&thinsp;&thinsp;Components', newWindow: true });
      }

      links.push(...this.links);

      return links;
    },
    classes() {
      const classes = [];

      if (this.isSticky) {
        classes.push('fixed bottom-0 left-0');
      }

      return classes;
    },
  },
  methods: {
    clearLocalData(target) {
      if (target === 'cookies') {
      } else if (target === 'localStorage') {
        localStorage.clear();
      }
      this.dataToReset = 'none';
    },
    toggleSticky() {
      this.isSticky = !this.isSticky;
      localStorage.setItem('devMode:sticky', this.isSticky);
    },
  },
  mounted() {
    log('WB Config', settings);

    this.isSticky = localStorage.getItem('devMode:sticky') ? localStorage.getItem('devMode:sticky') === 'true' : false;
  },
};
</script>

<style>
.c-dev-bar {
  backdrop-filter: blur(0.9rem);
}
</style>
