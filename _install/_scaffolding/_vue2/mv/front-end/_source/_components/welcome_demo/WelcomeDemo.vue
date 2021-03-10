<template>
  <div class="text-black bg-white">
    <div class="c-wrapper py-12 min-h-screen flex flex-col items-center justify-center">
      <h1 class="c-header-1 pb-4 relative opacity-0">
        Hello, <span class="cursor-pointer" @click="clickedWorld">{{ world }}</span>
      </h1>
      <div class="c-text text-2xl opacity-0">
        <p class="text-center">This app has been installed and is ready for programming.</p>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap';
import { log } from 'JS/global';
import settings from 'JS/automated/settings.js';

export default {
  name: 'WelcomeDemo',
  components: {},
  data() {
    return {
      handle: settings.name,
      world: '',
      worlds: ['🌎', '🌍', '🌏', '🪐'],
    };
  },
  methods: {
    clickedWorld() {
      log('clicked it');
    },
  },
  mounted() {
    // todo Delete welcome page code
    this.world = this.worlds[Math.floor(Math.random() * this.worlds.length)];

    gsap.to('.c-header-1', {
      opacity: 1,
      delay: 0.4,
      duration: 1,
    });
    gsap.to('.c-text', {
      opacity: 1,
      delay: 1.3,
      duration: 1,
    });
  },
};
</script>
