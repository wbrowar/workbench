<template>
  <figure :is="background ? elementType : 'figure'" :class="classes">
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
        :width="source.width || false"
        :height="source.height || false"
        v-for="(source, index) in sources"
      />
    </picture>
    <figcaption v-if="elementType === 'figure' && caption">{{ caption }}</figcaption>
  </figure>
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
      };
    },
    props: {
      alt: String,
      background: { type: Boolean, default: false },
      caption: String,
      elementType: { type: String, default: 'div' },
      ignoreScheme: { type: Boolean, default: false },
      imageClass: String,
      loading: { type: String, default: 'lazy' },
      pictureClass: String,
      placeholder: {
        type: String,
        default: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      },
      sizes: { type: String, default: '100vw' },
      sources: { type: Array, required: true },
    },
    computed: {
      classes: function() {
        let classes = [];

        if (this.ignoreScheme) {
          classes.push(`c-image-ignore-scheme`);
        }

        if (classes.length) {
          return classes;
        }
      },
      containerClasses: function() {
        let classes = [];

        if (this.background) {
          classes.push(`block w-full h-full`);
        }
        if (this.pictureClass) {
          classes.push(this.pictureClass);
        }

        if (classes.length) {
          return classes;
        }
      },
      imageClasses: function() {
        let classes = [];

        if (this.background) {
          classes.push(`h-full object-cover`);
        }
        if (this.imageClass) {
          classes.push(this.imageClass);
        }

        if (classes.length) {
          return classes;
        }
      },
    },
    methods: {
      lastSource: function(index) {
        return index === this.sources.length - 1;
      },
    },
    created() {
      this.lazyLoad = this.loading === 'lazy';
    },
  };
</script>

<style lang="scss">
  .c-image {
    $self: &;

    @at-root #{$self}:not(.c-image-ignore-scheme) {
      .scheme-dark & {
        img {
          filter: brightness(.8) contrast(1.2);
        }
      }
      @media (prefers-color-scheme: dark) {
        img {
          filter: brightness(.8) contrast(1.2);
        }
      }
    }
  }
</style>