<template>
  <div>
    <router-view />
    <DevBar v-if="devMode" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import wb from 'JS/automated/settings.js';
import DevBar from 'Components/dev_bar/DevBar.vue';

export default defineComponent({
  name: 'App',
  components: {
    DevBar,
  },
  setup() {
    const devMode = ref(wb.devMode);

    return {
      devMode,
    };
  },
});
</script>
