<template>
  <div :is="elementType" class="c-lazy-animate" v-bind="computedAttributes">
    <slot></slot>
  </div>
</template>

<script>
import { log, warn, processIsClient } from 'JS/global';
import { merge } from 'lodash';

let animations = false;

export default {
  name: 'LazyAnimate',
  data() {
    return {
      animated: false,
      animationsLoaded: false,
      observer: false,
    };
  },
  props: {
    afterAnimate: Object,
    animation: Object,
    beforeAnimate: Object,
    elementType: { type: String, default: 'div' },
    observerBind: Object,
    observerMargin: { type: String, default: '-100px' },
    observerThreshold: { type: Number, default: 0 },
    reset: { type: Boolean, default: false },
  },
  computed: {
    computedAttributes() {
      const attributes = {};

      if (this.animated) {
        attributes.class = 'animated';
      }
      if (this.observer && this.observerBind) {
        this.mergeAttributes(attributes, this.observerBind);
      }
      if (!this.animated && this.beforeAnimate) {
        this.mergeAttributes(attributes, this.beforeAnimate);
      } else if (this.animated && this.afterAnimate) {
        this.mergeAttributes(attributes, this.afterAnimate);
      }

      return Object.keys(attributes).length ? attributes : null;
    },
  },
  methods: {
    addToObserver(callback) {
      if (processIsClient()) {
        log('Adding to Animate Observer');

        if (typeof this.observer !== 'object') {
          this.observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  this.$emit('intersected');
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
      }
      this.observer.observe(this.$el);
    },
    animate() {
      log('Handling Lazy Animate (css)');

      if (this.animation?.type) {
        animations.animate(this.animation.type, this.$el, this.animation.options || null);
      }

      this.$emit('animated');

      if (!this.reset) {
        this.removeFromObserver();
      }
      this.animated = true;
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
    mergeAttributes(attributes, newAttributes) {
      const classes = attributes.class && newAttributes.class ? `${attributes.class} ${newAttributes.class}` : null;

      merge(attributes, newAttributes);

      if (classes && attributes.class) {
        attributes.class = classes;
      }
    },
    removeFromObserver() {
      if (this.observer) {
        log('Removing from Animate Observer');
        this.observer.disconnect();
      }
    },
  },
  mounted() {
    if (processIsClient()) {
      if (this.animationsLoaded) {
        if (this.inViewport()) {
          log('Lazy Animate in Viewport');
          this.animate();
        } else {
          this.addToObserver(this.animate);
        }
      } else {
        import(/* webpackChunkName: "animation" */ 'JS/animation.ts')
          .then((module) => {
            animations = module;
            this.animationsLoaded = true;
            if (this.inViewport()) {
              log('Lazy Animate in Viewport');
              this.animate();
            } else {
              this.addToObserver(this.animate);
            }
          })
          .catch((error) => warn('An error occurred while loading animation.ts', error));
      }
    }
  },
  beforeDestroy() {
    this.removeFromObserver();
  },
};
</script>
