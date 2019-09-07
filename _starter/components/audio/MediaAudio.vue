<template>
  <div class="c_audio">
    <LazyLoad element-type="audio" :enable="lazyLoad" :controls="controls" :loop="loop" :src="loaded ? src : false" />
  </div>
</template>

<script>
import LazyLoad from './LazyLoad.vue';

export default {
  components: {
    LazyLoad,
  },
  data() {
    return {
      loaded: false,
    };
  },
  props: {
    controls: { type: Boolean, default: true },
    lazyLoad: { type: Boolean, default: true },
    loop: { type: Boolean, default: false },
    src: { type: String, required: true },
  },
};
</script>

<style lang="scss">
// @import './_source/_css/automated/_colors';
// @import './_source/_css/automated/_fonts';
// @import './_source/_css/base/_variables.scss';
// @import './_source/_css/base/_mixins.scss';

.c_media_audio {
  $self: &;
}
</style>
