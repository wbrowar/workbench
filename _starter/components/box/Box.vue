<template>
  <div class="c-box" :is="elementType" :class="boxClasses" :style="boxStyles">
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    aspect: String,
    demo: { type: Boolean, default: false },
    elementType: { type: String, default: 'div' },
  },
  computed: {
    boxClasses: function() {
      let classes = {};

      if (this.aspect) {
        classes['c-box--aspect'] = true;
      }
      if (this.demo) {
        classes['c-box--demo'] = true;
      }

      return classes || null;
    },
    boxStyles: function() {
      let styles = {};

      if (this.aspect) {
        styles['--aspect'] = this.aspect;
      }

      return styles || null;
    },
  },
};
</script>
