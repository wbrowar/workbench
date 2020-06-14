<template>
  <div
    :is="anchor ? 'a' : 'div'"
    :id="anchor ? containerId : null"
    class="c-subheader"
    :class="{ 'c-subheader-anchor': anchor }"
    :href="anchor ? `#${containerId}` : null"
  >
    <h2 :is="elementType" :class="classes" v-html="text"></h2>
  </div>
</template>

<script>
import { slugify } from 'JS/global.js';

export default {
  props: {
    anchor: { type: Boolean, default: false },
    headerLevel: { type: Number, default: 2, validator: (value) => [1, 2, 3, 4, 5, 6].includes(value) },
    text: { type: String, required: true },
  },
  computed: {
    classes() {
      const classes = [];

      if (this.headerLevel === 1) {
        classes.push(`c-header-1`);
      } else if (this.headerLevel === 2) {
        classes.push(`c-header-2`);
      } else if (this.headerLevel === 3) {
        classes.push(`c-header-3`);
      }

      return classes;
    },
    elementType() {
      return `h${this.headerLevel}`;
    },
    containerId() {
      return slugify(this.text);
    },
  },
};
</script>

<style lang="scss">
.c-subheader {
  $self: &;
  position: relative;
  scroll-margin-top: 1em;

  @at-root #{$self}-anchor {
    & > *:first-child {
      &:before {
        content: '#';
        display: block;
        position: absolute;
        top: 0;
        left: calc(-1ch - 0.1rem);
        font-size: 1em;
        text-align: right;
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
      &:hover {
        &:before {
          opacity: 1;
          transition: opacity 0.1s ease-out;
        }
      }
    }
  }
}
</style>
