<template>
  <div :is="elementType" :style="gridStyles">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    columns: Number,
    columnWidth: { type: String, default: '1fr' },
    elementType: { type: String, default: 'div' },
    gap: { type: String, default: '0' },
    rows: Number,
    rowHeight: { type: String, default: 'auto' },
    templateColumns: String,
    templateRows: String,
  },
  computed: {
    gridStyles: function() {
      let styles = {
        display: 'grid',
        gridGap: this.gap || false,
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
