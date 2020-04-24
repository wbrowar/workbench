<template>
  <div class="home">
    <div class="py-12 text-white bg-black" :style="{ backgroundColor: marketo.example_color }">
      <div class="c-wrapper min-h-screen flex flex-col items-center justify-center">
        <h1 class="c-header-1" v-html="marketo.example_single_line_text"></h1>
        <div class="c-text text-2xl" v-html="marketo.example_text"></div>
        <div class="mt-8 pt-8 border-t border-black text-center" v-if="marketo.example_lightswitch">Optional Text (remove me with a lightswitch)</div>
        <MediaImage class="my-8 border border-black shadow-lg" :alt="marketo.example_image.alt" :sources="[{ src: marketo.example_image.src }]" v-if="marketo.example_image" />
        <MediaVideo source="youtube" :video-id="marketo.example_video" v-if="marketo.example_video" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Button from 'Components/button/Button.vue';
import MediaImage from 'Components/image/MediaImage.vue';
import MediaVideo from 'Components/video/MediaVideo.vue';

export default {
  metaInfo: {
    title: 'Title',
    titleTemplate: null,
  },
  name: 'home',
  components: {
    Button,
    MediaImage,
    MediaVideo,
  },
  computed: {
    marketo() {
      return this.$store.state.marketo;
    },
  }
};
</script>
