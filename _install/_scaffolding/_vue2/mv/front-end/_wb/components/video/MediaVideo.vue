<template>
  <div :element-type="elementType" class="c-video relative" :class="classes" :style="{ '--aspect-ratio': aspect }">
    <video
        :class="videoClasses"
        :autoplay="background ? true : autoplay"
        :controls="background ? false : controls"
        :loop="background ? true : loop"
        :muted="background ? true : muted"
        :playsinline="background ? 'playsinline' : playsinline ? 'playsinline' : null"
        :poster="poster || null"
        :src="src || null"
        v-if="source === 'file'"
    />
    <iframe
        :class="videoClasses"
        allowfullscreen
        frameborder="0"
        height="480"
        :loading="loading"
        :src="videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&amp;controls=0&amp;showinfo=0` : null"
        width="853"
        v-else-if="source === 'youtube'"
    />
    <iframe
        :class="videoClasses"
        allowfullscreen
        mozallowfullscreen
        webkitallowfullscreen
        :src="videoId ? `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0` : null"
        frameborder="0"
        height="281"
        :loading="loading"
        width="500"
        v-else-if="source === 'vimeo'"
    />
  </div>
</template>

<script>
export default {
  name: 'MediaVideo',
  components: {},
  props: {
    aspectRatio: { type: String, default: '16 / 9' },
    autoplay: { type: Boolean, default: false },
    background: { type: Boolean, default: false },
    controls: { type: Boolean, default: true },
    elementType: { type: String, default: 'div' },
    loading: { type: String, default: 'lazy' }, // lazy, auto, eager
    loop: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    playsinline: { type: Boolean, default: false },
    poster: String,
    source: { type: String, default: 'file' }, // file, youtube, vimeo
    src: String,
    videoClass: String,
    videoId: String,
  },
  computed: {
    aspect() {
      const aspect = this.aspectRatio.split(' ');
      return `${(aspect[2] / aspect[0]) * 100}%`;
    },
    classes() {
      const classes = [];

      if (this.background) {
        classes.push(`w-full h-full`);
      } else {
        classes.push(`w-full pb-aspect`);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
    videoClasses() {
      const classes = [];

      classes.push(`absolute w-full h-full object-cover`);

      if (this.videoClass) {
        classes.push(this.videoClass);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
  },
};
</script>
