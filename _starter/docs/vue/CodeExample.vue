<template>
  <div class="docs__code_example" :class="{ 'docs__code_example--code': code }">
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
    <div class="docs__code_example__output border border-solid border-gray-300" :class="[`bg-${dark ? 'black' : 'white'}`]">
      <slot />
    </div>
    <div class="docs__code_example__code" v-text.trim="code" v-if="code"></div>
      <div class="docs__code_example__copy" :title="`Copy ${copyText} to clipboard`" @click="copyToClipboard(copyText)" v-if="copyText">COPY {{ copyText }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      code: String,
      copyText: String,
      dark: { type: Boolean, default: false },
      description: String,
      title: { type: String, required: true },
    },
    methods: {
      copyToClipboard: function (text) {
        navigator.clipboard.writeText(text).then(function() {
          log(`Copied to clipboard: ${ text }`);
        }, function() {
          log(`Could not copy ${ text } to clipboard`);
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .docs__code_example {
    $self: &;

    position: relative;
    margin: 80px 0;

    @at-root #{$self}__output {
      position: relative;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 4px;

      @at-root #{$self}--code & {
        border-radius: 4px 4px 0 0;
      }
    }
    @at-root #{$self}__copy {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: -40px;
      left: 6px;
      padding: 1em 3em;
      height: 40px;
      border-radius: 0 0 10px 10px;
      background-color: rgba(211, 220, 231, 0.2);
      border: 1px solid rgba(211, 220, 231, 0.7);
      border-top: none;
      font-size: .8rem;
      color: #91a8c3;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease-out;

      @at-root #{$self}:hover & {
        opacity: 1;
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