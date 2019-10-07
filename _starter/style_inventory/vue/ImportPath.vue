<template>
  <div class="docs__import_path" @click="copyToClipboard(path)" title="Click to copy"><i>{{ path }}</i></div>
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

<style lang="scss" scoped>
  @keyframes docs-hop {
    0% { transform: translateY(0) }
    40% { transform: translateY(-4px) }
    100% { transform: translateY(0) }
  }
  .docs__import_path {
    $self: &;

    padding: 14px 20px;
    background-color: #252525;
    border-radius: 7px;
    box-sizing: border-box;
    font-size: 18px;
    font-weight: 700;
    color: #a7e08b;
    cursor: pointer;

    &:hover {
      animation: docs-hop .4s ease-out forwards;
    }
    &:active {
      background-color: #3c4a32;
    }
  }
</style>