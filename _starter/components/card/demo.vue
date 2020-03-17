<template>
  <div>
    <h1>Title</h1>
    <p>Description</p>

    <ImportPath path="import Card from 'Components/card/Card.vue';" />

    <CodeExample :code="code.default" title="Required Title" description="Optional description.">
      <div class="grid grid-cols-2 gap-4">
        <Card class="bg-gray-300" :head-image="{ sources: [{ src: '/img/fpo.png' }] }">
          <div class="mb-4">
            <p>Here is some short content.</p>
          </div>
          <Button label-text="Button" />
        </Card>
        <Card class="bg-gray-300" :head-image="{ sources: [{ src: '/img/fpo.png' }] }">
          <template v-slot:head>
            <div class="flex items-center justify-center bg-gray-700 h-32">
              <p class="text-white">Head content</p>
            </div>
          </template>
          <div class="mb-4">
            <p>This content is longer so the height of the cards don’t match.</p>
          </div>
          <Button label-text="Button" />
        </Card>
      </div>
    </CodeExample>

    <PropsTable :props="props" />

<!--    <CssModifiers root-class="c_root_class" :modifiers="modifiers" />-->
  </div>
</template>

<script>
import Button from 'Components/button/Button.vue';
import Card from 'Components/card/Card.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
import EventsTable from 'Starter/docs/vue/EventsTable.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    Button,
    Card,
    CodeExample,
    CssModifiers,
    EventsTable,
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
      default: `<div class="grid grid-cols-2 gap-4">
  <Card class="bg-gray-300" :head-image="{ sources: [{ src: '/img/fpo.png' }] }">
    <div class="mb-4">
      <p>Here is some short content.</p>
    </div>
    <Button label-text="Button" />
  </Card>
  <Card class="bg-gray-300" :head-image="{ sources: [{ src: '/img/fpo.png' }] }">
    <template v-slot:head>
      <div class="flex items-center justify-center bg-gray-700 h-32">
        <p class="text-white">Head content</p>
      </div>
    </template>
    <div class="mb-4">
      <p>This content is longer so the height of the cards don’t match.</p>
    </div>
    <Button label-text="Button" />
  </Card>
</div>`,
    };
    this.events = [
        { name: 'onExample', arguments: 'example', description: `Example description.` },
    ];
    this.modifiers = [
        { name: 'example', description: `Example description.` },
    ];
    this.props = [
      { name: 'bodyClass', type: 'String', description: `Classes added to the card body.` },
      { name: 'headClass', type: 'String', description: `If a slot is not used, these classes are added around the card image.` },
      { name: 'headImage', type: 'Object', description: `Properties passed into a MediaImage component in the card head.` },
    ];
  }
};
</script>