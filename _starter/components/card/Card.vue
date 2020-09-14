<template>
  <div class="c-card grid grid-rows-card">
    <slot name="head"
      ><div class="h-32" :class="headClass"><MediaImage background v-bind="headImage" /></div
    ></slot>
    <div class="p-4 flex flex-col justify-between" :class="bodyClasses">
      <slot />
    </div>
  </div>
</template>

<script>
// import { log } from 'JS/global.js';

export default {
  name: 'Card',
  components: {
    MediaImage: () => import('Components/image/MediaImage.vue'),
  },
  data() {
    return {};
  },
  props: {
    bodyClass: String,
    headClass: String,
    headImage: Object,
  },
  computed: {
    bodyClasses() {
      const classes = [];

      if (this.bodyClass) {
        classes.push(this.bodyClass);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
    headClasses() {
      const classes = [];

      if (this.headClass) {
        classes.push(this.headClass);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>
