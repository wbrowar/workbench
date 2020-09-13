<template>
  <dl class="c-accordion">
    <slot />
  </dl>
</template>

<script>
import { log } from 'JS/global.js';

export default {
  name: 'Accordion',
  data() {
    return {
      tabs: [],
    };
  },
  props: {
    firstTabOpen: { type: Boolean, default: true },
  },
  methods: {
    toggleTabHandler(uid) {
      log('Opening Accordion Tab', uid);
      this.tabs.forEach((tab) => {
        tab.isOpen = tab._uid === uid ? !tab.isOpen : false;
      });
    },
  },
  mounted() {
    let children = this.$children;
    while (children && !this.tabs.length) {
      // Find if children contain instance of AccordionTab
      if (
        children.some((item) => {
          return item.$options._componentTag === 'AccordionTab';
        })
      ) {
        // Sets tabs to identified AccordionTab components
        this.tabs = children.filter((item) => {
          return item.$options._componentTag === 'AccordionTab';
        });
        log('tabs', this.tabs);
      }
      children = children[0].$children;
    }

    if (this.tabs) {
      const tabTotal = this.tabs.length;
      for (let i = 0; i < tabTotal; i++) {
        this.tabs[i].isOpen = this.firstTabOpen && i === 0;
        this.tabs[i].toggleTabHandler = this.toggleTabHandler;
      }
    }
  },
};
</script>
