<template>
  <div>
    <router-view />

    <DevBar v-if="devMode || showDocsLink" />
  </div>
</template>

<script>
import { getMarketoDescriptions, getMarketoVariables } from 'JS/marketo.js';
import { log } from 'JS/global.js';
import settings from 'JS/automated/wb.js';

export default {
  components: {
    DevBar: () => import('Components/dev_bar/DevBar.vue'),
  },
  data() {
    return {
      devMode: settings.devMode,
      marketoDescriptions: false,
      mutationObserver: false,
      showDocsLink: settings.docsUrl,
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
  },
};
</script>
