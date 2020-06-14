<template>
  <div>
    <h1>Subheader</h1>
    <p>A subheader that can be used as a page anchor.</p>

    <ImportPath path="import Subheader from 'Components/subheader/Subheader.vue';" />

    <CodeExample :code="code.default" title="Required Title" description="Optional description.">
      <Subheader anchor :header-level="1" text="Subheader Text Goes Here" />
    </CodeExample>

    <PropsTable :props="props" />
  </div>
</template>

<script>
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';
import Subheader from 'Components/subheader/Subheader.vue';

export default {
  components: {
    CodeExample,
    ImportPath,
    PropsTable,
    Subheader,
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
      default: `<Subheader anchor :header-level="1" text="Subheader Text Goes Here" />`,
    };
    this.props = [
      {
        name: 'anchor',
        type: 'Boolean',
        default: `false`,
        description: `Turns subheader into page anchor by kebab-casing the text prop as the element ID.`,
      },
      { name: 'headerLevel', type: 'Number', default: `2`, description: `Determines if the header element is h1-h6.` },
      { name: 'text', type: 'String', description: `Text displayed as subheader. HTML can be used.` },
    ];
  },
};
</script>
