<template>
  <button class="c_color_scheme_toggle" @click="updateColorScheme">
    <slot>{{ schemeId.toUpperCase() }}</slot>
  </button>
</template>

<script>
import { addClass, hasClass, log, removeClass } from 'JS/global.js';
import wb from 'JS/automated/wb.js';

export default {
  data() {
    return {
      otherSchemes: [],
    };
  },
  props: {
    method: { default: 'class' },
    schemeId: { required: true },
    targetSelector: { default: 'html' },
  },
  methods: {
    updateColorScheme: function() {
      switch (this.method) {
        case 'class':
          const el = document.querySelector(this.targetSelector);
          if (!hasClass(el, `color_scheme--${this.schemeId}`)) {
            this.otherSchemes.forEach((item) => removeClass(el, `color_scheme--${item}`));
            addClass(el, `color_scheme--${this.schemeId}`);
          }
          break;
        case 'event':
          window.VueEvent.$emit('setColorScheme', this.schemeId);
          break;
      }
    },
  },
  created() {
    // Set array of schemes other than this one
    this.otherSchemes = Object.keys(wb.colors) ? Object.keys(wb.colors).filter((scheme) => scheme !== this.schemeId) : [];
  },
};
</script>

<style lang="scss">
  .c_color_scheme_toggle {
    $self: &;

    @include button_reset;
  }
</style>