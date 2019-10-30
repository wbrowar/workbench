<template>
  <div>
    <h1>Accordion</h1>
    <p>
      Create an accordion to show and hide information, like Q&As. An accordion is made up of a wrapper Accordion
      component and AccordionTab components for the content.
    </p>

    <ImportPath path="import Accordion from 'Components/accordion/Accordion';" />

    <CodeExample :code="code.accordion" title="Accordion">
      <Accordion>
        <AccordionTab v-for="n in 3" :key="n">
          <div slot="header">Header (click to expand)</div>
          <div slot="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur cum dicta dolore eaque enim eveniet ipsum iusto, maiores omnis perferendis sit temporibus vitae voluptatum. Aspernatur autem error numquam omnis sed?</div>
        </AccordionTab>
      </Accordion>
    </CodeExample>

    <PropsTable :props="accordionProps" />

    <h1>Accordion Tab</h1>
    <p>An accordion tab is made up of an AccordionTab component and two slots: the 'header' is what gets clicked on to show and hide the 'content' slot. An accordion tab can be used as a child within an Accordion component, or it can be used on it's own to hide single pieces of content.</p>

    <ImportPath path="import AccordionTab from 'Components/accordion/AccordionTab';" />

    <CodeExample :code="code.accordionTab" title="Single Accordion Tab">
      <AccordionTab open toggle-self>
        <div slot="header">Header</div>
        <div slot="content">Content</div>
      </AccordionTab>
    </CodeExample>

    <PropsTable :props="accordionTabProps" />
  </div>
</template>

<script>
import { log } from 'JS/global';
import Accordion from 'Components/accordion/Accordion';
import AccordionTab from 'Components/accordion/AccordionTab';
import Grid from 'Components/grid/Grid';
import CodeExample from 'Starter/style_inventory/vue/CodeExample';
import CssModifiers from 'Starter/style_inventory/vue/CssModifiers';
import ImportPath from 'Starter/style_inventory/vue/ImportPath';
import PropsTable from 'Starter/style_inventory/vue/PropsTable';

export default {
  components: {
    Accordion,
    AccordionTab,
    Grid,
    CodeExample,
    CssModifiers,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      code: false,
      modifiers: false,
      accordionProps: false,
      accordionTabProps: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.code = {
      accordion: `<Accordion>
  <AccordionTab v-for="n in 3" :key="n">
    <div slot="header">Header</div>
    <div slot="content">...</div>
  </AccordionTab>
</Accordion>`,
      accordionTab: `<AccordionTab open toggle-self>
  <div slot="header">Header</div>
  <div slot="content">Content</div>
</AccordionTab>`,
    };
    this.modifiers = [{ name: 'test', description: `Test` }];
    this.accordionProps = [{ name: 'firstTabOpen', type: 'Boolean', default: `true`, description: `The first tab is opened on load.` }];
    this.accordionTabProps = [
      { name: 'open', type: 'Boolean', default: `false`, description: `Open this tab by default. This can be overwritten by a parent Accordion component.` },
      { name: 'toggleSelf', type: 'Boolean', default: `false`, description: `When used outside of an Accordion component, setting this to 'true' enables show/hide functionality.` },
    ];
  },
};
</script>
