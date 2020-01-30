<template>
  <div class="c-icon_svg" v-bind="svgAttributes" v-html="svgHtml || null"></div>
</template>

<script>
import * as svg from 'JS/automated/svg.js';
import MediaImage from 'Components/image/MediaImage.vue';

export default {
  data() {
    return {
      svgHtml: false,
    };
  },
  props: {
    background: { type: Boolean, default: false },
    backgroundSize: String,
    color: String,
    colorVar: String,
    handle: { type: String, required: true },
    height: String,
    image: { type: Boolean, default: false },
    replacements: { type: Object },
    width: String,
  },
  computed: {
    colorVarString: function() {
      return this.colorVar ? `var(--color-${this.colorVar})` : null;
    },
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
        if (this.color || this.colorVar) {
          attrs = {
            class: 'c-icon_svg--color',
            style: {
              '--color': this.colorVarString || this.color,
            },
          };
        }
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
.c-icon_svg {
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;

  & > svg {
    max-width: 100%;
    width: 100%;
    height: 100%;
  }

  @at-root #{&}--color {
    @include svg_color(#{var(--color)});
  }
}
</style>
