<template>
  <div>
    <div class="absolute y-0 right-0 bg-black-90 p-4 text-white" v-if="marketo.show_marketo_docs">
      <div class="mx-auto max-w-lg">
        <p class="text-2xl mb-1">Elements</p>
        <div class="mt-2 first:mt-0 border-t border-white-30 mb-8 px-2 py-2" v-for="(item, key) in marketoDescriptions.body" :key="key">
          <p class="text-lg mb-1">{{ item.label }}</p>
          <p class="text-white-60">{{ item.description }}</p>
        </div>

        <p class="text-2xl mb-1">Variables</p>
        <div class="mt-2 first:mt-0 border-t border-white-30 px-2 py-2" v-for="(item, key) in marketoDescriptions.meta" :key="key">
          <p class="text-lg mb-1">{{ item.label }}</p>
          <p class="text-white-60">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <router-view />

    <div class="flex flex-row items-center bg-black" v-if="devMode || showDocsLink">
      <span class="p-3 text-white text-xs">Dev Mode: {{ devMode ? 'ON' : 'OFF' }}</span>
      <span class="p-3 text-white text-xs">Dev Links:</span>
      <router-link class="p-3 text-white hover:text-black hover:bg-white" to="/">Home</router-link>
      <router-link class="p-3 text-white hover:text-black hover:bg-white" to="/dev/docs/general/" v-if="showDocsLink">Docs</router-link>
    </div>
  </div>
</template>

<script>
  import { getMarketoDescriptions, getMarketoVariables } from 'JS/marketo.js';
  import { log } from 'JS/global.js';
  import wb from 'JS/automated/wb.js';

  export default {
    data() {
      return {
        devMode: wb.devMode,
        marketoDescriptions: false,
        mutationObserver: false,
        showDocsLink: wb.enableDocs,
      };
    },
    methods: {
      marketoVariablesUpdated() {
        const marketoVariables = getMarketoVariables();

        if (Object.keys(marketoVariables).length) {
          this.$store.commit('updatemMarketo', marketoVariables);
        }
      },
    },
    computed: {
      marketo() {
        return this.$store.state.marketo;
      },
    },
    mounted() {
      this.marketoVariablesUpdated();

      const marketoVariablesContainer = document.getElementById('marketo_variables');
      if (marketoVariablesContainer) {
        this.mutationObserver = new MutationObserver(this.marketoVariablesUpdated);
        this.mutationObserver.observe(marketoVariablesContainer, { attributes: true, childList: true, subtree: true });
        log('Added mutation observer');
      } else {
        log('Marketo variables div not found. Using fallback variables');
      }

      this.marketoDescriptions = getMarketoDescriptions();
    },
    destroyed() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
      }
    }
  };
</script>