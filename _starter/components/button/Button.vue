<template>
  <span
    :is="elementTypeComputed"
    :class="{ c_button: styleAsButton, 'c_button--pointer': styleAsButton && href }"
    :aria-label="ariaLabel || null"
    :href="!useGLink ? href || null : null"
    :target="newWindow ? '_blank' : target || null"
    :to="useGLink ? href || null : null"
    :rel="newWindow || target ? 'noopener' : null"
    @click="clickThroughAction"
    ><slot>{{ labelText }}</slot></span
  >
</template>

<script>
import { log } from 'JS/global';

export default {
  data() {
    return {};
  },
  props: {
    action: Function,
    actionArgs: Array,
    ariaLabel: String,
    elementType: { type: String, default: 'button' },
    href: String,
    labelText: String,
    newWindow: { type: Boolean, default: false },
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
    clickThroughAction: function() {
      if (this.action) {
        if (this.actionArgs) {
          this.action(...this.actionArgs);
        } else {
          this.action();
        }
      }
    },
  },
  created() {},
  mounted() {},
};
</script>

<style lang="scss">
.c_button {
  $self: &;
}
</style>
