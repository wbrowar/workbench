<template>
  <div class="docs__color_swatch">
    <div class="docs__color_swatch__checkers">
      <div class="docs__color_swatch__color" :style="{ backgroundColor: color }"></div>
    </div>
    <div class="docs__color_swatch__variable">$color_{{ name }}</div>
    <div class="docs__color_swatch__value">{{ color }}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    props: {
      color: { type: String, required: true },
      name: { type: String, required: true },
    },
  };
</script>

<style lang="scss" scoped>
  .docs__color_swatch {
    $self: &;

    position: relative;
    padding: 12px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 2px 7px rgba(43, 48, 59, 0.1);
    border: 1px solid rgba(43, 48, 59, 0.1);
    height: 100%;

    @at-root #{$self}__checkers {
      background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      border-radius: 3px;
    }
    @at-root #{$self}__color {
      margin-bottom: 6px;
      padding-top: 100%;
      position: relative;
      background-color: var(--docs-color-swatch-color);
      border-radius: 3px;
    }
    @at-root #{$self}__variable, #{$self}__value {
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.7rem;
      color: #2b303b;
    }
    @at-root #{$self}__variable {
      font-weight: 700;
    }
  }
</style>