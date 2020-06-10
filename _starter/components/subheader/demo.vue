<template>
  <div>
    <h1>Title</h1>
    <p>Description</p>

    <ImportPath path="import Grid from 'Components/folder/ComponentName';" />

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
      default: `<p>Demo</p>`,
    };
    this.events = [{ name: 'onExample', arguments: 'example', description: `Example description.` }];
    this.modifiers = [{ name: 'example', description: `Example description.` }];
    this.props = [{ name: 'example', type: 'String', default: `''`, description: `Example description.` }];
  },
};
</script>
