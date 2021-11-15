<template>
  <Button :animate="animate" :arrow="arrow" @clicked="onClick" v-bind="buttonAttributes" v-if="showButton" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';
import { log } from 'JS/global';
import useLinkFieldAttributes from 'Composables/useLinkFieldAttributes';
import Button from 'Components/button/Button.vue';
import { LinkField_Link } from 'Types/automated/generated-craft';

export default defineComponent({
  name: 'LinkFieldButton',
  components: {
    Button,
  },
  props: {
    animate: { type: Boolean, default: false },
    arrow: { type: Boolean, default: true },
    linkField: { type: Object as PropType<LinkField_Link>, required: true },
  },
  setup(props: any) {
    const { linkFieldToButtonAttributes } = useLinkFieldAttributes();

    const buttonAttributes = computed(() => linkFieldToButtonAttributes(props.linkField));

    return { buttonAttributes };
  },
  computed: {
    showButton(): boolean {
      return this.buttonAttributes?.href !== null;
    },
  },
  methods: {
    onClick(event: MouseEvent) {
      this.$emit('clicked', event);
    },
  },
  mounted() {
    log(`Loaded LinkFieldButton`);
  },
});
</script>
