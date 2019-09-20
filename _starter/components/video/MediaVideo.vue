<template>
  <div class="c_video" :class="{ c_video_bg: background }">
    <LazyLoad
      :class="{ c_video_bg__video: background }"
      element-type="video"
      :enable="enableLazyLoad"
      :autoplay="background ? true : autoplay"
      :controls="background ? false : controls"
      :loop="background ? true : loop"
      :muted="background ? true : muted"
      :playsinline="background ? 'playsinline' : playsinline ? 'playsinline' : false"
      :poster="poster || false"
      :src="lazyLoad(false, src || false)"
      v-if="source === 'file'"
    />
    <LazyLoad
      element-type="iframe"
      :enable="enableLazyLoad"
      :src="lazyLoad(false, `https://www.youtube.com/embed/${videoId}?rel=0&amp;controls=0&amp;showinfo=0` || false)"
      width="853"
      height="480"
      frameborder="0"
      allowfullscreen
      v-else-if="source === 'youtube'"
    />
    <LazyLoad
      element-type="iframe"
      :enable="enableLazyLoad"
      :src="lazyLoad(false, `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0` || false)"
      width="500"
      height="281"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
      v-else-if="source === 'vimeo'"
    />
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
      enableLazyLoad: false,
      loaded: false,
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
  methods: {
    lazyLoad: function(value, falseValue = false) {
      return this.enableLazyLoad && !this.loaded ? value : falseValue;
    },
  },
  created() {
    if (this.source === 'file') {
      this.enableLazyLoad = this.loading === 'lazy';
    } else if (['youtube', 'vimeo'].includes(this.source)) {
      this.enableLazyLoad = this.loading === 'lazy' && !('loading' in HTMLImageElement.prototype);
    }
  },
  mounted() {},
};
</script>

<style lang="scss">.c_media_video {
  $self: &;
}
</style>
