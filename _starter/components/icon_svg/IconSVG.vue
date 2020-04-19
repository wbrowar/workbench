<template>
  <div class="c-icon-svg" v-bind="svgAttributes" v-html="svgHtml || null"></div>
</template>

<script>
import * as svg from 'JS/automated/svg.js';

export default {
  data() {
    return {
      svgHtml: false,
    };
  },
  props: {
    background: { type: Boolean, default: false },
    backgroundSize: String,
    handle: { type: String, required: true },
    height: String,
    image: { type: Boolean, default: false },
    replacements: { type: Object },
    width: String,
  },
  computed: {
    svgAttributes: function() {
      let attrs = {
        style: {},
      };

      if (this.background) {
        attrs = {
          style: {
            backgroundImage: svg.background(this.handle, this.replacements || {}),
            backgroundSize: this.backgroundSize || null,
          },
        };
      } else if (this.image) {
        attrs = {
          is: 'img',
          src: svg.src(this.handle, this.replacements || {}),
        };
      } else {
        this.svgHtml = svg.html(this.handle, this.replacements || {});
      }

      if (this.height) {
        attrs.style.height = `${this.height}px`;
      }
      if (this.width) {
        attrs.style.width = `${this.width}px`;
      }

      return attrs;
    },
  },
};
</script>

<style lang="scss">
.c-icon-svg {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;

  & > svg {
    width: var(--svg-w, 100%);
    height: var(--svg-h, 100%);
    max-width: var(--svg-max-w, 100%);
    max-height: var(--svg-max-h);
  }
}
</style>
