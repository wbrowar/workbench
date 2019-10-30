<template>
  <div class="c_accordion_tab">
    <div class="c_accordion_tab__header" @click="onHeaderClicked">
      <slot name="header" />
    </div>
    <div class="c_accordion_tab__content" v-show="isOpen">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import { log } from 'JS/global';

export default {
  data() {
    return {
      isOpen: false,
      toggleTabHandler: false,
    };
  },
  props: {
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

<style lang="scss">
.c_accordion_tab {
  $self: &;

  @at-root #{$self}__header {
    cursor: pointer;
  }
}
</style>
