<template>
  <div class="docs__font_sample" :style="fontStyles" @click="copyToClipboard(handle)" :title="`Click to copy '${ handle }' to clipboard`">{{ text }}</div>
</template>

<script>
  import { log } from 'JS/global';

  export default {
    data() {
      return {
      };
    },
    props: {
      font: { type: Object, required: true },
      handle: { type: String, required: true },
      text: { type: String, required: true },
      size: { type: Number, required: true },
    },
    computed: {
      fontStyles: function() {
        return {
          '--docs-font-sample-size': this.size,
          fontFamily: `${ this.font.fontFamily || '' }, ${ this.font.fallbackStack || '' }`,
          fontStyle: this.font.fontStyle || 'normal',
          fontWeight: this.font.fontWeight || 'normal',
        }
      }
    },
    methods: {
      copyToClipboard: function (text) {
        navigator.clipboard.writeText(text).then(function() {
          log(`Copied to clipboard: ${ text }`);
        }, function() {
          log(`Could not copy ${ text } to clipboard`);
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .docs__font_sample {
    $self: &;

    font-size: calc(var(--docs-font-sample-size, 1) * 1rem);
    padding-bottom: 0.2em;
    border-bottom: 1px solid rgba(211, 220, 231, 0.7);
  }
</style>