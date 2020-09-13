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
// import { log } from 'JS/global.js';
import wb from 'JS/automated/wb.js';

export default {
  name: 'Button',
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
    retainStyle: { type: Boolean, default: false },
    target: String,
    theme: { type: String, default: 'default' },
    unstyle: { type: Boolean, default: false },
  },
  computed: {
    classes() {
      const classes = [];
      if (this.styleAsButton) {
        classes.push('flex flex-row flex-no-wrap items-center justify-center px-5 py-3');

        switch (this.theme) {
          case 'default':
            classes.push(`bg-black text-white rounded hover:opacity-60`);
            break;
        }
        if (this.href) {
          classes.push('cursor-pointer');
        }
      }
      return classes;
    },
    elementTypeComputed() {
      if (this.useRouterLink) {
        let linkType = 'router-link';
        switch (wb.projectType) {
          case 'gridsome':
            linkType = 'g-link';
            break;
          case 'nuxt':
            linkType = 'nuxt-link';
            break;
        }
        return linkType;
      }
      return this.href ? 'a' : this.elementType;
    },
    formattedHref() {
      if (this.href) {
        if (this.href === '/') {
          // Return the homepage
          return `/`;
        } else if (this.href.startsWith('http://') || this.href.startsWith('https://')) {
          return this.href;
        } else {
          return (this.href.startsWith('/') ? '' : '/') + this.href;
        }
      }

      return false;
    },
    styleAsButton() {
      return this.retainStyle || (this.unstyle === false && Object.keys(this.$slots).length === 0);
    },
    useRouterLink() {
      if (this.href) {
        return this.formattedHref.startsWith('/');
      }
      return false;
    },
  },
  methods: {
    onClick(event) {
      this.$emit('clicked', event);
    },
  },
};
</script>

<style>
.c-button {
  &-reset {
    @include button_reset;
  }
}
</style>
