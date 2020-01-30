<template>
  <figure :is="background ? elementType : 'figure'" :class="background ? 'c-image_bg' : false">
    <picture class="c-image" :class="{ 'c-image_bg__image': background }">
      <!-- ClientOnly -->
        <LazyLoad
          :key="index"
          :alt="alt && lastSource(index) ? alt : false"
          :after-load="{ src: lastSource(index) ? source.src || placeholder : false, srcset: source.srcset || false }"
          :check-for-native-lazy-load="lazyLoad"
          :element-type="lastSource(index) ? 'img' : 'source'"
          :enabled="lazyLoad"
          :intrinsicsize="source.intrinsicsize || false"
          :loading="loading"
          :media="source.media || false"
          :sizes="lastSource(index) ? source.sizes || '100vw' : false"
          :type="source.type || false"
          :width="source.width || false"
          v-for="(source, index) in sources"
        />
      <!-- /ClientOnly -->
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
    loading: { type: String, default: 'lazy' },
    placeholder: {
      type: String,
      default: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    },
    sizes: { type: String, default: '100vw' },
    sources: { type: Array, required: true },
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
