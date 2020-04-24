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
  import wb from 'JS/automated/wb.js';

  export default {
    data() {
      return {
        devMode: wb.devMode,
        showDocsLink: wb.enableDocs,
      };
    },
  };
</script>
