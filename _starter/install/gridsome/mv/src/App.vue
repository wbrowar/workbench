<template>
  <div>
    <div class="h-48"></div>
    <router-view />
    <CraftLivePreview :endpoint="craftApiEndpoint" v-if="craftApiEndpoint" />

    <DevBar v-if="devMode || showDocsLink" />
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
  let vueComponents = {
    DevBar: () => import('Components/dev_bar/DevBar.vue'),
  };

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
