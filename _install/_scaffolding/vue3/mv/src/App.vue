<template>
  <div>
    <div class="text-black bg-white">
      <div class="c-wrapper py-12 min-h-screen flex flex-col items-center justify-center">
        <h1 class="c-header-1">Hello, 🌎</h1>
        <div class="c-text text-2xl">This app has been installed and is ready for programming.</div>
      </div>
    </div>

    <DevBar />
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
