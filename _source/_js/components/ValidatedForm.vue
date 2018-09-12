<template>
    <form @submit="submitForm">
        <div class="c_form__errors_wrapper c_message c_message--error c_text" v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error.message }}</li>
            </ul>
        </div>
        <slot></slot>
    </form>
</template>

<script>
    import { log } from '../global.js';

    export default {
        data() {
            return {
                errors: [],
            }
        },
        props: {
            ajaxSubmitUrl: false,
            formId: { required: true },
            validate: false,
        },
        methods: {
            checkForExistingError: function(name, message) {
                for (let i=0; i<this.errors.length; i++) {
                    if (this.errors[i].fieldName === name && this.errors[i].message === message) {
                        return true;
                    }
                }
                return false;
            },
            submitForm: function(e) {
                let submit = true;
                if (this.validate) {
                    if (this.errors.length > 0) {
                        submit = false;
                    }
                }

                if (submit) return true;
                e.preventDefault();
            }
        },
        mounted() {
            VueEvent.$on('form-set-error', (formId, fieldName, message) => {
                if (this.formId === formId) {
                    if (!this.checkForExistingError(fieldName, message)) {
                        this.errors.push({ fieldName: fieldName, message: message });
                    }
                }
            });
            VueEvent.$on('form-remove-error', (formId, fieldName) => {
                let i = this.errors.length;
                while (i--) {
                    if (this.errors[i].fieldName === fieldName) {
                        this.errors.splice(i, 1);
                    }
                }
            });
        }
    }
</script>