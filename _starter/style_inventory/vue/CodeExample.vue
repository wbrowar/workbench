<template>
  <div class="root">
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
    <div class="root__output" :style="{ backgroundColor: dark ? 'rgb(43, 48, 59)' : 'rgb(255, 255, 255)' }">
      <slot />
    </div>
    <div class="root__code" v-text.trim="code"></div>
  </div>
</template>

<script>
  export default {
    props: {
      code: { type: String, required: true },
      dark: { type: Boolean, default: false },
      description: String,
      title: { type: String, required: true },
    },
  };
</script>

<style lang="scss" scoped>
  .root {
    $self: &;

    margin: 80px 0;

    @at-root #{$self}__output {
      padding: 20px;
      box-sizing: border-box;
      border: 1px solid rgba(211, 220, 231, 0.7);
      border-radius: 4px 4px 0 0;
    }
    @at-root #{$self}__code {
      padding: 20px;
      background-color: rgba(211, 220, 231, 0.3);
      border-radius: 0 0 4px 4px;
      border: 1px solid rgba(211, 220, 231, 0.7);
      white-space: pre-wrap;
      font-size: 14px;
      color: #91a8c3;
    }
  }
</style>