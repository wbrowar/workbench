<template>
    <div>
        <label :for="inputId">{{ label }}<span class="c_form_input__required_indicator" v-if="required">•</span></label>

        <textarea :id="inputId" :class="{ inputClasses, 'c_form_input--invalid': !isValid }" :required="required" v-if="inputType === 'textarea'"></textarea>
        <input :id="inputId" :class="{ inputClasses, 'c_form_input--invalid': !isValid }" :type="inputType" :name="inputName" :required="required" @blur="validateField" v-else>

        <div class="c_form_input__error" v-if="!isValid">{{ error }}</div>
    </div>
</template>

<script>
    import { log } from '../global.js';
    import Cleave from 'cleave.js';
    //import * as CleavePhone from '../../../node_modules/cleave.js/dist/addons/cleave-phone.us.js';

    export default {
        data() {
            return {
                error: false,
                formatter: false,
                input: false,
                isValid: true,
            }
        },
        props: {
            errorMessage: false,
            format: false,
            formId: false,
            inputClasses: false,
            inputId: false,
            inputName: false,
            inputPlaceholder: false,
            inputType: false,
            inputValue: false,
            label: false,
            required: false,
            validate: false,
        },
        methods: {
            setErrorForFormId(message = null) {
                this.error = this.errorMessage || message;
                VueEvent.$emit('form-set-error', this.formId, this.inputName, this.error);
            },
            removeErrorForFormId() {
                VueEvent.$emit('form-remove-error', this.formId, this.inputName);
            },
            validateField: function() {
                if (this.validate) {
                    let validation = { valid: false, message: '' };

                    switch (this.validate) {
                        case 'email':
                            validation = this.validEmail(this.input.value);
                            break;
                        case 'tel':
                            validation = this.validTel(this.input.value);
                            break;
                        case 'text':
                            validation = this.validText(this.input.value);
                            break;
                        case 'zip':
                            validation = this.validZip(this.input.value);
                            break;
                    }

                    this.isValid = validation.valid;

                    if (!validation.valid || (this.input.value === '' && this.required)) {
                        this.setErrorForFormId(validation.message);
                    } else {
                        this.error = false;
                        this.removeErrorForFormId();
                    }
                }
            },
            validEmail: function(value) {
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return { valid: (re.test(value)), message: 'Please enter a valid email address.' };
            },
            validTel: function(value) {
                const re = /^\d{3}.\d{3}.\d{4}$/;
                return { valid: (re.test(value)), message: 'Please enter a valid phone number.' };
            },
            validText: function(value) {
                return { valid: (value !== ''), message: 'Please enter text.' };
            },
            validZip: function(value) {
                const re = /^\d{5}$/;
                return { valid: (re.test(value)), message: 'Please enter a valid ZIP code.' };
            }
        },
        mounted() {
            this.input = this.$el.querySelector('input');

            if (this.inputValue) {
                log('inital value found: ' + this.inputValue);
                this.input.value = this.inputValue;
                this.validateField();
            }

            if (this.format) {
                let options = false;

                switch (this.format) {
                    case 'tel':
                        options = {
                            delimiter: '.',
                            blocks: [3, 3, 4],
                            numericOnly: true,
                        };
                        break;
                    case 'zip':
                        options = {
                            blocks: [5],
                            numericOnly: true,
                        };
                        break;
                }
                if (options) {
                    this.formatter = new Cleave(this.input, options);
                }
            }
        }
    }
</script>