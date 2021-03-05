<template>
  <figure :is="background ? elementType : 'figure'" :class="classes">
    <picture class="c-image" :class="containerClasses">
      <img
        :class="imageClasses"
        :key="index"
        :alt="alt && lastSource(index) ? alt : null"
        :element-type="lastSource(index) ? 'img' : 'source'"
        :media="source.media || null"
        :sizes="source.sizes || null"
        :type="source.type || null"
        :src="source.src || null"
        :srcset="source.srcset || null"
        :width="source.width || null"
        :height="source.height || null"
        v-for="(source, index) in filteredSources"
      />
    </picture>
    <figcaption :class="captionClass" v-if="elementType === 'figure' && caption">{{ caption }}</figcaption>
  </figure>
</template>

<script>
import settings from 'JS/automated/settings.js';

export default {
  name: 'MediaImage',
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
        classes.push(`image-ignore-scheme`);
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
        if ((settings.enableWebp && source.type === 'image/webp') || source.type !== 'image/webp') {
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

<style scoped>
.c-image {
  &:not(.image-ignore-scheme) {
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
