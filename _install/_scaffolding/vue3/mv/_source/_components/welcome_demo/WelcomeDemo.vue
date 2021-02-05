<template>
  <div class="c-welcome-demo text-black bg-white">
    <div class="c-wrapper py-12 min-h-screen flex flex-col items-center justify-center">
      <h1 class="c-header-1 pb-4 relative opacity-0">
        Hello, <span class="cursor-pointer" @click="clickedWorld">{{ world }}</span>
      </h1>
      <div class="c-text text-2xl opacity-0">This app has been installed and is ready for programming.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import gsap from 'gsap';
import { log } from 'JS/global';

export default defineComponent({
  name: 'WelcomeDemo',
  components: {},
  data() {
    return {};
  },
  setup() {
    const worlds: string = ['🌎', '🌍', '🌏', '🪐'];
    const world: string[] = worlds[Math.floor(Math.random() * worlds.length)];
    const state = reactive({
      world,
    });

    function clickedWorld() {
      log('clicked it');
    }

    return {
      ...toRefs(state),
      clickedWorld,
    };
  },
  mounted() {
    // todo Delete welcome page code
    gsap.to('.c-header-1', {
      opacity: 1,
      delay: 0.6,
      duration: 1.2,
    });
    gsap.to('.c-text', {
      opacity: 1,
      delay: 1.5,
      duration: 1.2,
    });
  },
});
</script>

<style>
.c-welcome-demo {
}
</style>
