<template>
  <div>
    <h1 class="dev__components__demo__header">Box</h1>
    <p>Helper styles for easier layout. Used as base for other components.</p>

    <ImportPath path="import Box from 'Components/box/Box.vue';" />

    <CodeExample title="Aspect Box" description="Constrain width and height to an aspect ratio." :code="code.aspect">
      <Box class="bg-gray-500" aspect="21/9">
        <div class="c-text text-white"><p>Content</p></div>
      </Box>
      <Box class="bg-gray-700" :aspect="$mq | mq({ sm: '1', md: '21/9' })">
        <div class="c-text text-white"><p>Content</p></div>
      </Box>
    </CodeExample>

    <CodeExample title="Demo" description="A fixed FPO element." :code="code.demo">
      <Box demo>
        <p>Demo</p>
      </Box>
    </CodeExample>

    <PropsTable :props="props" />

    <CssModifiers root-class="c-box" :modifiers="modifiers" />
  </div>
</template>

<script>
import Box from 'Components/box/Box.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    Box,
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
      aspect: `<Box class="bg-alert-error" aspect="21/9">
  <div class="c-text text-white"><p>Content</p></div>
</Box>
<Box class="bg-alert-success" :aspect="$mq | mq({ sm: '1', md: '21/9' })">
  <div class="c-text text-white"><p>Content</p></div>
</Box>`,
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
      { name: 'mask', description: `Sets 'position: absolute;' and fills the width and height of the container.` },
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

    if (this.globalData.wb.colors.light !== undefined) {
      const colorKeys = Object.keys(this.globalData.wb.colors.light);

      colorKeys.forEach((item) => {
        this.modifiers.push({ name: item, description: `Change text color to the value of $color_${item}` });
      });
    }
  },
};
</script>
