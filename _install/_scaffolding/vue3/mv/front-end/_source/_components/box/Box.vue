<template>
  <div v-is="elementType" :id="addId ? id : null" :ref="id" v-bind="bindAttributes"><slot></slot></div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { log } from 'JS/global';

export default defineComponent({
  name: 'Box',
  components: {},
  props: {
    addId: {
      type: Boolean,
      default: true,
    },
    bindOnEnter: Object,
    bindOnExit: Object,
    elementType: {
      type: String,
      default: 'div',
    },
    watched: {
      type: Boolean,
      default: false,
    },
    watchedRootSelector: String,
    watchedRootMargin: {
      type: String,
      default: '-100px',
    },
    watchedThreshold: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const state = reactive({
      bindAttributes: {},
      id: null,
      watchedObserver: null,
    });

    return {
      ...toRefs(state),
    };
  },
  computed: {},
  methods: {
    addToWatchedObserver() {
      if (this.watched) {
        let options = {
          root: this.watchedRootSelector ? document.querySelector(`${this.watchedRootSelector}`) : null,
          rootMargin: this.watchedRootMargin,
          threshold: this.watchedThreshold,
        };

        this.watchedObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            log('Intersection', this.id, entry.isIntersecting, entry.intersectionRatio);
            this.watchedObserverCallback(entry.isIntersecting);
            // Each entry describes an intersection change for one observed
            // target element:
            //   entry.boundingClientRect
            //   entry.intersectionRatio
            //   entry.intersectionRect
            //   entry.isIntersecting
            //   entry.rootBounds
            //   entry.target
            //   entry.time
          });
        }, options);

        log('hey this id', this.$refs.box);
        this.watchedObserver.observe(this.$el);
      }
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
    removeFromWatchedObserver() {
      if (this.watchedObserver) {
        this.watchedObserver.disconnect();
      }
    },
    watchedObserverCallback(isIntersecting = true) {
      if (isIntersecting) {
        log('Entering Viewport', this.id);
        this.$emit('enter-viewport', this.id);

        if (this.bindOnEnter) {
          this.bindAttributes = this.bindOnEnter;
        }
      } else {
        log('Exiting Viewport', this.id);
        this.$emit('exit-viewport', this.id);

        if (this.bindOnExit) {
          this.bindAttributes = this.bindOnExit;
        }
      }
    },
  },
  mounted() {
    this.id = `box-${this._.uid}`;

    if (this.inViewport()) {
      log('Box in Viewport');
      this.watchedObserverCallback();
    } else {
      this.addToWatchedObserver();
    }

    log(`Loaded Box`);
  },
  unmounted() {
    this.removeFromWatchedObserver();
  },
});
</script>
