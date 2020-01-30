<template>
  <div class="c-resize_container" :class="wrapperClasses" :style="wrapperStyles"><slot></slot></div>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill';
import { error, log } from 'JS/global.js';

export default {
  data() {
    return {
      currentSize: {},
      sizes: {},
    };
  },
  props: {
    mqSizes: { required: true },
    rootClass: { default: '' },
  },
  computed: {
    wrapperClasses: function() {
      let classes = [];

      if (this.currentSize.classes) {
        this.currentSize.classes.forEach((item) => {
          classes.push(this.rootClass + '--' + item);
        });
      }

      return classes;
    },
    wrapperStyles: function() {
      let styles = {};

      if (this.currentSize.styles) {
        styles = this.currentSize.styles;
      }

      return styles;
    },
  },
  methods: {},
  created() {
    this.sizes = JSON.parse(this.mqSizes);
  },
  mounted() {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { left, top, width, height } = entry.contentRect;
        log('Resizing', entry, left, top, width, height);

        this.currentSize = {};
        this.sizes.forEach((size) => {
          if (width >= size.width) {
            this.currentSize = size;
          }
        });
      }
    });
    resizeObserver.observe(this.$el);
  },
};
</script>
