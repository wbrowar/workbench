<template>
  <div class="docs__import_path" @click="copyToClipboard(path)" title="Click to copy">{{ path }}</div>
</template>

<script>
  import { log } from 'JS/global';

  export default {
    props: {
      path: { type: String, required: true },
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
  @keyframes docs-hop {
    0% { transform: translateY(0) }
    40% { transform: translateY(-4px) }
    100% { transform: translateY(0) }
  }
  .docs__import_path {
    padding: 14px 20px;
    background-color: #252525;
    border-radius: 7px;
    box-sizing: border-box;
    font-family: "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, monospace;
    font-size: 16px;
    font-weight: 100;
    color: #a7e08b;
    cursor: pointer;

    &:hover {
      animation: docs-hop .4s ease-out forwards;
    }
    &:active {
      background-color: #3c4a32;
    }
  }
  /*! purgecss end ignore */
</style>