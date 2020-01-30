<template>
  <Box :element-type="elementType" :class="animated ? 'c-animate--animated' : false" :style="styles" v-bind="box">
    <slot></slot>
  </Box>
</template>

<script>
import { log, warn } from 'JS/global.js';
import * as io from 'intersection-observer';
import Box from 'Components/box/Box.vue';

let animations = false;

export default {
  components: {
    Box,
  },
  data() {
    return {
      animated: false,
      cssStyles: false,
      observer: false,
    };
  },
  props: {
    box: {
      type: Object,
      default: () => {
        return {};
      },
    },
    cssAnimation: String,
    cssEnd: {
      type: Object,
      default: () => {
        return {};
      },
    },
    cssStart: {
      type: Object,
      default: () => {
        return {};
      },
    },
    cssTransition: String,
    elementType: { type: String, default: 'div' },
    observerMargin: { type: String, default: '-100px' },
    observerThreshold: { type: Number, default: 0 },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    reset: { type: Boolean, default: false },
    type: { type: String, default: 'css' },
  },
  computed: {
    styles: function() {
      let styles = this.animated ? this.cssEnd : this.cssStart;

      if (this.cssAnimation) {
        styles.animation = this.animated ? this.cssAnimation : null;
      } else if (this.cssTransition) {
        styles.transition = this.cssTransition;
      }

      return styles;
    },
  },
  methods: {
    addToObserver: function(callback) {
      log('Adding to Animate Observer');

      if (typeof this.observer !== 'object') {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (this.reset) {
                  this.animated = false;
                }
                callback();
              }
            });
          },
          {
            rootMargin: this.observerMargin,
            threshold: this.observerThreshold,
          }
        );
      }
      this.observer.observe(this.$el);
    },
    handleCssAnimation: function() {
      log('Handling Lazy Animate (css)');

      if (!this.reset) {
        this.removeFromObserver();
      }
      this.animated = true;
    },
    handleJsAnimation: function() {
      log('Handling Lazy Animate (js)');

      animations.animate(this.type, this.$el, this.options);

      if (!this.reset) {
        this.removeFromObserver();
      }
      this.animated = true;
    },
    inViewport: function() {
      const rect = this.$el.getBoundingClientRect();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    removeFromObserver: function() {
      if (this.observer) {
        log('Removing from Animate Observer');
        this.observer.disconnect();
      }
    },
  },
  mounted() {
    if (this.type === 'css') {
      if (this.inViewport()) {
        log('Lazy Animate in Viewport');
        this.handleCssAnimation();
      } else {
        this.addToObserver(this.handleCssAnimation);
      }
    } else {
      import(/* webpackChunkName: "animation" */ 'JS/animation.js')
        .then((module) => {
          animations = module;
          if (this.inViewport()) {
            log('Lazy Animate in Viewport');
            this.handleJsAnimation();
          } else {
            this.addToObserver(this.handleJsAnimation);
          }
        })
        .catch((error) => warn('An error occurred while loading animation.js'));
    }
  },
  destroyed() {
    if (this.observer) {
      this.removeFromObserver();
    }
  },
};
</script>
