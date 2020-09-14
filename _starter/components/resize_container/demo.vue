<template>
  <div>
    <h1 class="dev__components__demo__header">Resize Container</h1>
    <p>React to changes in width and height of a wrapper element.</p>

    <ImportPath path="import ResizeContainer from 'Components/resize_container/ResizeContainer.vue';" />

    <CodeExample
      :code="code.breakpoint"
      title="Breakpoint Events"
      description="Respond to a change event based on width or height breakpoints."
    >
      <ResizeContainer
        class="flex items-center justify-center h-20 text-dev-white"
        :class="classes"
        :widths="[400, 600]"
        @changed-width="updateWidthClasses"
      >
        <p>Resize Me</p>
      </ResizeContainer>
    </CodeExample>

    <CodeExample
      :code="code.replacements"
      title="Attribute Replacements"
      description="Update attributes (using v-bind) when a width or height breakpoint is matched. A width or height must be passed in to allow for a match. If both width and height are passed, both need to match their respective breakpoints."
    >
      <ResizeContainer
        class="flex items-center justify-center h-20"
        :replacements="[
          { width: 0, bind: { class: 'bg-dev-white', style: { border: '4px dotted red', color: 'red' } } },
          { width: 400, bind: { class: 'bg-dev-gray-400 text-dev-black' } },
          { width: 500, bind: { class: 'bg-dev-gray-500 text-dev-white' } },
          { width: 600, bind: { class: 'bg-dev-gray-600 text-dev-white' } },
        ]"
      >
        <p>Resize Me</p>
      </ResizeContainer>
    </CodeExample>

    <PropsTable :props="props" />

    <EventsTable :events="events" />
  </div>
</template>

<script>
import ResizeContainer from 'Components/resize_container/ResizeContainer.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import EventsTable from 'Starter/docs/vue/EventsTable.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    ResizeContainer,
    CodeExample,
    EventsTable,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      code: false,
      props: false,
      currentWidth: 0,
    };
  },
  props: {
    globalData: Object,
  },
  computed: {
    classes() {
      const classes = [];

      switch (this.currentWidth) {
        case 400:
          classes.push(`bg-dev-gray-700`);
          break;
        case 600:
          classes.push(`bg-dev-black`);
          break;
        default:
          classes.push(`bg-dev-gray-500`);
      }

      return classes;
    },
  },
  methods: {
    updateWidthClasses(newWidth) {
      this.currentWidth = newWidth;
    },
  },
  created() {
    this.code = {
      breakpoint: `<ResizeContainer
  class="flex items-center justify-center h-20 text-dev-white"
  :class="classes"
  :widths="[400, 600]"
  @changed-width="updateWidthClasses"
>
  <p>Resize Me</p>
</ResizeContainer>`,
      replacements: `<ResizeContainer
  class="flex items-center justify-center h-20"
  :replacements="[
    { width: 0, bind: { class: 'bg-dev-white text-dev-black' } },
    { width: 400, bind: { class: 'bg-dev-gray-400 text-dev-black' } },
    { width: 500, bind: { class: 'bg-dev-gray-500 text-dev-white' } },
    { width: 600, bind: { class: 'bg-dev-gray-600 text-dev-white' } },
  ]"
>
  <p>Resize Me</p>
</ResizeContainer>`,
    };
    this.events = [
      { name: 'changed-height', description: `Fires when the container changes to a new height breakpoint.` },
      { name: 'changed-width', description: `Fires when the container changes to a new width breakpoint.` },
    ];
    this.props = [
      {
        name: 'elementType',
        type: 'String',
        default: `'div'`,
        description: `Change the element of the wrapper element for semantic HTML or accessibility.`,
      },
      { name: 'heights', type: 'Array', description: `Height breakpoints.` },
      {
        name: 'replacements',
        type: 'Collection',
        description: `Collection of breakpoints and attributes that change when the breakpoint sizes match.`,
      },
      {
        name: 'replacements.bind',
        type: 'Object',
        description: `Attributes that will get bound to the wrapper element when all breakpoint sizes are matched.`,
      },
      {
        name: 'replacements.height',
        type: 'Number',
        description: `Height to match against the wrapper element height.`,
      },
      { name: 'replacements.width', type: 'Number', description: `Width to match against the wrapper element width.` },
      { name: 'widths', type: 'Array', description: `Width breakpoints.` },
    ];
  },
};
</script>
