<template>
  <div class="docs__tailwind_tester">
    <div>
      <div class="mb-6" v-html="tailwindSample"></div>
      <textarea
        class="dev__components__input"
        name="font_sample_text_input"
        v-model="tailwindSample"
        rows="30"
      ></textarea>
    </div>
  </div>
</template>

<script>
  import { log } from 'JS/global.js';

  export default {
    data() {
      return {
        tailwindSample: false,
      };
    },
    created() {
      this.tailwindSample = `<div class="md:flex">
  <div class="md:flex-shrink-0">
    <img class="rounded-lg md:w-56" src="/img/FPO.png" alt="FPO image">
  </div>
  <div class="mt-4 md:mt-0 md:ml-6">
    <div class="uppercase tracking-wide text-sm text-dev-gray-600 font-bold">Marketing</div>
    <a href="#" class="block mt-1 text-lg leading-tight font-semibold text-dev-gray-900 hover:underline">Finding customers for your new business</a>
    <p class="mt-2 text-dev-gray-700">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
  </div>
</div>`;
    }
  };
</script>