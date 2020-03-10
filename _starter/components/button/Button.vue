<template>
  <span
    :is="elementTypeComputed"
    :class="classes"
    :aria-label="ariaLabel || null"
    :href="formattedHref"
    :target="newWindow ? '_blank' : target || null"
    :to="useRouterLink ? formattedHref || null : null"
    :rel="newWindow || target ? 'noopener' : null"
    @click="onClick"
    ><slot>{{ labelText }}</slot></span
  >
</template>

<script>
import { log } from 'JS/global.js';
import wb from 'JS/automated/wb.js';

export default {
  components: {},
  data() {
    return {};
  },
  props: {
    ariaLabel: String,
    elementType: { type: String, default: 'button' },
    href: String,
    labelText: String,
    newWindow: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    reset: { type: Boolean, default: false },
    target: String,
    theme: { type: String, default: 'default' },
    unstyle: { type: Boolean, default: false },
  },
  computed: {
    classes: function() {
      let classes = [];
      if (this.styleAsButton) {
        classes.push('c-button');

        if (this.theme) {
          classes.push(`c-button-${this.theme}`);
        }
        if (this.href) {
          classes.push('cursor-pointer');
        }
      }
      return classes;
    },
    elementTypeComputed: function() {
      if (this.useRouterLink) {
        return wb.projectType === 'gridsome' ? 'g-link' : 'router-link';
      }
      return this.href ? 'a' : this.elementType;
    },
    formattedHref: function() {
      if (this.href) {
        if (this.href === '/') {
          // Return the homepage
          return `/`;
        } else if (this.href.startsWith('http://') || this.href.startsWith('https://')) {
          return this.href;
        } else {
          return (this.href.startsWith('/') ? '' : '/') + this.href + (this.href.endsWith('/') ? '' : '/');
        }
      }

      return false;
    },
    styleAsButton: function() {
      return this.unstyle === false && Object.keys(this.$slots).length === 0;
    },
    useRouterLink: function() {
      if (this.href) {
        return this.formattedHref.startsWith('/');
      }
      return false;
    },
  },
  methods: {
    onClick: function(event) {
      this.$emit('onClick', event);
    },
  },
};
</script>

<style lang="scss">
.c-button {
  $self: &;

  @apply flex flex-row flex-no-wrap items-center justify-center px-5 py-3;

  @at-root #{$self}-default {
    @apply bg-black text-white;

    @at-root #{&}:hover {
      @apply opacity-60;
    }
  }
  @at-root #{$self}--pointer {
    @apply cursor-pointer;
  }
  @at-root #{$self}--reset {
    @include button_reset;
  }
}
</style>
