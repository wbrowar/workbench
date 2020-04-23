<template>
  <div class="home">
    <div class="text-white bg-black" :style="{ backgroundColor: marketo.example_color }">
      <div class="c-wrapper h-screen flex flex-col items-center justify-center">
        <h1 class="c-header-1" v-html="marketo.example_single_line_text"></h1>
        <div class="c-text text-2xl" v-html="marketo.example_text"></div>
        <div class="mt-8 pt-8 border-t border-black text-center" v-if="marketo.example_lightswitch">Optional Text (remove me with a lightswitch)</div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Button from 'Components/button/Button.vue';

export default {
  metaInfo: {
    title: 'Title',
    titleTemplate: null,
  },
  name: 'home',
  components: {
    Button,
  },
  computed: {
    marketo() {
      return this.$store.state.marketo;
    },
  }
};
</script>
