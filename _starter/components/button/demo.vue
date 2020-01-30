<template>
  <div>
    <h1>Buttons</h1>
    <p>Link to internal or external URLs or create a button element to fire a Javascript function.</p>

    <ImportPath path="import Button from 'Components/button/Button.vue';" />

    <CodeExample
      :code="code.href"
      title="CTA Buttons"
      :description="`Link to internal pages or link to external URLs. Links that start with '/' will be converted to '${ globalData.wb.projectType === 'gridsome' ? 'g-link' : 'router-link' }' components to work with Vue Router.`"
    >
      <div class="c-buttons">
        <Button href="/about/" label-text="About (internal)" />
        <Button new-window href="https://vuejs.org/" label-text="Vue Website (external)" />
      </div>
    </CodeExample>

    <CodeExample
      :code="code.action"
      title="Action Buttons"
      description="Fire a Javascript function when the button is clicked. When no argument is passed through, a MouseEvent object will be returned."
    >
      <div class="c-buttons c-buttons--center">
        <Button @onClick="clickThroughAction" label-text="Get Click Event" />
        <Button @onClick="clickThroughAction('Button Clicked!')" label-text="Pass through argument" />
      </div>
    </CodeExample>

    <CodeExample
      :code="code.unstyled"
      title="Unstyled Buttons"
      description="Use the same props as regular buttons but add your own style. Passing a prop into a Button will automatically unstyle it, but styles can be added via CSS classes."
    >
      <div class="c-buttons c-buttons--right">
        <Button new-window unstyle href="https://vuejs.org/" label-text="Unstyled Button" />
        <Button new-window href="https://vuejs.org/">
          <Box demo />
        </Button>
        <Button class="c-button c-button--default c-button--pointer" new-window unstyle href="https://vuejs.org/"
          ><span>🎨 Style by classes</span></Button
        >
      </div>
    </CodeExample>

    <PropsTable :props="props" />

<!--    <CssModifiers root-class="c-button" :modifiers="modifiers" />-->
  </div>
</template>

<script>
import { log } from 'JS/global.js';
import Box from 'Components/box/Box.vue';
import Button from 'Components/button/Button.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    Box,
    Button,
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
  methods: {
    clickThroughAction: function(message = 'Button clicked!') {
      log(message);
    },
  },
  created() {
    this.code = {
      href: `<div class="c-buttons">
  <Button href="/about/" label-text="About (internal)" />
  <Button new-window href="https://vuejs.org/" label-text="Vue Website (external)" />
</div>`,
      action: `<div class="c-buttons c-buttons--center">
  <Button @onClick="clickThroughAction" label-text="Get Click Event" />
  <Button @onClick="clickThroughAction('Button Clicked!')" label-text="Pass through argument" />
</div>`,
      unstyled: `<div class="c-buttons c-buttons--right">
  <Button new-window unstyle href="https://vuejs.org/" label-text="Unstyled Button" />
  <Button new-window href="https://vuejs.org/">
    <Box demo />
  </Button>
  <Button class="c-button c-button--pointer" new-window unstyle href="https://vuejs.org/"><span>🎨 Style by classes</span></Button>
</div>`,
    };

    this.modifiers = [{ name: 'pointer', description: `Turns the cursor to a pointer.` },
      { name: 'outline', description: `Changes style of button to outline version.` },
    ];

    this.props = [
      { name: 'ariaLabel', type: 'String', description: `Sets the 'aria-label' attribute on a button.` },
      {
        name: 'elementType',
        type: 'String',
        default: `'button'`,
        description: `Change the element of the component wrapper for semantic HTML or accessibility.`,
      },
      { name: 'href', type: 'String', description: `The destination URL for CTA buttons.` },
      { name: 'labelText', type: 'String', description: `Label text shown on a button if a prop is not passed in.` },
      { name: 'newWindow', type: 'Boolean', default: `false`, description: `Sets 'target="_blank" rel="noopener"'.` },
      { name: 'outline', type: 'Boolean', default: `false`, description: `Adds the 'outline' modifier.` },
      { name: 'reset', type: 'Boolean', default: `false`, description: `Applies button_reset SCSS mixin.` },
      { name: 'target', type: 'String', description: `Sets the 'target' attribute if 'newWindow' is not used.` },
      {
        name: 'theme',
        type: 'String',
        default: `'default'`,
        description: `Extends button styles with colors and other sets of properties.`,
      },
      {
        name: 'unstyle',
        type: 'Boolean',
        default: `false`,
        description: `Removes the style of buttons for times where unique styles are needed.`,
      },
    ];
  },
};
</script>
