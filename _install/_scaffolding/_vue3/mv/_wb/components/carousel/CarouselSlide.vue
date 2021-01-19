<template>
  <transition :name="transitionName">
    <li
      class="c-carousel-slide absolute top-0 w-full h-full"
      :class="{ current: isCurrent }"
      :style="styles"
      :aria-hidden="!isCurrent"
      v-show="isCurrent"
    >
      <slot />
    </li>
  </transition>
</template>

<script>
// import { log } from 'JS/global.js';

export default {
  name: 'CarouselSlide',
  data() {
    return {
      isCurrent: false,
      transitionName: 'none',
    };
  },
  computed: {
    styles() {
      const styles = {};

      if (this.isCurrent) {
        styles.zIndex = '1';
      }

      return styles;
    },
  },
  methods: {
    updateTransitionName(name) {
      if (name.startsWith('fade-')) {
        this.transitionName = 'fade';
      } else {
        this.transitionName = name;
      }
    },
  },
};
</script>

<style scoped>
@keyframes slideLeftIn {
  0% {
    left: 100%;
  }
  100% {
    left: 0;
  }
}
@keyframes slideLeftOut {
  0% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}
@keyframes slideRightIn {
  0% {
    left: -100%;
  }
  100% {
    left: 0;
  }
}
@keyframes slideRightOut {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: var(--slide-transiton-duration, 0.75s);
  transition-timing-function: var(--slide-transiton-timing, ease-out);
  transition-delay: var(--slide-transiton-delay);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-next-enter-active {
  animation-name: slideLeftIn;
  animation-duration: var(--slide-transiton-duration, 0.5s);
  animation-timing-function: var(--slide-transiton-timing, ease-in-out);
  animation-delay: var(--slide-transiton-delay);
}
.slide-next-leave-active {
  animation-name: slideLeftOut;
  animation-duration: var(--slide-transiton-duration, 0.5s);
  animation-timing-function: var(--slide-transiton-timing, ease-in-out);
  animation-delay: var(--slide-transiton-delay);
}
.slide-prev-enter-active {
  animation-name: slideRightIn;
  animation-duration: var(--slide-transiton-duration, 0.5s);
  animation-timing-function: var(--slide-transiton-timing, ease-in-out);
  animation-delay: var(--slide-transiton-delay);
}
.slide-prev-leave-active {
  animation-name: slideRightOut;
  animation-duration: var(--slide-transiton-duration, 0.5s);
  animation-timing-function: var(--slide-transiton-timing, ease-in-out);
  animation-delay: var(--slide-transiton-delay);
}
</style>
