<template>
  <div class="c-accordion-tab" :class="{ 'c-accordion-tab-open': isOpen }">
    <div class="cursor-pointer" :class="headerClass || null" @click="onHeaderClicked">
      <slot name="header" />
    </div>
    <div :class="contentClass || null" v-show="isOpen">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import { log } from 'JS/global.js';

export default {
  data() {
    return {
      isOpen: false,
      toggleTabHandler: false,
    };
  },
  props: {
    contentClass: Array,
    headerClass: Array,
    open: { type: Boolean, default: false },
    toggleSelf: { type: Boolean, default: false },
  },
  methods: {
    onHeaderClicked: function() {
      if (this.toggleTabHandler) {
        this.toggleTabHandler(this._uid);
      } else if (this.toggleSelf) {
        this.isOpen = !this.isOpen;
      }
    },
  },
  created() {
    if (this.open) {
      this.isOpen = true;
    }
  },
};
</script>
