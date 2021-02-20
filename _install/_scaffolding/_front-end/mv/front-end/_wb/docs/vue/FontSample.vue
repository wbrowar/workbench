<template>
  <div class="docs__font_sample" :class="classes" @click="copyToClipboard(copyString)" :title="`Click to copy '${ `${copyString}` }' to clipboard`">{{ text }}</div>
</template>

<script>
  import { log } from 'JS/global';

  export default {
    props: {
      handle: { type: String, required: true },
      size: { type: String, required: true },
      text: { type: String, required: true },
      weight: String,
    },
    computed: {
      classes: function() {
        let classes = [];

        classes.push([`font-${this.handle}`, `text-${this.size}`]);

        if (this.weight) {
          classes.push([`font-${this.weight}`]);
        }

        return classes;
      },
      copyString: function() {
        return this.weight ? `font-${this.handle} text-${this.size} font-${this.weight}` : `font-${this.handle} text-${this.size}`;
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

<style scoped>
  /*! purgecss start ignore */
  .docs__font_sample {
    cursor: pointer;
  }
  /*! purgecss end ignore */
</style>