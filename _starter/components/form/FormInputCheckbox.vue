<template>
  <div class="c_form_input_checkbox" :style="styles" @click="onClickHandler">
    <div
      class="c_form_input_checkbox__checkbox"
      :class="{ 'c_form_input_checkbox__checkbox--checked': inputChecked }"
      v-if="inputMode === 'checkbox'"
    ></div>
    <div
      class="c_form_input_checkbox__radio"
      :class="{ 'c_form_input_checkbox__radio--checked': inputChecked }"
      v-else-if="inputMode === 'radio'"
    ></div>
    <span class="c_form_input_checkbox__close_label">{{ labelText }}</span>
  </div>
</template>

<script>
// import { log } from 'JS/global.js';

export default {
  components: {},
  data() {
    return {
      fields: [],
    };
  },
  props: {
    closeButton: { type: Boolean, default: false },
    iconUrl: String,
    inputChecked: { type: Boolean, default: false },
    inputMode: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'checkbox', 'radio'].includes(value),
    },
    labelText: { type: String, required: true },
  },
  computed: {
    styles() {
      const styles = {};
      const gridColumns = [];

      if (['checkbox', 'radio'].includes(this.inputMode)) {
        gridColumns.push('var(--input-width)');
      }
      if (this.iconUrl) {
        gridColumns.push('var(--icon-width)');
      }
      gridColumns.push('1fr');
      if (this.closeButton) {
        gridColumns.push('var(--close-width)');
      }

      styles.gridTemplateColumns = gridColumns.join(' ');

      return styles;
    },
  },
  methods: {
    onClickHandler() {
      this.$emit('onClick');
    },
  },
};
</script>

<style lang="scss">
.c_form_input_checkbox {
  $self: &;

  //--input-width: 20px;
  //--icon-width: 35px;
  //--close-width: 30px;
  //
  //display: grid;
  //grid-template-rows: minmax(30px, auto);
  //gap: 0.7rem;
  //align-items: center;
  //padding: 0.9rem;
  //font-size: 1.1rem;
  //line-height: 1;
  //cursor: pointer;
  //
  //@at-root #{$self}__checkbox {
  //  border: 1.5px solid var(--color-black);
  //  border-radius: 4px;
  //  width: 20px;
  //  height: 20px;
  //
  //  @at-root #{&}--checked {
  //    background-color: $color_yellow;
  //  }
  //}
  //@at-root #{$self}__radio {
  //  border: 1.5px solid var(--color-black);
  //  border-radius: 50%;
  //  width: 20px;
  //  height: 20px;
  //
  //  @at-root #{&}--checked {
  //    background-color: $color_yellow;
  //  }
  //}
}
</style>
