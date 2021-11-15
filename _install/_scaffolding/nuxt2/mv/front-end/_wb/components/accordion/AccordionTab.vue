<template>
  <div class="c-accordion-tab" :class="{ 'c-accordion-tab-open': isOpen }">
    <div
      class="grid grid-cols-ti items-center gap-5 cursor-pointer"
      :class="headerClass || null"
      @click="onHeaderClicked"
    >
      <slot name="header" /><SvgPlus
        class="inline-block ml-2 w-[var(--width)] h-[var(--height)] origin-center duration-150 group-focus:rotate-45"
        :class="{ 'transform rotate-45': isOpen }"
        :stroke-width="iconStrokeWidth"
        :style="{ '--width': iconSize, '--height': iconSize }"
      />
    </div>
    <transition :name="contentTransitionName">
      <div class="content" :class="contentClasses" v-show="isOpen">
        <slot name="content" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api';
import { log } from 'JS/global';
import SvgPlus from 'Components/svg_icons/SvgPlus.vue';

export default defineComponent({
  name: 'AccordionTab',
  components: {
    SvgPlus,
  },
  props: {
    contentTransitionName: { type: String, default: 'slide-down' },
    contentClass: Array,
    headerClass: Array,
    iconSize: { type: String, default: '14px' },
    iconStrokeWidth: { type: Number, default: 0.5 },
    open: { type: Boolean, default: false },
    toggleSelf: { type: Boolean, default: false },
  },
  setup(props: any) {
    const state = reactive<{
      isOpen: boolean;
      toggleTabHandler: Function | null;
    }>({
      isOpen: false,
      toggleTabHandler: null,
    });

    if (props.open) {
      state.isOpen = true;
    }

    return {
      ...toRefs(state),
    };
  },
  computed: {
    contentClasses(): string[] {
      const classes = [];

      if (this.contentClass) {
        classes.push(this.contentClass);
      }
      if (this.isOpen) {
        classes.push(`content-open`);
      }

      return classes;
    },
  },
  methods: {
    onHeaderClicked() {
      log('Accordion toggled');

      if (this.toggleTabHandler) {
        this.toggleTabHandler(this._uid);
      } else if (this.toggleSelf) {
        this.isOpen = !this.isOpen;
      }

      if (this.isOpen) {
        this.$emit('content-opened');
      } else {
        this.$emit('content-closed');
      }
    },
  },
});
</script>

<style scoped>
.slide-down-enter-active {
  transition: max-height 0.5s ease-in-out;
}
.slide-down-leave-active {
  transition: max-height 0.5s ease-in-out;
}

.slide-down-enter-to,
.slide-down-leave {
  overflow: hidden;
  max-height: 1000px;
}

.slide-down-enter,
.slide-down-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
