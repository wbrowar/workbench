<template>
  <figure v-is="background ? elementType : 'figure'" :class="classes">
    <picture class="c-image" :class="containerClasses">
      <LazyLoad
        :class="imageClasses"
        :key="index"
        :alt="alt && lastSource(index) ? alt : false"
        :after-load="{ src: lastSource(index) ? source.src || placeholder : false, srcset: source.srcset || false }"
        :check-for-native-lazy-load="lazyLoad"
        :element-type="lastSource(index) ? 'img' : 'source'"
        :enabled="lazyLoad"
        :loading="loading"
        :media="source.media || false"
        :sizes="lastSource(index) ? source.sizes || '100vw' : false"
        :type="source.type || false"
        :src="lastSource(index) ? placeholder : null"
        :width="source.width || false"
        :height="source.height || false"
        v-for="(source, index) in filteredSources"
      />
    </picture>
    <figcaption :class="captionClass" v-if="elementType === 'figure' && caption">{{ caption }}</figcaption>
  </figure>
</template>

<script>
import wb from 'JS/automated/wb.js';
import LazyLoad from 'Components/lazy_load/LazyLoad.vue';

export default {
  name: 'MediaImage',
  components: {
    LazyLoad,
  },
  data() {
    return {
      lazyLoad: false,
    };
  },
  props: {
    alt: String,
    background: { type: Boolean, default: false },
    caption: String,
    captionClass: String,
    elementType: { type: String, default: 'div' },
    ignoreScheme: { type: Boolean, default: false },
    imageClass: String,
    loading: {
      type: String,
      default: 'lazy',
      validator: (value) => ['auto', 'eager', 'lazy'].includes(value),
    },
    pictureClass: String,
    placeholder: {
      type: String,
      default: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    },
    sizes: { type: String, default: '100vw' },
    sources: { type: Array, required: true },
  },
  computed: {
    classes() {
      const classes = [];

      if (this.ignoreScheme) {
        classes.push(`c-image-ignore-scheme`);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
    containerClasses() {
      const classes = [];

      if (this.background) {
        classes.push(`block w-full h-full`);
      }
      if (this.pictureClass) {
        classes.push(this.pictureClass);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
    filteredSources() {
      const sources = [];

      this.sources.forEach((source) => {
        if ((wb.enableWebp && source.type === 'image/webp') || source.type !== 'image/webp') {
          sources.push(source);
        }
      });

      return sources;
    },
    imageClasses() {
      const classes = [];

      if (this.background) {
        classes.push(`h-full object-cover`);
      }
      if (this.imageClass) {
        classes.push(this.imageClass);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
  },
  methods: {
    lastSource(index) {
      return index === this.sources.length - 1;
    },
  },
  created() {
    this.lazyLoad = this.loading === 'lazy';
  },
};
</script>

<style>
.c-image {
  &:not(.c-image-ignore-scheme) {
    .scheme-dark & {
      img {
        filter: brightness(0.8) contrast(1.2);
      }
    }
    @media (prefers-color-scheme: dark) {
      img {
        filter: brightness(0.8) contrast(1.2);
      }
    }
  }
}
</style>
