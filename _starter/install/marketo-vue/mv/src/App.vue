<template>
  <div>
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
  import { getMarketoVariables } from 'JS/marketo.js';
  import { log } from 'JS/global.js';
  import wb from 'JS/automated/wb.js';

  export default {
    data() {
      return {
        devMode: wb.devMode,
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
    mounted() {
      this.marketoVariablesUpdated();

      const marketoVariablesContainer = document.getElementById('marketo_variables');
      if (marketoVariablesContainer) {
        this.mutationObserver = new MutationObserver(this.marketoVariablesUpdated);
        this.mutationObserver.observe(marketoVariablesContainer, { attributes: true, childList: true, subtree: true });
        log('Added mutation observer');
      } else {
        log('Using fallback variables');
      }
    },
    destroyed() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
      }
    }
  };
</script>