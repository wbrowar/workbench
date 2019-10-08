<template>
  <div>
    <h1>Buttons</h1>
    <p>Link to internal or external URLs or create a button element to fire a Javascript function.</p>

    <ImportPath path="import Button from 'Components/button/Button';" />

    <CodeExample
      :code="code.href"
      title="CTA Buttons"
      description="Link to internal pages or link to external URLs. Links that start with '/' will be converted to 'g-link' elements to work with Gridsome projects."
    >
      <div class="c_buttons">
        <Button href="/about/" label-text="About (internal)" />
        <Button new-window href="http://google.com" label-text="Google (external)" />
      </div>
    </CodeExample>

    <CodeExample
      :code="code.action"
      title="Action Buttons"
      description="Fire a Javascript function by passing it through as a Vue method."
    >
      <div class="c_buttons c_buttons--center">
        <ClientOnly>
          <Button :action="clickThroughAction" label-text="Button Clicked!" />
          <Button
            :action="clickThroughAction"
            :action-args="['Different Message']"
            label-text="Message from argument"
          />
        </ClientOnly>
      </div>
    </CodeExample>

    <CodeExample
      :code="code.unstyled"
      title="Unstyled Buttons"
      description="Use the same props as regular buttons but add your own style. Passing a prop into a Button will automatically unstyle it, but styles can be added via CSS classes."
    >
      <div class="c_buttons c_buttons--right">
        <Button new-window unstyle href="http://google.com" label-text="Unstyled Button" />
        <Button new-window href="http://google.com">
          <Box demo />
        </Button>
        <Button class="c_button c_button--pointer" new-window unstyle href="http://google.com"
          ><span>🎨 Style by classes</span></Button
        >
      </div>
    </CodeExample>

    <PropsTable :props="props" />

    <CssModifiers root-class="c_button" :modifiers="modifiers" />
  </div>
</template>

<script>
import { log } from 'JS/global';
import Box from 'Components/box/Box';
import Button from 'Components/button/Button';
import CodeExample from 'Starter/style_inventory/vue/CodeExample';
import CssModifiers from 'Starter/style_inventory/vue/CssModifiers';
import ImportPath from 'Starter/style_inventory/vue/ImportPath';
import PropsTable from 'Starter/style_inventory/vue/PropsTable';

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
      href: `<div class="c_buttons">
  <Button href="/about/" label-text="About (internal)" />
  <Button new-window href="http://google.com" label-text="Google (external)" />
</div>`,
      action: `<div class="c_buttons c_buttons--center">
  <ClientOnly>
    <Button :action="clickThroughAction" label-text="Button Clicked!" />
    <Button :action="clickThroughAction" :action-args="['Different Message']" label-text="Message from argument" />
  </ClientOnly>
</div>`,
      unstyled: `<div class="c_buttons c_buttons--right">
  <Button new-window unstyle href="http://google.com" label-text="Unstyled Button" />
  <Button new-window href="http://google.com">
    <Box demo />
  </Button>
  <Button class="c_button c_button--pointer" new-window unstyle href="http://google.com"><span>🎨 Style by classes</span></Button>
</div>`,
    };

    this.modifiers = [{ name: 'pointer', description: `Turns the cursor to a pointer.` }];

    this.props = [
      { name: 'action', type: 'Function', description: `A Javascript function to fire, instead of visiting a URL.` },
      { name: 'actionArgs', type: 'Array', description: `An array of arguments to pass into the action function.` },
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
      { name: 'target', type: 'String', description: `Sets the 'target' attribute if 'newWindow' is not used.` },
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
