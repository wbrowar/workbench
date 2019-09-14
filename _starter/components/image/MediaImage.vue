<template>
  <figure :is="background ? 'div' : 'figure'" :class="background ? 'c_image_bg' : false">
    <picture class="c_image" :class="{ c_image_bg__image: background }">
      <LazyLoad
        :key="index"
        :alt="alt && lastSource(index)"
        :element-type="lastSource(index) ? 'img' : 'source'"
        :enable="enableLazyLoad"
        :height="source.height || false"
        :intrinsicsize="source.intrinsicsize || false"
        :loading="loading"
        :media="source.media || false"
        :src="lazyLoad(false, lastSource(index) ? source.src || placeholder : false)"
        :srcset="lazyLoad(false, source.srcset || false)"
        :type="source.type || false"
        :width="source.width || false"
        v-for="(source, index) in sources"
      />
    </picture>
    <figcaption v-if="elementType === 'figure' && caption">{{ caption }}</figcaption>
  </figure>
</template>

<script>
import LazyLoad from './LazyLoad.vue';

export default {
  components: {
    LazyLoad,
  },
  data() {
    return {
      elementType: 'figure',
      enableLazyLoad: false,
      loaded: false,
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
    lazyLoad: function(value, falseValue = false) {
      return this.enableLazyLoad && !this.loaded ? value : falseValue;
    },
  },
  created() {
    this.enableLazyLoad = this.loading === 'lazy' && !('loading' in HTMLImageElement.prototype);
  },
};
</script>