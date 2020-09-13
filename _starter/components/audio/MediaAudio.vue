<template>
  <div class="c-audio">
    <LazyLoad
      class="w-full"
      :class="auidoClass"
      :after-load="{ src: src || false }"
      element-type="audio"
      :enable="lazyLoad"
      :controls="controls"
      :loop="loop"
    />
  </div>
</template>

<script>
import LazyLoad from 'Components/lazy_load/LazyLoad.vue';

export default {
  name: 'MediaAudio',
  data() {
    return {
      lazyLoad: false,
    };
  },
  components: {
    LazyLoad,
  },
  props: {
    auidoClass: String,
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
