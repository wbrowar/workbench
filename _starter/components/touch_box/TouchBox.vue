<template>
  <div class="c-touch-box" :class="classes"><slot /></div>
</template>

<script>
import { log } from 'JS/global.js';
import { gsap, Draggable } from 'gsap/all';

export default {
  components: {},
  data() {
    return {
      uClass: 0,
    };
  },
  props: {
    dragType: { type: String, default: 'x,y' },
  },
  computed: {
    classes() {
      const classes = [];

      classes.push(`c-touch-box-${this.uClass}`);

      return classes;
    },
  },
  created() {
    const uClass = Math.floor(Math.random() * 100000000000);
    this.uClass = uClass;
  },
  mounted() {
    this.$nextTick(() => {
      const el = this;
      const proxy = document.createElement('div');

      gsap.registerPlugin(Draggable);
      Draggable.create(proxy, {
        trigger: `.c-touch-box-${this.uClass}`,
        type: this.dragType,
        minimumMovement: 10,
        onDragStart() {
          log('Drag Start', this.getDirection());
          switch (this.getDirection()) {
            case 'up':
              el.$emit('swipeUp');
              break;
            case 'down':
              el.$emit('swipeDown');
              break;
            case 'left':
              el.$emit('swipeLeft');
              break;
            case 'right':
              el.$emit('swipeRight');
              break;
          }
        },
      });
    });
  },
};
</script>

<style lang="scss">
.c-touch_box {
  $self: &;
}
</style>
