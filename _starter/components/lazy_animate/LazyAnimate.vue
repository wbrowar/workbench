<template>
  <div :class="animated ? 'c_animate--animated' : false" :style="animated ? endCss : startCss"><slot></slot></div>
</template>

<script>
import { log, warn } from '../global.js';
import * as io from 'intersection-observer';

let animations = false;

export default {
  data() {
    return {
      animated: false,
      cssStyles: false,
      observer: false,
    };
  },
  props: {
    endCss: false,
    observerMargin: { default: '-100px' },
    observerThreshold: { default: 0 },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    startCss: false,
    type: { default: 'css' },
  },
  methods: {
    addToObserver: function(callback) {
      log('Adding to Animate Observer');
      if (typeof this.observer !== 'object') {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
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

      this.removeFromObserver();
      this.animated = true;
    },
    handleJsAnimation: function() {
      log('Handling Lazy Animate (js)');

      animations.animate(this.type, this.$el, this.options);

      this.removeFromObserver();
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
  created() {},
  mounted() {
    if (this.type === 'css') {
      if (this.inViewport()) {
        log('Lazy Animate in Viewport');
        this.handleCssAnimation();
      } else {
        this.addToObserver(this.handleCssAnimation);
      }
    } else {
      import(/* webpackChunkName: "animation" */ '../animation.js')
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

<style lang="scss">
// @import './_source/_css/automated/_colors';
// @import './_source/_css/automated/_fonts';
// @import './_source/_css/base/_variables.scss';
// @import './_source/_css/base/_mixins.scss';

.c_lazy_animate {
  $self: &;
}
</style>
