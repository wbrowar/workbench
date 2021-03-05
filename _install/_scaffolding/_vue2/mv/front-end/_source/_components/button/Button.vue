<template>
  <span
    :is="elementTypeComputed"
    :class="classes"
    :aria-label="ariaLabel || null"
    :href="formattedHref"
    :target="newWindow ? '_blank' : target || null"
    :to="formattedTo"
    :rel="newWindow || target ? 'noopener' : null"
    @click.native="onClick"
    v-if="useRouterLink"
    ><slot>{{ labelText }}</slot></span
  >
  <span
    :is="elementTypeComputed"
    :class="classes"
    :aria-label="ariaLabel || null"
    :href="formattedHref"
    :target="newWindow ? '_blank' : target || null"
    :rel="newWindow || target ? 'noopener' : null"
    @click="onClick"
    v-else
    ><slot>{{ labelText }}</slot></span
  >
</template>

<script>
import { log, processIsClient } from 'JS/global';
import settings from 'JS/automated/settings.js';
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
    smoothAnchor: { type: Boolean, default: true },
    target: String,
    to: Object,
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
        switch (settings.projectType) {
          case 'nuxt2':
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
        } else if (this.href.startsWith('http://') || this.href.startsWith('https://') || this.href.startsWith('#')) {
          return this.href;
        } else {
          // Make sure route is relative
          return (this.href.startsWith('/') ? '' : '/') + this.href;
        }
      }
      return null;
    },
    formattedTo() {
      let to = null;

      if (this.useRouterLink) {
        to = {};

        if (this.formattedHref) {
          if (this.formattedHref.startsWith('#')) {
            to.hash = this.formattedHref;
          } else {
            to.path = this.formattedHref;
          }
        }

        // Overwrite all changes
        if (this.to) {
          to = this.to;
        }
      }

      return to;
    },
    styleAsButton() {
      return this.retainStyle || (this.unstyle === false && Object.keys(this.$slots).length === 0);
    },
    useRouterLink() {
      if (this.formattedHref) {
        return this.formattedHref.startsWith('/') || this.formattedHref.startsWith('#');
      }
      return false;
    },
  },
  methods: {
    onClick(event) {
      log('Button Clicked!', event, this.formattedTo?.hash);

      if (processIsClient()) {
        if (this.formattedTo?.hash && this.smoothAnchor) {
          const element = document.querySelector(this.formattedTo.hash);
          if (element) {
            window.scrollTo({
              top: element.offsetTop,
              behavior: 'smooth',
            });
          }
        }
      }

      this.$emit('clicked', event);
    },
  },
};
</script>
