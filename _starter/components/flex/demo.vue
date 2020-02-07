<template>
  <div>
    <h1 class="dev__components__demo__header">Flexbox</h1>

    <ImportPath path="import Flex from 'Components/flex/Flex.vue';" />

    <CodeExample :code="code.default" title="Flexbox" description="A simple flexbox wrapper.">
      <Flex>
        <Box demo><span>Hello</span></Box>
        <Box demo><span>Hello</span></Box>
        <Box demo><span>Hello</span></Box>
      </Flex>
    </CodeExample>

    <CodeExample
      :code="code.center"
      title="Centered Children"
      description="A shortcut for centering children elements in a column."
    >
      <Flex center :box="{ demo: true }">
        <span><strong>Header</strong></span>
        <span>Subheader</span>
      </Flex>
    </CodeExample>

    <CodeExample :code="code.stretch" title="Streched Children" description="Stretch child elements.">
      <Flex stretch>
        <Box demo><span>Hello</span></Box>
        <Box demo><span>Hello</span></Box>
        <Box demo><span>Hello</span></Box>
      </Flex>
    </CodeExample>

    <PropsTable :props="props" />

    <CssModifiers root-class="c-flex" :modifiers="modifiers" />
  </div>
</template>

<script>
import Box from 'Components/box/Box.vue';
import Flex from 'Components/flex/Flex.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    Box,
    Flex,
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
      default: `<Flex>
  <Box demo></Box>
  <Box demo></Box>
  <Box demo></Box>
</Flex>`,
      center: `<Flex center>
  <span><strong>Header</strong></span>
  <span>Subheader</span>
</Flex>`,
      stretch: `<Flex stretch>
  <Box demo></Box>
  <Box demo></Box>
  <Box demo></Box>
</Flex>`,
    };
    this.modifiers = [
      { name: 'centered', description: `Center children elements in a column.` },
      { name: 'stretched', description: `Stretch child elements by setting 'flex-grow' to '1'` },
    ];

    this.props = [
      { name: 'align', type: 'String', description: `Sets the 'align-items' CSS property.` },
      { name: 'box', type: 'Object', description: `Props to pass into the containing Box component.` },
      {
        name: 'center',
        type: 'Boolean',
        default: `false`,
        description: `Shortcut to center the content using 'align-items: center' and 'justify-content: center'.`,
      },
      { name: 'direction', type: 'String', default: `'row'`, description: `Sets the 'flex-direction' CSS property.` },
      {
        name: 'elementType',
        type: 'String',
        default: `'div'`,
        description: `Change the element of the flex wrapper for semantic HTML or accessibility.`,
      },
      { name: 'height', type: 'String', description: `Sets the 'height' CSS property.` },
      { name: 'justify', type: 'String', description: `Sets the 'justify-content' CSS property.` },
      {
        name: 'stretch',
        type: 'Boolean',
        default: `false`,
        description: `Shortcut to set the children’s 'flex-grow' property to '1'`,
      },
      { name: 'width', type: 'String', description: `Sets the 'width' CSS property.` },
      { name: 'wrap', type: 'String', description: `Sets the 'flex-wrap' CSS property.` },
    ];
  },
};
</script>
