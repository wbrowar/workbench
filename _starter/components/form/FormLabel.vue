<template>
  <label class="c_form_input__label" :for="inputId || null"
    >{{ labelText }}<span class="c_form_input__required_indicator" v-if="required">*</span></label
  >
</template>

<script>
export default {
  props: {
    inputId: String,
    labelText: { type: String, required: true },
    required: { type: Boolean, default: false },
  },
};
</script>
