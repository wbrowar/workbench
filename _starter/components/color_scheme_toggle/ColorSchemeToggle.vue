<template>
  <button class="c-color_scheme_toggle" @click="onClick">
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
    method: { type: String, default: 'class' },
    remember: { type: Boolean, default: false },
    schemeId: { type: String, required: true },
    targetSelector: { type: String, default: 'html' },
  },
  methods: {
    onClick: function() {
      this.updateColorScheme();

      if (this.remember) {
        if (this.schemeId === 'default') {
          localStorage.removeItem('preference:colorScheme');
        } else {
          localStorage.setItem('preference:colorScheme', this.schemeId);
        }
      }
    },
    updateColorScheme: function() {
      switch (this.method) {
        case 'class':
          const el = document.querySelector(this.targetSelector);
          if (!hasClass(el, `scheme-${this.schemeId}`)) {
            this.otherSchemes.forEach((item) => removeClass(el, `scheme-${item}`));
            if (this.schemeId !== 'default') {
              addClass(el,`scheme-${this.schemeId}`);
            }
          }
          break;
        case 'event':
          this.$emit('setColorScheme', this.schemeId);
          break;
      };
    },
  },
  created() {
    // Set array of schemes other than this one
    this.otherSchemes = Object.keys(wb.colors)
      ? Object.keys(wb.colors).filter((scheme) => scheme !== this.schemeId)
      : [];
  },
  mounted() {
    if (this.remember && localStorage.getItem('preference:colorScheme')) {
      if (localStorage.getItem('preference:colorScheme') === this.schemeId) {
        log('changing it');
        this.updateColorScheme();
      }
    }
  },
};
</script>

<style lang="scss">
.c-color_scheme_toggle {
  $self: &;

  @include button_reset;
}
</style>
