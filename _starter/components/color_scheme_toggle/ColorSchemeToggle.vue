<template>
  <button class="c_color_scheme_toggle" @click="updateColorScheme">{{ schemeId.toUpperCase() }}</button>
</template>

<script>
import { addClass, hasClass, removeClass } from 'starter/_js/global.js';

export default {
  data() {
    return {
      otherSchemes: [],
    };
  },
  props: {
    method: { default: 'class' },
    allSchemes: false,
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
          window.VueEvent.$emit('set-color-scheme', this.schemeId);
          break;
      }
    },
  },
  created() {
    // Set array of schemes other than this one
    this.otherSchemes = this.allSchemes ? this.allSchemes.filter((scheme) => scheme !== this.schemeId) : [];
  },
  mounted() {},
};
</script>
