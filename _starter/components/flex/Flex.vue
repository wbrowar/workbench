<template>
  <Box class="c-flex" :element-type="elementType" :class="flexClasses" :style="flexStyles" v-bind="box">
    <slot />
  </Box>
</template>

<script>
import Box from 'Components/box/Box.vue';

export default {
  components: {
    Box,
  },
  data() {
    return {};
  },
  props: {
    align: String,
    box: {
      type: Object,
      default: () => {
        return {};
      },
    },
    center: { type: Boolean, default: false },
    direction: String,
    elementType: { type: String, default: 'div' },
    justify: String,
    stretch: { type: Boolean, default: false },
    wrap: String,
  },
  computed: {
    flexClasses: function() {
      let classes = [];

      if (this.center) {
        classes.push('c-flex--centered');
      }
      if (this.stretch) {
        classes.push('c-flex--stretched');
      }

      return classes.length ? classes : null;
    },
    flexStyles: function() {
      let styles = {
        alignItems: this.align || null,
        flexDirection: this.direction || null,
        flexWrap: this.wrap || null,
        justifyContent: this.justify || null,
      };

      return styles;
    },
  },
};
</script>
