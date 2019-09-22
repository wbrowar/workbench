<template>
  <figure :is="background ? 'div' : 'figure'" :class="background ? 'c_image_bg' : false">
    <picture class="c_image" :class="{ c_image_bg__image: background }">
      <ClientOnly>
        <LazyLoad
          :key="index"
          :alt="alt && lastSource(index)"
          :after-load="{ src: lastSource(index) ? source.src || placeholder : false, srcset: source.srcset || false }"
          :check-for-native-lazy-load="lazyLoad"
          :element-type="lastSource(index) ? 'img' : 'source'"
          :enabled="lazyLoad"
          :height="source.height || false"
          :intrinsicsize="source.intrinsicsize || false"
          :loading="loading"
          :media="source.media || false"
          :type="source.type || false"
          :width="source.width || false"
          v-for="(source, index) in sources"
        />
      </ClientOnly>
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
      elementType: 'figure',
      lazyLoad: false,
    };
  },
  props: {
    alt: String,
    background: { type: Boolean, default: false },
    caption: String,
    intrinsicsize: String,
    loading: { default: 'lazy' },
    placeholder: { default: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' },
    sizes: { default: '100vw' },
    sources: { type: Array, required: true },
    type: { default: 'figure' },
    width: Number,
    height: Number,
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