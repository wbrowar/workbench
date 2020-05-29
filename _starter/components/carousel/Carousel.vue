<template>
  <div
    class="c-carousel relative overflow-hidden"
    :class="classes"
    :style="styles"
    @mouseenter="pauseAutoplay = true"
    @mouseleave="pauseAutoplay = false"
    :aria-labelledby="`carousel-${uId}`"
  >
    <h3 :id="`carousel-${uId}`" class="sr-only" v-if="carouselHeading">{{ carouselHeading }}</h3>
    <ul class="relative w-full h-full">
      <slot />
    </ul>
    <slot name="controls" v-if="isActive" />
    <ul :class="indicatorWrapperClass" v-if="isActive">
      <li
        :class="[indicatorClass, { [indicatorCurrentClass]: index === currentSlideIndex + 1 }]"
        v-for="index in slides.length"
        :key="index"
        @click="goToSlideIndex(index - 1)"
      >
        <span :class="{ 'sr-only': !indicatorNumbers }">{{ index }}</span>
      </li>
    </ul>
    <div aria-live="polite" aria-atomic="true" class="sr-only" v-if="isActive">
      Item {{ currentSlideIndex + 1 }} of {{ slides.length }}
    </div>
  </div>
</template>

<script>
import { log } from 'JS/global.js';

export default {
  components: {},
  data() {
    return {
      currentSlideIndex: 0,
      direction: 'next', // next, prev
      intervalTimer: false,
      pauseAutoplay: false,
      slides: [],
      status: 'loading',
      uId: 0,
    };
  },
  props: {
    autoplay: { type: Boolean, default: false },
    carouselHeading: String,
    debounceDuration: { type: Number, default: 500 },
    height: { type: Number, required: true },
    indicatorClass: { type: String, default: 'p-2 bg-white cursor-pointer' },
    indicatorCurrentClass: { type: String, default: 'bg-black-80 text-white' },
    indicatorNumbers: { type: Boolean, default: false },
    indicatorWrapperClass: {
      type: String,
      default: 'flex items-center justify-center mx-auto absolute bottom-0 inset-x-0 space-x-3 mb-2 z-30',
    },
    interval: { type: Number, default: 5000 },
    transitionType: {
      type: String,
      default: 'fade',
    },
  },
  computed: {
    classes() {
      const classes = [];

      classes.push(`w-full`);

      return classes;
    },
    isActive() {
      return this.slidesTotal > 1;
    },
    slidesTotal() {
      return this.slides.length;
    },
    styles() {
      const styles = {};

      if (this.height) {
        styles.height = `${this.height}px`;
      }

      return styles;
    },
    transitionName() {
      if (this.status === 'loading') {
        return 'none';
      }

      return `${this.transitionType}-${this.direction}`;
    },
  },
  methods: {
    goToNextSlide() {
      if (this.isActive && this.status === 'idle') {
        this.direction = 'next';
        this.currentSlideIndex++;
        this.updateSlides();
      }
    },
    goToPrevSlide() {
      if (this.isActive && this.status === 'idle') {
        this.direction = 'prev';
        this.currentSlideIndex--;
        this.updateSlides();
      }
    },
    goToSlideIndex(index) {
      if (this.isActive && this.status === 'idle') {
        this.direction = this.currentSlideIndex < index ? 'prev' : 'next';
        this.currentSlideIndex = index;
        this.updateSlides();
      }
    },
    updateSlides() {
      if (this.isActive && this.status !== 'animating') {
        this.status = 'animating';

        // Validate current slide index
        if (this.currentSlideIndex < 0) {
          this.currentSlideIndex = this.slides.length - 1;
        } else if (this.currentSlideIndex > this.slides.length - 1) {
          this.currentSlideIndex = 0;
        }

        // Update slides
        const slidesTotal = this.slides.length;
        for (let i = 0; i < slidesTotal; i++) {
          const slide = this.slides[i];

          // Update transition type if direction has changed
          slide.updateTransitionName(this.transitionName);

          // Move slides based on current slide index
          if (i === this.currentSlideIndex) {
            slide.isCurrent = true;
          } else {
            slide.isCurrent = false;
          }
        }

        setTimeout(() => {
          this.status = 'idle';
        }, this.debounceDuration);
      }
    },
  },
  created() {
    const uId = Math.floor(Math.random() * 100000000000);
    this.uId = uId;

    this.$on('carouselGoTo', this.goToSlideIndex);
    this.$on('carouselGoToNext', this.goToNextSlide);
    this.$on('carouselGoToPrev', this.goToPrevSlide);
  },
  mounted() {
    log('Slides', this.$children);

    // Get slides from child components
    this.slides = this.$children.filter((item) => {
      return item.$options._componentTag === 'CarouselSlide';
    });

    // Set up slides
    if (this.isActive) {
      this.slides.forEach((slide) => {
        slide.transitionType = this.transitionType;
      });
    }

    // Set initial slide
    this.updateSlides();

    this.intervalTimer = setInterval(() => {
      if (this.autoplay && !this.pauseAutoplay && this.status === 'idle') {
        this.goToNextSlide();
      }
    }, this.interval);
  },
  destroyed() {
    clearInterval(this.intervalTimer);
  },
};
</script>

<style lang="scss">
.c-carousel {
  $self: &;
}
</style>
