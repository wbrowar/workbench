<template>
  <div class="docs__color_swatch">
    <div class="docs__color_swatch__checkers" @click="copyToClipboard(`$color_${ name }`)" :title="`Click to copy '$color_${ name }' to clipboard`">
      <div class="docs__color_swatch__color" :style="{ backgroundColor: color }"></div>
    </div>
    <div class="docs__color_swatch__variable" @click="copyToClipboard(name)" :title="`Click to copy 'name' to clipboard`">{{ name }}</div>
    <div class="docs__color_swatch__value">{{ color }}</div>
    <div class="docs__color_swatch__options">
      <p class="docs__color_swatch__options__title">{{ name }}</p>
      <div class="docs__color_swatch__option" @click="copyToClipboard(`bg-${name}`)" :title="`Click to copy 'bg-${name}' to clipboard`">
        <div class="docs__color_swatch__checkers"><div class="docs__color_swatch__option__display" :class="`bg-${name}`"></div></div>
        <div class="docs__color_swatch__option__label">Background</div>
      </div>
      <div class="docs__color_swatch__option" @click="copyToClipboard(`text-${name}`)" :title="`Click to copy 'text-${name}' to clipboard`">
        <div><div class="docs__color_swatch__option__display bg-dev-white" :class="`text-${name}`">A</div></div>
        <div class="docs__color_swatch__option__label">Text</div>
      </div>
      <div class="docs__color_swatch__option" @click="copyToClipboard(`border-${name}`)" :title="`Click to copy 'border-${name}' to clipboard`">
        <div><div class="docs__color_swatch__option__display bg-dev-white border-8 border-solid" :class="`border-${name}`"></div></div>
        <div class="docs__color_swatch__option__label">Border</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { log } from 'JS/global';

  export default {
    props: {
      color: { type: String, required: true },
      name: { type: String, required: true },
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
  .docs__color_swatch {
    position: relative;
    padding: 12px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 2px 7px rgba(43, 48, 59, 0.1);
    border: 1px solid rgba(43, 48, 59, 0.1);
    height: 100%;

    &__checkers {
      background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      border-radius: 3px;
      cursor: pointer;
    }
    &__color {
      margin-bottom: 6px;
      padding-top: 100%;
      position: relative;
      background-color: var(--docs-color-swatch-color);
      border-radius: 3px;
    }
    &__variable, &__value {
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.7rem;
      color: #2b303b;
    }
    &__variable {
      font-weight: 700;
      cursor: pointer;
    }
    &__options {
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px;
      width: 100%;
      height: 100%;
      background-color: rgb(255, 255, 255);
      transition: opacity .2s ease-out;
      opacity: 0;

      & > * {
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .docs__color_swatch:hover & {
        opacity: 1;
      }

      &__title {
        color: rgba(43, 48, 59, .4);
      }
    }
    &__option {
      display: grid;
      grid-template-columns: 40px auto;
      grid-template-rows: 40px;
      gap: 10px;
      align-items: center;
      cursor: pointer;

      &__header {
        font-size: 1.1rem;
        color: #2b303b;
      }
      &__display {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 3px;
        /*border: 1px solid rgba(43, 48, 59, 0.1);*/
        /*box-shadow: inset 1px 4px 5px rgba(43, 48, 59, 0.1);*/
        font-size: 2.4rem;
        font-weight: 900;
      }
      &__label {
        font-size: 0.8rem;
        color: #2b303b;
      }
    }
  }
  /*! purgecss end ignore */
</style>
