<template>
  <div class="c_grid c_grid--js" :is="elementType" :style="gridStyles" v-bind="box">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    align: String,
    box: {
      type: Object,
      default: () => {
        return {};
      },
    },
    columns: Number,
    columnWidth: { type: String, default: '1fr' },
    elementType: { type: String, default: 'div' },
    gap: { type: String, default: '0' },
    justify: String,
    rows: Number,
    rowHeight: { type: String, default: 'auto' },
    templateColumns: String,
    templateRows: String,
  },
  computed: {
    gridStyles: function() {
      let styles = {
        display: 'grid',
        alignItems: this.align || null,
        gridGap: this.gap || false,
        justifyContent: this.justify || null,
      };

      if (this.templateColumns) {
        styles.gridTemplateColumns = this.templateColumns;
      } else if (this.columns) {
        styles.gridTemplateColumns = `repeat(${this.columns}, ${this.columnWidth})`;
      }

      if (this.templateRows) {
        styles.gridTemplateRows = this.templateRows;
      } else if (this.rows) {
        styles.gridTemplateRows = `repeat(${this.rows}, ${this.rowHeight})`;
      }

      return styles;
    },
  },
};
</script>
