<template>
  <button class="c-carousel-control" @click="handleClick"><slot></slot></button>
</template>

<script>
// import { log } from 'JS/global.js';

export default {
  name: 'CarouselControl',
  components: {},
  data() {
    return {};
  },
  props: {
    controls: Array,
    goTo: Number,
    next: { type: Boolean, default: false },
    prev: { type: Boolean, default: false },
  },
  computed: {},
  methods: {
    handleClick() {
      if (this.controls) {
        // Control referenced carousels
        this.controls.forEach((carousel) => {
          if (this.goTo !== undefined) {
            carousel.goToSlideIndex(this.goTo);
          } else if (this.next) {
            carousel.goToNextSlide();
          } else if (this.prev) {
            carousel.goToPrevSlide();
          }
        });
      } else if (this.$parent.$options._componentTag === 'Carousel') {
        // Control parent carousel
        if (this.goTo !== undefined) {
          this.$parent.$emit('carousel-go-to', this.goTo);
        } else if (this.next) {
          this.$parent.$emit('carousel-go-to-next');
        } else if (this.prev) {
          this.$parent.$emit('carousel-go-to-prev');
        }
      }

      if (this.goTo !== undefined) {
        this.$emit('on-go-to', this.goTo);
      } else if (this.next) {
        this.$emit('on-go-to-next');
      } else if (this.prev) {
        this.$emit('on-go-to-prev');
      }
    },
  },
  created() {},
  mounted() {},
};
</script>
