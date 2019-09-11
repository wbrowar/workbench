<template>
  <div :is="elementType"><slot></slot></div>
</template>

<script>
import { log } from 'starter/_js/global.js';
import * as io from 'intersection-observer';

export default {
  data() {
    return {
      loaded: false,
      observer: false,
    };
  },
  props: {
    elementType: { type: String, default: 'div' },
    enable: { default: true },
    observerMargin: { default: '50%' },
    observerThreshold: { default: 0 },
  },
  methods: {
    addToObserver: function() {
      log('Adding to Load Observer');
      if (typeof this.observer !== 'object') {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.handleLazy();
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
    handleLazy: function() {
      log('Handling Lazy Load');
      if (this.$parent.loaded !== undefined) {
        this.$parent.loaded = true;
        this.removeFromObserver();
      }
      this.loaded = true;
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
        log('Removing from Load Observer');
        this.observer.disconnect();
      }
    },
  },
  created() {},
  mounted() {
    if (this.enable) {
      if (this.inViewport()) {
        log('Lazy Load in Viewport');
        this.handleLazy();
      } else {
        this.addToObserver();
      }
    } else {
      this.handleLazy();
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
@import "starter/_css/automated/_colors.scss";
@import "starter/_css/base/_functions.scss";
@import "starter/_css/base/_variables.scss";
@import 'starter/_css/base/_mixins.scss";

.c_lazy_load {
  $self: &;
}
</style>
