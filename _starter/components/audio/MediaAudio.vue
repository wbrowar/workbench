<template>
  <div class="c_audio">
    <ClientOnly>
      <LazyLoad
        :after-load="{ src: src || false }"
        element-type="audio"
        :enable="lazyLoad"
        :controls="controls"
        :loop="loop"
      />
    </ClientOnly>
  </div>
</template>

<script>
import LazyLoad from 'Components/lazy_load/LazyLoad.vue';

export default {
  data() {
    return {
      lazyLoad: false,
    };
  },
  components: {
    LazyLoad,
  },
  props: {
    controls: { type: Boolean, default: true },
    loading: { type: String, default: 'lazy' },
    loop: { type: Boolean, default: false },
    src: { type: String, required: true },
  },
  created() {
    this.lazyLoad = this.loading === 'lazy';
  },
};
</script>
