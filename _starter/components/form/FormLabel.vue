<template>
  <label :for="inputId || null">{{ labelText }}<span v-if="required">*</span></label>
</template>

<script>
export default {
  name: 'FormLabel',
  props: {
    inputId: String,
    labelText: { type: String, required: true },
    required: { type: Boolean, default: false },
  },
};
</script>
