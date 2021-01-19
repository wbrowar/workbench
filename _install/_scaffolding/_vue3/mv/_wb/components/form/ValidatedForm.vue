<template>
  <form :action="action || null" :method="method" @submit="submitForm">
    <slot></slot>
    <div v-if="showSubmitButton">
      <Button :label-text="submitButtonLabel || 'Submit'" />
    </div>
  </form>
</template>

<script>
import { log } from 'JS/global.js';
import Button from 'Components/button/Button.vue';

export default {
  name: 'ValidatedForm',
  components: {
    Button,
  },
  data() {
    return {
      errors: [],
      inputs: [],
      status: 'idle',
    };
  },
  props: {
    action: String,
    method: { type: String, default: 'get', validator: (value) => ['get', 'post'].includes(value) },
    showSubmitButton: { type: Boolean, default: true },
    submitButtonLabel: String,
    validate: { type: Boolean, default: false },
  },
  methods: {
    checkForExistingError(name, message) {
      for (let i = 0; i < this.errors.length; i++) {
        if (this.errors[i].fieldName === name && this.errors[i].message === message) {
          return true;
        }
      }
      return false;
    },
    submitForm(e) {
      if (this.status === 'idle') {
        const inputData = {};
        let submit = true;

        this.inputs.forEach((input) => {
          inputData[input.inputName] = input.inputValue;

          if (this.validate) {
            if (input.validationEnabled || input.required) {
              input.validateField();
            }
            if (input.error) {
              submit = false;
            }
          }
        });

        if (submit) {
          this.status = 'submitting';
          log('Submitting form', inputData);

          return true;
        }
        e.preventDefault();
      }
    },
  },
  mounted() {
    this.$children.forEach((item) => {
      if (item.$options._componentTag === 'ValidatedFormInput') {
        this.inputs.push(item);
      }
    });
  },
};
</script>
