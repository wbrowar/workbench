<template>
  <div>
    <FormLabel
      :class="labelClasses"
      :input-id="formattedInputId"
      :label-text="labelText"
      :required="required"
      v-if="labelText"
    />
    <textarea
      v-model="inputValue"
      ref="input"
      v-bind="inputAttributes"
      @keyup="valueChanged"
      v-if="inputType === 'textarea'"
    ></textarea>
    <div v-else-if="inputType === 'checkboxes' && inputOptions">
      <FormInputCheckbox
        :input-checked="inputValue ? inputValue.includes(option.value) : false"
        input-mode="checkbox"
        :label-text="option.label"
        @clicked="toggleValue(option.value)"
        v-for="option in inputOptions"
        :key="option.value"
      />
      <div class="sr-only">
        <input type="hidden" :name="inputName" :value="inputValue ? inputValue.join(`|`) : ''" />
      </div>
    </div>
    <div v-else-if="inputType === 'radio' && inputOptions">
      <FormInputCheckbox
        :input-checked="option.value === inputValue"
        input-mode="radio"
        :label-text="option.label"
        @clicked="updateValue(option.value)"
        v-for="option in inputOptions"
        :key="option.value"
      />
      <div class="sr-only">
        <input type="hidden" :name="inputName" :value="inputValue" />
      </div>
    </div>
    <div v-else-if="inputType === 'select' && inputOptions">
      <select v-bind="inputAttributes" v-model="inputValue" @blur="validateField" @change="valueChanged">
        <option v-if="inputPlaceholder" class="placeholder" selected disabled value="">{{ inputPlaceholder }}</option>
        <option
          :selected="option.value === startingValue"
          :value="option.value"
          v-for="(option, index) in inputOptions"
          :key="index"
          >{{ option.label }}</option
        >
      </select>
    </div>
    <cleave
      :options="cleaveOptions"
      v-model="inputValue"
      ref="input"
      @blur="validateField"
      @input="valueChanged"
      v-else-if="formatType !== undefined || formatOptions !== undefined"
    />
    <input
      v-model="inputValue"
      v-bind="inputAttributes"
      ref="input"
      @blur="validateField"
      @keyup="valueChanged"
      v-else
    />

    <div class="text-error text-sm" v-if="!isValid">{{ error }}</div>
  </div>
</template>

<script>
// import { log } from 'JS/global.js';
import FormLabel from 'Components/form/FormLabel.vue';

