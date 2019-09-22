<template>
  <div class="c_video" :class="{ c_video_bg: background }">
    <ClientOnly>
      <LazyLoad
        :after-load="{ src: src || false }"
        :autoplay="background ? true : autoplay"
        :class="{ c_video_bg__video: background }"
        :controls="background ? false : controls"
        element-type="video"
        :enable="lazyLoad"
        :loop="background ? true : loop"
        :muted="background ? true : muted"
        :playsinline="background ? 'playsinline' : playsinline ? 'playsinline' : false"
        :poster="poster || false"
        v-if="source === 'file'"
      />
      <LazyLoad
        allowfullscreen
        :after-load="{ src: videoId ? `https://www.youtube.com/embed/${ videoId }?rel=0&amp;controls=0&amp;showinfo=0` : false }"
        :check-for-native-lazy-load="lazyLoad"
        element-type="iframe"
        :enable="lazyLoad"
        frameborder="0"
        height="480"
        :loading="loading"
        width="853"
        v-else-if="source === 'youtube'"
      />
      <LazyLoad
        :after-load="{ src: videoId ? `https://player.vimeo.com/video/${ videoId }?title=0&byline=0&portrait=0` : false }"
        allowfullscreen
        :check-for-native-lazy-load="lazyLoad"
        element-type="iframe"
        :enable="lazyLoad"
        frameborder="0"
        height="281"
        :loading="loading"
        mozallowfullscreen
        webkitallowfullscreen
        width="500"
        v-else-if="source === 'vimeo'"
      />
    </ClientOnly>
  </div>
</template>

<script>
import LazyLoad from 'Components/lazy_load/LazyLoad.vue';

export default {
  components: {
    LazyLoad,
  },
  data() {
    return {
      lazyLoad: false,
      playerUrl: false,
    };
  },
  props: {
    autoplay: { type: Boolean, default: false },
    background: { type: Boolean, default: false },
    controls: { type: Boolean, default: true },
    loading: { default: 'lazy' }, // lazy, auto, eager
    loop: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    playsinline: { type: Boolean, default: false },
    poster: String,
    source: { type: String, default: 'file' }, // file, youtube, vimeo
    src: String,
    videoId: String,
  },
  created() {
    this.lazyLoad = this.loading === 'lazy';
  },
};
</script>
