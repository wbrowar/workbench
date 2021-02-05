<template>
  <div>
    <WelcomeDemo />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WelcomeDemo from 'Components/welcome_demo/WelcomeDemo.vue';

export default defineComponent({
  name: 'Home',
  components: {
    WelcomeDemo,
  },
});
</script>
