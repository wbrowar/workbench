<template>
  <div>
    <h1>Title</h1>
    <p>Description</p>

    <ImportPath path="import Grid from 'Components/folder/ComponentName';" />

    <CodeExample :code="code.default" title="Required Title" description="Optional description.">
      <p>Demo</p>
    </CodeExample>

    <PropsTable :props="props" />

    <CssModifiers root-class="c_root_class" :modifiers="modifiers" />
  </div>
</template>

<script>
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
// import EventsTable from 'Starter/docs/vue/EventsTable.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    CodeExample,
    CssModifiers,
    // EventsTable,
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
    this.events = [{ name: 'onExample', arguments: 'example', description: `Example description.` }];
    this.modifiers = [{ name: 'example', description: `Example description.` }];
    this.props = [{ name: 'example', type: 'String', default: `''`, description: `Example description.` }];
  },
};
</script>
