<template>
  <div :is="elementType" v-bind="loadAttributes"><slot /></div>
</template>

<script>
import { log, processIsClient } from 'JS/global';

export default {
  name: 'LazyLoad',
  data() {
    return {
      loaded: false,
      nativeLazyLoad: false,
      observer: false,
    };
  },
  props: {
    afterLoad: Object,
    beforeLoad: Object,
    checkForNativeLazyLoad: { type: Boolean, default: false },
    elementType: { type: String, default: 'div' },
    enabled: { type: Boolean, default: true },
    observerMargin: { type: String, default: '50%' },
    observerThreshold: { type: Number, default: 0 },
  },
  computed: {
    loadAttributes() {
      if (this.loaded && this.afterLoad) {
        return this.afterLoad;
      } else if (this.beforeLoad) {
        return this.beforeLoad;
      }
      return null;
    },
  },
  methods: {
    addToObserver() {
      if (processIsClient()) {
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
      }
    },
    handleLazy() {
      log('Handling Lazy Load');
      this.removeFromObserver();
      this.loaded = true;
      this.$emit('loaded');
    },
    inViewport() {
      const rect = this.$el.getBoundingClientRect();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    removeFromObserver() {
      if (this.observer) {
        log('Removing from Load Observer');
        this.observer.disconnect();
      }
    },
  },
  mounted() {
    if (processIsClient()) {
      if (this.checkForNativeLazyLoad) {
        this.nativeLazyLoad = 'loading' in HTMLImageElement.prototype;
      }
    }
    if (this.enabled) {
      if (this.checkForNativeLazyLoad ? !this.nativeLazyLoad : true) {
        if (this.inViewport()) {
          log('Lazy Load in Viewport');
          this.handleLazy();
        } else {
          this.addToObserver();
        }
      } else {
        this.handleLazy();
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
