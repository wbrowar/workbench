<template>
  <div>
    <div class="h-48"></div>
    <router-view />
    <CraftLivePreview :endpoint="craftApiEndpoint" v-if="craftApiEndpoint" />
    <div class="flex flex-row items-center bg-black" v-if="devMode || showDocsLink">
      <span class="p-3 text-white text-xs">Dev Mode: {{ devMode ? 'ON' : 'OFF' }}</span>
      <span class="p-3 text-white text-xs">Dev Links:</span>
      <router-link class="p-3 text-white hover:text-black hover:bg-white" to="/">Home</router-link>
      <router-link class="p-3 text-white hover:text-black hover:bg-white" to="/dev/docs/general/" v-if="showDocsLink">Docs</router-link>
    </div>
  </div>
</template>

<static-query>
  query {
    metadata {
      siteName
      siteDescription
    }
  }
</static-query>

<script>
  let vueComponents = {};

  if (process.env.GRIDSOME_CRAFT_API_URL) {
    vueComponents['CraftLivePreview'] = () => import ('@bhws/gridsome-source-craft-graphql/CraftLivePreview');
  }

  export default {
    components: vueComponents,
    metaInfo() {
      return {
        title: this.$static.metadata.siteName,
        meta: [
          {
            key: 'description',
            name: 'description',
            content: this.$static.metadata.siteDescription
          }
        ]
      }
    },
    data() {
      return {
        devMode: wb.devMode,
        showDocsLink: wb.enableDocs,
      };
    },
    computed: {
      craftApiEndpoint() {
        return (process.env.GRIDSOME_LIVE_PREVIEW === 'true' && process.env.GRIDSOME_CRAFT_API_URL) ? process.env.GRIDSOME_CRAFT_API_URL : false;
      }
    },
  }
</script>
