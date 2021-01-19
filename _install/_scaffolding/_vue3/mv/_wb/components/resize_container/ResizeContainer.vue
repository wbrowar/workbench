<template>
  <div :is="elementType" class="c-resize-container" v-bind="computedAttributes"><slot></slot></div>
</template>

<script>
import { log, processIsClient } from 'JS/global.js';
import { merge } from 'lodash';

export default {
  name: 'ResizeContainer',
  data() {
    return {
      currentHeight: 0,
      currentWidth: 0,
      observer: false,
    };
  },
  props: {
    elementType: { type: String, default: 'div' },
    heights: Array,
    replacements: Array,
    widths: Array,
  },
  computed: {
    computedAttributes() {
      const attributes = {};

      if (this.replacements) {
        // Find replacements that include current width and/or height
        // If width and height properties are found, both need to match to use replacements
        this.replacements.forEach((replacement) => {
          let enabled = false;

          if (replacement.height !== undefined && replacement.width !== undefined) {
            if (replacement.height === this.currentHeight && replacement.width === this.currentWidth) {
              enabled = true;
            }
          } else if (replacement.height !== undefined) {
            if (replacement.height === this.currentHeight) {
              enabled = true;
            }
          } else if (replacement.width !== undefined) {
            if (replacement.width === this.currentWidth) {
              enabled = true;
            }
          }

          if (enabled) {
            merge(attributes, replacement.bind);
          }
        });
      }

      return Object.keys(attributes).length ? attributes : null;
    },
    heightBreakpoints() {
      const heights = [];

      if (this.replacements) {
        this.replacements.forEach((replacement) => {
          if (replacement.height !== undefined) {
            heights.push(replacement.height);
          }
        });
      }
      if (this.heights) {
        heights.push(...this.heights);
      }

      return heights.length ? heights : null;
    },
    widthBreakpoints() {
      const widths = [];

      if (this.replacements) {
        this.replacements.forEach((replacement) => {
          if (replacement.width !== undefined) {
            widths.push(replacement.width);
          }
        });
      }
      if (this.widths) {
        widths.push(...this.widths);
      }

      return widths.length ? widths : null;
    },
  },
  methods: {
    removeFromObserver() {
      if (this.observer && this.$el) {
        log('Removing from Animate Observer');
        this.observer.unobserve(this.$el);
      }
    },
  },
  mounted() {
    if (processIsClient(process)) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          // log('Resizing', entry, left, top, width, height);

          if (this.heightBreakpoints) {
            let newHeight = 0;
            this.heightBreakpoints.forEach((heightSize) => {
              if (height >= heightSize) {
                newHeight = heightSize;
              }
            });
            if (this.currentHeight !== newHeight) {
              this.currentHeight = newHeight;
            }
          }
          if (this.widthBreakpoints) {
            let newWidth = 0;
            this.widthBreakpoints.forEach((widthSize) => {
              if (width >= widthSize) {
                newWidth = widthSize;
              }
            });
            if (this.currentWidth !== newWidth) {
              this.currentWidth = newWidth;
            }
          }
        }
      });
      resizeObserver.observe(this.$el);
    }
  },
  watch: {
    currentHeight() {
      this.$emit('changed-height', this.currentHeight);
    },
    currentWidth() {
      this.$emit('changed-width', this.currentWidth);
    },
  },
  beforeDestroy() {
    this.removeFromObserver();
  },
};
</script>