export default {
  name: 'ValidatedFormInput',
  components: {
    cleave: () => import('vue-cleave-component'),
    FormLabel,
    FormInputCheckbox: () => import('Components/form/FormInputCheckbox.vue'),
  },
  data() {
    return {
      error: false,
      cleaveOptions: {},
      isValid: true,
      inputValue: null,
    };
  },
  props: {
    ariaLabel: String,
    errorMessage: String,
    formatOptions: Object,
    formatType: String,
    inputAttr: Object,
    inputClass: String,
    inputId: String,
    inputName: { type: String, required: true },
    inputOptions: Array,
    inputPlaceholder: String,
    inputType: { type: String, default: 'text' },
    labelClass: String,
    startingValue: [Array, String],
    labelText: String,
    required: { type: Boolean, default: false },
    validationType: String,
  },
  computed: {
    formattedInputId() {
      return this.inputId || `input-${this.inputName}`;
    },
    inputAttributes() {
      const attrs = { style: {} };

      attrs.id = this.formattedInputId;
      attrs.class = this.inputClasses || [];
      attrs.name = this.inputName;
      attrs['aria-label'] = this.ariaLabel || this.labelText || this.name;

      if (this.inputPlaceholder) {
        attrs.placeholder = this.inputPlaceholder;
      }
      if (!this.isValid) {
        attrs.class.push([`border-error`]);
      }
      if (this.required) {
        attrs.required = this.required;
      }

      switch (this.inputType) {
        case 'select':
          // attrs.style['--select-icon'] = svgs.background('arrow_down', {
          //   'stroke="#000"': 'stroke="rgb(112, 112, 112)"',
          // });
          break;
        default:
          attrs.type = this.inputType;
      }

      if (this.inputAttr) {
        Object.assign(attrs, this.inputAttr);
      }

      return attrs;
    },
    inputClasses() {
      const classes = [];

      classes.push(`p-2 border-2 w-full bg-white`);

      if (this.inputClass) {
        classes.push(this.inputClass);
      }

      return classes;
    },
    labelClasses() {
      const classes = [];

      classes.push(`block`);

      if (this.labelClass) {
        classes.push(this.labelClass);
      }

      return classes;
    },
    passesRequired() {
      let passes = false;
      if (this.inputValue) {
        switch (typeof this.inputValue) {
          case 'object':
            passes = this.inputValue.length > 0;
            break;
          case 'string':
            passes = this.inputValue !== '';
            break;
        }
      }
      return passes;
    },
    validationEnabled() {
      return this.validationType;
    },
  },
  methods: {
    addValue(value) {
      if (typeof this.inputValue === 'object') {
        if (!this.inputValue.includes(value)) {
          this.inputValue.push(value);
          this.validateField();
        }
      }
    },
    removeValue(value) {
      if (typeof this.inputValue === 'object') {
        this.inputValue = this.inputValue.filter((item) => item !== value);
        this.validateField();
      }
    },
    toggleValue(value) {
      if (typeof this.inputValue === 'object') {
        if (this.inputValue.includes(value)) {
          this.removeValue(value);
        } else {
          this.addValue(value);
        }
      }
      this.valueChanged();
    },
    updateValue(value) {
      this.inputValue = value;
      this.valueChanged();
      this.validateField();
    },
    setErrorForFormId(message = null) {
      this.error = this.errorMessage || message;
      this.$emit('form-set-error', this.inputName, this.error);
    },
    removeErrorForFormId() {
      this.$emit('form-remove-error', this.inputName);
    },
    validateField() {
      this.isValid = true;

      if (this.validationEnabled) {
        let validation = { valid: false, message: '' };

        switch (this.validationType) {
          case 'email':
            validation = this.validEmail(this.inputValue);
            break;
          case 'tel':
            validation = this.validTel(this.inputValue);
            break;
          case 'text':
            validation = this.validText(this.inputValue);
            break;
          case 'zip':
            validation = this.validZip(this.inputValue);
            break;
        }

        this.isValid = validation.valid;

        if (!validation.valid || (this.inputValue === '' && this.required)) {
          this.setErrorForFormId(validation.message);
        } else {
          this.error = false;
          this.removeErrorForFormId();
        }
      } else if (this.required) {
        if (this.passesRequired) {
          this.error = false;
          this.removeErrorForFormId();
        } else {
          this.isValid = false;
          this.setErrorForFormId(this.labelText ? `${this.labelText} is required.` : null);
        }
      }
    },
    validEmail(value) {
      // eslint-disable-next-line no-useless-escape
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return { valid: re.test(value), message: 'Please enter a valid email address.' };
    },
    // validSelect: function(value) {
    //   return { valid: value != '', message: 'Please choose a valid option.' };
    // },
    validTel(value) {
      const re = /^\d{10}$/;
      return { valid: re.test(value), message: 'Please enter a valid phone number.' };
    },
    validText(value) {
      return { valid: value !== '', message: 'Please enter text.' };
    },
    validZip(value) {
      const re = /^\d{5}$/;
      return { valid: re.test(value), message: 'Please enter a valid ZIP code.' };
    },
    valueChanged() {
      this.$emit('value-change', this.inputName, this.inputValue);
    },
  },
  mounted() {
    if (['checkboxes', 'radio'].includes(this.inputType)) {
      this.inputValue = [];
    }

    if (this.startingValue) {
      this.inputValue = this.startingValue;
    }

    if (this.formatType) {
      this.cleaveOptions = {};

      switch (this.formatType) {
        case 'tel':
          this.cleaveOptions = {
            delimiter: '-',
            blocks: [3, 3, 4],
            numericOnly: true,
          };
          break;
        case 'zip':
          this.cleaveOptions = {
            blocks: [5],
            numericOnly: true,
          };
          break;
      }

      if (this.formatOptions) {
        Object.assign(this.cleaveOptions, this.formatOptions);
      }
    }
  },
};
</script>
