<template>
  <span
    :is="elementTypeComputed"
    :class="{
      c_button: styleAsButton,
      'c_button--pointer': styleAsButton && href,
      'c_button--outline': outline,
      'c_button--reset': reset,
    }"
    :aria-label="ariaLabel || null"
    :href="!useGLink ? href || null : null"
    :style="color ? { '--button-color': `var(--color-${color})` } : null"
    :target="newWindow ? '_blank' : target || null"
    :to="useGLink ? href || null : null"
    :rel="newWindow || target ? 'noopener' : null"
    @click="clickThroughAction"
    ><slot>{{ labelText }}</slot></span
  >
</template>

<script>
import { log } from 'JS/global.js';

export default {
  data() {
    return {};
  },
  props: {
    action: Function,
    actionArgs: Array,
    ariaLabel: String,
    color: String,
    elementType: { type: String, default: 'button' },
    href: String,
    labelText: String,
    newWindow: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    reset: { type: Boolean, default: false },
    target: String,
    unstyle: { type: Boolean, default: false },
  },
  computed: {
    elementTypeComputed: function() {
      if (this.useGLink) {
        return 'g-link';
      }
      return this.href ? 'a' : this.elementType;
    },
    styleAsButton: function() {
      return this.unstyle === false && Object.keys(this.$slots).length === 0;
    },
    useGLink: function() {
      if (this.href) {
        return this.href.startsWith('/');
      }
      return false;
    },
  },
  methods: {
    clickThroughAction: function(event) {
      if (this.action) {
        if (this.actionArgs) {
          this.action(event, ...this.actionArgs);
        } else {
          this.action(event);
        }
      }
    },
  },
};
</script>
