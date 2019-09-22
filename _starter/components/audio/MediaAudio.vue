<template>
  <div class="c_audio">
    <ClientOnly>
      <LazyLoad :after-load="{ src: src || false }" element-type="audio" :enable="lazyLoad" :controls="controls" :loop="loop" />
    </ClientOnly>
  </div>
</template>

<script>
import LazyLoad from 'Components/lazy_load/LazyLoad.vue';

export default {
  components: {
    LazyLoad,
  },
  props: {
    controls: { type: Boolean, default: true },
    lazyLoad: { type: Boolean, default: true },
    loop: { type: Boolean, default: false },
    src: { type: String, required: true },
  },
};
</script>
