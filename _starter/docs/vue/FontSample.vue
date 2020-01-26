<template>
  <div class="docs__font_sample" :class="classes" :style="{ '--docs-font-sample-size': size }" @click="copyToClipboard(copyString)" :title="`Click to copy '${ `${copyString}` }' to clipboard`">{{ text }}</div>
</template>

<script>
  import { log } from 'JS/global';

  export default {
    props: {
      handle: { type: String, required: true },
      size: { type: Number, required: true },
      text: { type: String, required: true },
      weight: String,
    },
    computed: {
      classes: function() {
        let classes = [];

        classes.push([`text-${this.handle}`]);

        if (this.weight) {
          classes.push([`font-${this.weight}`]);
        }

        return classes;
      },
      copyString: function() {
        return this.weight ? `text-${this.handle} font-${this.weight}` : `text-${this.handle}`;
      },
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
    cursor: pointer;
  }
</style>