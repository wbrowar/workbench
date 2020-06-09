<template>
  <form class="c_form" :action="action" :method="method" @submit="submitForm">
    <slot></slot>
    <div class="c_buttons c_buttons--center" v-if="showSubmitButton">
      <Button class="c_box--shadow--right" :label-text="submitButtonLabel || 'Submit'" />
    </div>
  </form>
</template>

<script>
import axios from 'axios';
import { log } from 'JS/global.js';
import Button from 'Components/button/Button.vue';
import { error } from 'JS/global';

export default {
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
    method: { type: String, default: 'get' }, // get, post
    showSubmitButton: { type: Boolean, default: true },
    submitButtonLabel: String,
    validate: { type: Boolean, default: false },
  },
  methods: {
    checkForExistingError: function(name, message) {
      for (let i = 0; i < this.errors.length; i++) {
        if (this.errors[i].fieldName === name && this.errors[i].message === message) {
          return true;
        }
      }
      return false;
    },
    submitForm: function(e) {
      if (this.status === 'idle') {
        let inputData = {};
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
