<template>
  <span
    :is="elementTypeComputed"
    class="c-button"
    :class="classes"
    :aria-label="ariaLabel || null"
    :href="formattedHref"
    :target="newWindow ? '_blank' : target || null"
    :to="formattedTo"
    :rel="newWindow || target ? 'noopener noreferrer' : null"
    v-bind="customAttributes"
    @click.native="onClick"
    v-if="useRouterLink"
  ><slot
  ><span class="mt-center-line" :class="theme === 'box' ? 'group-hover:text-white' : null">{{
      labelText
    }}</span></slot
  ><SvgArrow :animate="animate" class="arrow ml-2" v-if="arrow"
  /></span>
  <span
    :is="elementTypeComputed"
    class="c-button"
    :class="classes"
    :aria-label="ariaLabel || null"
    :href="formattedHref"
    :target="newWindow ? '_blank' : target || null"
    :rel="newWindow || target ? 'noopener noreferrer' : null"
    v-bind="customAttributes"
    @click="onClick"
    v-else
  ><slot
  ><span class="mt-center-line" :class="theme === 'box' ? 'group-hover:text-white' : null">{{
      labelText
    }}</span></slot
  ><SvgArrow :animate="animate" class="ml-2" v-if="arrow"
  /></span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { log } from 'JS/global';
import SvgArrow from 'Components/svg_icons/SvgArrow.vue';

export default defineComponent({
  name: 'Button',
  components: {
    SvgArrow,
  },
  props: {
    animate: { type: Boolean, default: false },
    ariaLabel: String,
    arrow: { type: Boolean, default: false },
    customAttributes: Object,
    elementType: { type: String, default: 'button' },
    href: String,
    labelText: String,
    newWindow: { type: Boolean, default: false },
    reset: { type: Boolean, default: false },
    retainStyle: { type: Boolean, default: false },
    smoothAnchor: { type: Boolean, default: true },
    target: String,
    to: Object,
    theme: {
      type: String,
      default: 'default',
      validator: (value: string) => ['default', 'box', 'cta'].includes(value),
    },
    unstyle: { type: Boolean, default: false },
  },
  computed: {
    classes() {
      const classes = [];
      if (this.styleAsButton) {
        classes.push('group inline-flex flex-row flex-nowrap items-center text-lg uppercase');

        switch (this.theme) {
          case 'default':
            // classes.push(``);
            break;
          case 'box':
            classes.push(
              `px-8 py-1.5 justify-center bg-transparent hover:bg-current border border-solid border-current duration-300`
            );
            break;
          case 'cta':
            classes.push(`lg:text-2xl`);
            break;
        }
        if (this.href) {
          classes.push('cursor-pointer');
        }
      }
      return classes;
    },
    elementTypeComputed(): string {
      if (this.useRouterLink) {
        return 'nuxt-link';
      }
      return this.href ? 'a' : this.elementType;
    },
    formattedHref(): string | null {
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
      let to: any = null;

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
    styleAsButton(): boolean {
      return this.retainStyle || (!this.unstyle && Object.keys(this.$slots).length === 0);
    },
    useRouterLink(): boolean {
      if (this.formattedHref) {
        return this.formattedHref.startsWith('/') || this.formattedHref.startsWith('#');
      }
      return false;
    },
  },
  methods: {
    onClick(event: MouseEvent) {
      log('Button Clicked!');

      if (process.client) {
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
});
</script>
