<template>
  <div>
    <h1>Box</h1>
    <p>Helper styles for easier layout. Used as base for other components.</p>

    <CodeExample title="Demo" description="A fixed FPO element." :code="code.demo">
      <Box demo>
        <p>Demo</p>
      </Box>
    </CodeExample>

    <PropsTable :props="props" />

    <CssModifiers root-class="c_box" :modifiers="modifiers" />
  </div>
</template>

<script>
import Box from 'Components/box/Box';
import CodeExample from 'Starter/style_inventory/vue/CodeExample';
import CssModifiers from 'Starter/style_inventory/vue/CssModifiers';
import PropsTable from 'Starter/style_inventory/vue/PropsTable';

export default {
  components: {
    Box,
    CodeExample,
    CssModifiers,
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
      demo: `<Box demo>
  <p>Demo</p>
</Box>`,
    };

    this.props = [
      { name: 'demo', type: 'Boolean', default: `false`, description: `Creates a fixed size element used for FPO.` },
      {
        name: 'elementType',
        type: 'String',
        default: `'div'`,
        description: `Change the element of the box wrapper for semantic HTML or accessibility.`,
      },
    ];

    this.modifiers = [
      { name: 'center', description: `Sets 'text-align: center'` },
      { name: 'full', description: `Sets 'width: 100%' and 'height: 100%'` },
      { name: 'full--height', description: `Sets 'height: 100%'` },
      { name: 'full--width', description: `Sets 'width: 100%'` },
      { name: 'margin', description: `Adds margin above and below the text based on the value of $spacing_text.` },
      { name: 'margin--auto', description: `Sets 'margin-left: auto' and 'margin-right: auto'` },
      { name: 'margin--top' },
      { name: 'margin--right' },
      { name: 'margin--bottom' },
      { name: 'margin--left' },
      { name: 'padding', description: `Adds padding above and below the text based on the value of $spacing_text.` },
      { name: 'padding--top' },
      { name: 'padding--right' },
      { name: 'padding--bottom' },
      { name: 'padding--left' },
      { name: 'v', description: `Sets 'width: 100vw' and 'height: 100vh'` },
      { name: 'v--min--height', description: `Sets 'min-height: 100vh'` },
      { name: 'v--min--width', description: `Sets 'min-width: 100vw'` },
      { name: 'v--height', description: `Sets 'height: 100vh'` },
      { name: 'v--width', description: `Sets 'width: 100vw'` },
    ];

    if (this.globalData.pkg.colors.light !== undefined) {
      const colorKeys = Object.keys(this.globalData.pkg.colors.light);

      colorKeys.forEach((item) => {
        this.modifiers.push({ name: item, description: `Change text color to the value of $color_${item}` });
      });
    }
  },
};
</script>
