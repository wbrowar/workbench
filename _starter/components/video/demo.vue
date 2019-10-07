<template>
  <div>
    <h1>Title</h1>
    <p>Description</p>

    <ImportPath path="import Grid from 'Components/grid/Grid';" />

    <CodeExample :code="code.default" title="Required Title" description="Optional description.">
      <p>Demo</p>
    </CodeExample>

    <PropsTable :props="props" />

    <CssModifiers root-class="c_button" :modifiers="modifiers" />
  </div>
</template>

<script>
import CodeExample from 'Starter/style_inventory/vue/CodeExample';
import CssModifiers from 'Starter/style_inventory/vue/CssModifiers';
import ImportPath from 'Starter/style_inventory/vue/ImportPath';
import PropsTable from 'Starter/style_inventory/vue/PropsTable';

export default {
  components: {
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
      default: `<p>Demo</p>`,
    };
    this.modifiers = [{ name: 'test', description: `Test` }];
    this.props = [{ name: 'test', type: 'String', default: `''`, description: `Test` }];
  },
};
</script>
