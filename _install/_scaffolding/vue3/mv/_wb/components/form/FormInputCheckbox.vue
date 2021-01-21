<template>
  <div class="flex items-center space-x-2" @click="onClickHandler">
    <div :class="inputClasses"><div :class="inputCheckedClasses" v-if="inputChecked"></div></div>
    <FormLabel :label-text="labelText" />
  </div>
</template>

<script>
// import { log } from 'JS/global.js';
import FormLabel from 'Components/form/FormLabel.vue';

export default {
  name: 'FormInputCheckbox',
  components: { FormLabel },
  data() {
    return {
      fields: [],
    };
  },
  props: {
    closeButton: { type: Boolean, default: false },
    iconUrl: String,
    inputChecked: { type: Boolean, default: false },
    inputMode: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'checkbox', 'radio'].includes(value),
    },
    labelText: { type: String, required: true },
  },
  computed: {
    inputClasses() {
      const classes = [];

      classes.push(`flex items-center justify-center w-4 h-4 border-2`);

      if (this.inputMode === 'radio') {
        classes.push(`rounded-full`);
      }

      return classes;
    },
    inputCheckedClasses() {
      const classes = [];

      classes.push(`relative w-2 h-2 bg-black`);

      if (this.inputMode === 'radio') {
        classes.push(`rounded-full`);
      }

      return classes;
    },
  },
  methods: {
    onClickHandler() {
      this.$emit('onClick');
    },
  },
};
</script>
