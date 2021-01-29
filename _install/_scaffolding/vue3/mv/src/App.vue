<template>
  <div>
    <p class="bg-black text-white p-6">Test!</p>
    <p class="text-white p-6 bg-bidenBlue" v-if="devMode">Dev Mode is on!</p>

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
