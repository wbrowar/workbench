<template>
  <div class="docs__code_example" :class="{ 'docs__code_example--code': code }">
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
    <div class="docs__code_example__output border border-solid border-gray-300" :class="[`bg-${dark ? 'black' : 'white'}`]">
      <slot />
    </div>
    <div class="docs__code_example__code" v-text.trim="code" v-if="code"></div>
  </div>
</template>

<script>
  export default {
    props: {
      code: String,
      dark: { type: Boolean, default: false },
      description: String,
      title: { type: String, required: true },
    },
  };
</script>

<style lang="scss" scoped>
  .docs__code_example {
    $self: &;

    margin: 80px 0;

    @at-root #{$self}__output {
      padding: 20px;
      box-sizing: border-box;
      border-radius: 4px;

      @at-root #{$self}--code & {
        border-radius: 4px 4px 0 0;
      }
    }
    @at-root #{$self}__code {
      padding: 20px;
      background-color: rgba(211, 220, 231, 0.3);
      border-radius: 0 0 4px 4px;
      border: 1px solid rgba(211, 220, 231, 0.7);
      border-top: none;
      white-space: pre-wrap;
      font-size: 14px;
      color: #91a8c3;
    }
  }
</style>