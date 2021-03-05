<template>
  <button class="c-color-scheme-toggle" @click="onClick">
    <slot>{{ schemeId.toUpperCase() }}</slot>
  </button>
</template>

<script>
import { addClass, log, removeClass } from 'JS/global';
import * as settings from 'JS/automated/settings.js';

export default {
  name: 'ColorSchemeToggle',
  data() {
    return {
      otherSchemes: [],
    };
  },
  props: {
    method: { type: String, default: 'class' },
    remember: { type: Boolean, default: false },
    schemeId: { type: String, default: 'default' },
    targetSelector: { type: String, default: 'html' },
  },
  methods: {
    onClick() {
      this.updateColorScheme();

      if (this.remember) {
        if (this.schemeId === 'default') {
          localStorage.removeItem('preference:colorScheme');
        } else {
          localStorage.setItem('preference:colorScheme', this.schemeId);
        }
      }

      this.$emit('onClick');
    },
    updateColorScheme() {
      const el = document.querySelector(this.targetSelector);
      switch (this.method) {
        case 'class':
          this.otherSchemes.forEach((item) => {
            removeClass(el, `${item}`);
          });
          if (this.schemeId !== 'default') {
            addClass(el, `${this.schemeId}`);
          }
          break;
      }

      this.$emit('updatedColorScheme', this.schemeId);
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
