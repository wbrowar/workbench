<template>
  <div>
    <h1>Grid</h1>
    <p>
      Use CSS Grid to lay out content at breakpoints defined in `src/main.js` OR use CSS to lay out content in
      predefined CSS grids.
    </p>
    <p><em>NOTE: These are just helpers and custom CSS grids can be used throughout your sections and pages.</em></p>

    <ImportPath path="import Grid from 'Components/grid/Grid.vue';" />

    <CodeExample
      title="Column-based Grid"
      description="Set the amount of columns to create a simple, equally-spaced grid."
      :code="code.jsGrid1"
    >
      <Grid element-type="article" :columns="$mq | mq({ sm: 1, md: 2, lg: 3 })" gap="14px">
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
      </Grid>
    </CodeExample>

    <CodeExample
      title="Designed Grid"
      description="Set the `grid-template-columns` and/or `grid-template-rows` properties to create a custom grid at each breakpoint."
      :code="code.jsGrid2"
    >
      <Grid
        element-type="article"
        :template-columns="$mq | mq({ sm: '1fr', md: '1fr 2fr', lg: '1fr 2fr 3fr' })"
        :template-rows="$mq | mq({ sm: '300px 300px 300px', md: '300px 300px', lg: '300px' })"
        gap="14px"
      >
        <MediaImage background alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
        <MediaImage background alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
        <MediaImage
          background
          alt="FPO image"
          :sources="[{ src: `/img/FPO.png` }]"
          :style="{ gridColumn: $mq === 'md' ? '1 / 3' : null }"
        />
      </Grid>
    </CodeExample>

    <PropsTable :props="props" />

    <CodeExample
      title="CSS Grid"
      description="A 2-column grid, that splits into 3-columns at 900px."
      :code="code.cssGrid1"
    >
      <div class="c_grid c_grid--2-3">
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
      </div>
    </CodeExample>
  </div>
</template>

<script>
import Grid from 'Components/grid/Grid.vue';
import MediaImage from 'Components/image/MediaImage.vue';
import CssModifiers from 'Starter/style_inventory/vue/CssModifiers.vue';
import CodeExample from 'Starter/style_inventory/vue/CodeExample.vue';
import ImportPath from 'Starter/style_inventory/vue/ImportPath.vue';
import PropsTable from 'Starter/style_inventory/vue/PropsTable.vue';

export default {
  components: {
    Grid,
    MediaImage,
    CodeExample,
    CssModifiers,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      code: false,
      modifiers: false,
      props: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.code = {
      jsGrid1: `<Grid element-type="article" :columns="$mq | mq({ sm: 1, md: 2, lg: 3 })" gap="14px">
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
</Grid>`,
      jsGrid2: `<Grid
  element-type="article"
  :template-columns="$mq | mq({ sm: '1fr', md: '1fr 2fr', lg: '1fr 2fr 3fr' })"
  gap="4px 10px"
>
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
</Grid>`,
      cssGrid1: `<div class="c_grid c_grid--2-3">
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
</div>`,
    };
    this.props = [
      { name: 'align', type: 'String', description: `Sets the 'align-items' CSS property.` },
      { name: 'box', type: 'Object', description: `Props to pass into the containing Box component.` },
      { name: 'columns', type: 'Number', description: `Set the amount of columns in a evenly spaced column layout.` },
      {
        name: 'columnWidth',
        type: 'String',
        default: `'1fr'`,
        description: `Set the width of each of the columns when using the 'columns' prop.`,
      },
      {
        name: 'elementType',
        type: 'String',
        default: `'div'`,
        description: `Change the element of the grid wrapper for semantic HTML or accessibility.`,
      },
      { name: 'gap', type: 'String', default: `'0'`, description: `Sets the 'grid-gap' property.` },
      { name: 'justify', type: 'String', description: `Sets the 'justify-content' CSS property.` },
      { name: 'rows', type: 'Number', description: `Set the amount of rows in a grid.` },
      {
        name: 'rowHeight',
        type: 'String',
        default: `'auto'`,
        description: `Set the height of grid rows when using the 'rows' prop.`,
      },
      {
        name: 'templateColumns',
        type: 'String',
        description: `Define the columns of a grid using 'grid-template-columns'.`,
      },
      { name: 'templateRows', type: 'String', description: `Define the rows of a grid using 'grid-template-rows'.` },
    ];
  },
};
</script>
