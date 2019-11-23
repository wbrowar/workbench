<template>
  <div>
    <div>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/dev/docs/general/" v-if="showDocsLink">Docs</router-link>
      <span v-else>Set up environment variables to enable Docs</span>
    </div>
    <router-view />
  </div>
</template>

<script>
  import { devEnableDocs } from 'JS/settings.js';

  export default {
    data() {
      return {
        showDocsLink: devEnableDocs,
      };
    },
  };
</script>
