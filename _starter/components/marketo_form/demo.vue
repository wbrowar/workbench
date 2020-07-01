<template>
  <div>
    <h1>Marketo Forms</h1>

    <ImportPath path="import MarketoForm from 'Components/marketo_form/MarketoForm.vue';" />

    <CodeExample
      :code="code.default"
      title="Marketo Form"
      description="Embed a Marketo form based on the account information passed in."
    >
      <MarketoForm
        marketo-account="XXX-XXX-XXX"
        :marketo-form-id="XXX"
        marketo-form-domain="//app-sjXX.marketo.com"
        marketo-form-load-script="//app-sjXX.marketo.com/js/forms2/js/forms2.min.js"
      />
    </CodeExample>

    <PropsTable :props="props" />

    <!--    <CssModifiers root-class="c_root_class" :modifiers="modifiers" />-->
  </div>
</template>

<script>
import MarketoForm from 'Components/marketo_form/MarketoForm.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
// import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
// import EventsTable from 'Starter/docs/vue/EventsTable.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    MarketoForm,
    CodeExample,
    // CssModifiers,
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
      default: `<MarketoForm
  marketo-account="XXX-XXX-XXX"
  :marketo-form-id="XXX"
  marketo-form-domain="//app-sjXX.marketo.com"
  marketo-form-load-script="//app-sjXX.marketo.com/js/forms2/js/forms2.min.js"
/>`,
    };
    this.events = [{ name: 'onExample', arguments: 'example', description: `Example description.` }];
    this.modifiers = [{ name: 'example', description: `Example description.` }];
    this.props = [
      { name: 'formClass', type: 'String', description: `Add classes to form wrapper.` },
      {
        name: 'marketoAccount',
        type: 'String',
        description: `Marketo Account number as pulled from a form embed (usually the second argument in MktoForms2.loadForm).`,
      },
      {
        name: 'marketoFormId',
        type: 'Number',
        description: `The ID of this form (usually the 3rd argument in MktoForms2.loadForm).`,
      },
      {
        name: 'marketoFormDomain',
        type: 'String',
        description: `The domain used to load the form script. This can also be set in Vuex, but the prop will overwrite it.`,
      },
      {
        name: 'marketoFormLoadScript',
        type: 'String',
        description: `The URL to the Javascript file that loads the Marketo form. This can also be set in Vuex, but the prop will overwrite it.`,
      },
    ];
  },
};
</script>
