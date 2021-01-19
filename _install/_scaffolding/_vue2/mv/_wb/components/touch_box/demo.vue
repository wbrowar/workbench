<template>
  <div>
    <h1>Touch Box</h1>
    <p>
      A utility component used to fire events upon specific touch interactions. Built on top of the GSAP Draggable
      plugin.
    </p>

    <ImportPath path="import TouchBox from 'Components/touch_box/TouchBox.vue';" />

    <CodeExample
      :code="code.default"
      title="Horizontal Swipe"
      description="A Touch Box component that is configured to only accept left and right swipe gestures."
    >
      <TouchBox
        class="flex items-center justify-center w-64 h-64 bg-black"
        drag-type="x"
        @swipe-left="swipeVal = 'swiped left'"
        @swipe-right="swipeVal = 'swiped right'"
      >
        <p class="text-white">{{ swipeVal }}</p>
      </TouchBox>
    </CodeExample>

    <PropsTable :props="props" />

    <EventsTable :events="events" />
  </div>
</template>

<script>
import TouchBox from 'Components/touch_box/TouchBox.vue';
import CodeExample from 'WB/docs/vue/CodeExample.vue';
import EventsTable from 'WB/docs/vue/EventsTable.vue';
import ImportPath from 'WB/docs/vue/ImportPath.vue';
import PropsTable from 'WB/docs/vue/PropsTable.vue';

export default {
  components: {
    TouchBox,
    CodeExample,
    EventsTable,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      swipeVal: 'swipe left or right',
      code: false,
      events: false,
      props: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.code = {
      default: `<TouchBox
  class="flex items-center justify-center w-64 h-64 bg-black"
  drag-type="x"
  @swipe-left="swipeVal = 'swiped left'"
  @swipe-right="swipeVal = 'swiped right'"
>
  <p class="text-white">{{ swipeVal }}</p>
</TouchBox>`,
    };
    this.events = [
      { name: 'swipe-up', description: `Fires when a swipe up touch event is registered.` },
      { name: 'swipe-down', description: `Fires when a swipe down touch event is registered.` },
      { name: 'swipe-left', description: `Fires when a swipe left touch event is registered.` },
      { name: 'swipe-right', description: `Fires when a swipe right touch event is registered.` },
    ];
    this.props = [
      { name: 'dragType', type: 'String', default: `'x,y'`, description: `Sets the type argument for GSAP Draggable.` },
    ];
  },
};
</script>
