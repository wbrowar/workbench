<template>
  <div class="c-touch-box" :class="classes"><slot /></div>
</template>

<script>
import { log, processIsClient } from 'JS/global';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable.js';

if (processIsClient()) {
  gsap.registerPlugin(Draggable);
}

export default {
  name: 'TouchBox',
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
      if (processIsClient()) {
        const el = this;
        const proxy = document.createElement('div');

        Draggable.create(proxy, {
          trigger: `.c-touch-box-${this.uClass}`,
          type: this.dragType,
          minimumMovement: 10,
          onDragStart() {
            log('Drag Start', this.getDirection());
            switch (this.getDirection()) {
              case 'up':
                el.$emit('swipe-up');
                break;
              case 'down':
                el.$emit('swipe-down');
                break;
              case 'left':
                el.$emit('swipe-left');
                break;
              case 'right':
                el.$emit('swipe-right');
                break;
            }
          },
        });
      }
    });
  },
};
</script>
