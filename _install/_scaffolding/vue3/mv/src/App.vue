<template>
  <div>
    <WelcomeDemo />
    <DevBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import wb from 'JS/automated/settings.js';
import DevBar from 'Components/dev_bar/DevBar.vue';
import WelcomeDemo from 'Components/welcome_demo/WelcomeDemo.vue';

export default defineComponent({
  name: 'App',
  components: {
    DevBar,
    WelcomeDemo,
  },
  setup() {
    const devMode = ref(wb.devMode);

    return {
      devMode,
    };
  },
});
</script>
