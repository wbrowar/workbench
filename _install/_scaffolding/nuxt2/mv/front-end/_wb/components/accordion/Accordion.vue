<template>
  <dl class="c-accordion">
    <slot />
  </dl>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api';
import { log } from 'JS/global';

export default defineComponent({
  name: 'Accordion',
  props: {
    firstTabOpen: { type: Boolean, default: true },
  },
  setup() {
    const state = reactive<{
      tabs: any[];
    }>({
      tabs: [],
    });

    return {
      ...toRefs(state),
    };
  },
  methods: {
    toggleTabHandler(uid: number) {
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
        children.some((item: any) => {
          return item.$options._componentTag === 'AccordionTab';
        })
      ) {
        // Sets tabs to identified AccordionTab components
        this.tabs = children.filter((item: any) => {
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
});
</script>
