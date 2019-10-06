<template>
  <div class="c_box" :is="elementType" :class="boxClasses" :style="boxStyles">
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    demo: { type: Boolean, default: false },
    elementType: { type: String, default: 'div' },
  },
  computed: {
    boxClasses: function() {
      let classes = {};

      if (this.demo) {
        classes['c_box--demo'] = true;
      }

      return classes || null;
    },
    boxStyles: function() {
      let styles = {};

      return styles || null;
    },
  },
};
</script>

<style lang="scss">
// Set styles in _source/_components/box/_box.scss
</style>
