<template>
  <div :is="elementType" class="c-video relative" :class="classes" :style="{ '--aspect-ratio': aspectRatio }">
    <MediaImage
      :class="videoClasses"
      :background="background"
      :alt="posterAsset.title"
      :sources="[
        {
          height: posterAsset.ioArticleThumb.placeholderHeight,
          type: 'image/webp',
          srcset: posterAsset.ioArticleThumb.srcsetWebp,
          width: posterAsset.ioArticleThumb.placeholderWidth,
        },
        {
          height: posterAsset.ioArticleThumb.placeholderHeight,
          srcset: posterAsset.ioArticleThumb.srcset,
          width: posterAsset.ioArticleThumb.placeholderWidth,
        },
      ]"
      v-if="posterAsset && reduceMotion"
    />
    <video
      ref="video"
      :class="videoClasses"
      :autoplay="background ? !reduceMotion : autoplay"
      :controls="background ? false : controls"
      :loop="background ? true : loop"
      :muted="background ? true : muted"
      :playsinline="background ? 'playsinline' : playsinline ? 'playsinline' : null"
      :poster="poster || null"
      :src="src || null"
      v-else-if="source === 'file'"
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

<script lang="ts">
import { defineComponent, InjectionKey } from '@nuxtjs/composition-api';
import { mapState, Store } from 'vuex';
import MediaImage from 'Components/image/MediaImage.vue';
import { StoreState } from 'Types/types';

// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<StoreState>> = Symbol();

export default defineComponent({
  name: 'MediaVideo',
  components: {
    MediaImage,
  },
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
    posterAsset: Object,
    source: { type: String, default: 'file' }, // file, youtube, vimeo
    src: String,
    videoClass: String,
    videoId: String,
  },
  computed: {
    classes(): string[] | null {
      const classes = [''];

      if (this.background) {
        classes.push(`w-full h-full`);
      } else {
        classes.push(`w-full aspect`);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
    videoClasses(): string[] | null {
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
    ...mapState<StoreState>({
      reduceMotion: (state: StoreState) => state.reduceMotion,
    }),
  },
  watch: {
    reduceMotion() {
      const video = (this.$refs?.video as HTMLVideoElement) || null;
      if (this.reduceMotion && video) {
        video.pause();
      } else if (this.$refs?.video) {
        video.play();
      }
    },
  },
});
</script>
