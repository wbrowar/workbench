<template>
  <div>
    <h1 class="dev__components__demo__header">Lazy Animation</h1>
    <p>Animate elements upon entering the viewport.</p>
    <p>
      <em>NOTE: this component relies on Javascript so it must be wrapped in `ClientOnly` on Gridsome projects.</em>
    </p>

    <ImportPath path="import LazyAnimate from 'Components/lazy_animate/LazyAnimate.vue';" />

    <CodeExample
      title="Tailwind Transition Animation"
      description="Combine Tailwind classes to transition upon entering the viewport. Classes set in `observer-classes` are ignored if element is in viewport before mounting."
      :code="code.tailwind"
    >
      <LazyAnimate
        class="transform translate-y-5 animated:translate-y-0 opacity-0 animated:opacity-100"
        :observer-bind="{ class: 'transition duration-700' }"
      >
        <p class="font-bold text-gray-800 text-5xl">Text that animates!</p>
      </LazyAnimate>
    </CodeExample>

    <CodeExample
      title="CSS Transition Animation"
      description="Use CSS Transitions to move from the `css-start` state to the `css-end` state upon entering the viewport."
      :code="code.css1"
    >
      <LazyAnimate
        :before-animate="{ style: { opacity: 0, transform: `translateY(100px)` } }"
        :after-animate="{ style: { opacity: 1 } }"
        :observer-bind="{ class: 'transition duration-700' }"
      >
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png`, width: 758, height: 758 }]" />
      </LazyAnimate>
    </CodeExample>

    <CodeExample
      title="GSAP Animation"
      description="Use Greensock for more complicated animations. NOTE: this will lazy load Greensock when it is in use."
      :code="code.js1"
    >
      <LazyAnimate :animation="{ type: 'slide-in', options: { y: 100 } }" :before-animate="{ style: { opacity: 0 } }">
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png`, width: 758, height: 758 }]" />
      </LazyAnimate>
    </CodeExample>

    <CodeExample
      title="GSAP Animate CSS Custom Property"
      description="Use Greensock to animate a CSS Custom Property."
      :code="code.js2"
    >
      <LazyAnimate
        :animation="{
          type: 'custom',
          options: {
            properties: {
              '--demo-background-color': 160,
              startAt: {
                '--demo-background-color': 0,
              },
            },
            speed: 2,
          },
        }"
        :before-animate="{ style: { opacity: 0 } }"
        reset
      >
        <div
          style="width: 100%; height: 400px; background-color: hsl(var(--demo-background-color, 0), 80%, 80%);"
        ></div>
      </LazyAnimate>
    </CodeExample>

    <PropsTable :props="props" />

    <EventsTable :events="events" />
  </div>
</template>

<script>
import LazyAnimate from 'Components/lazy_animate/LazyAnimate.vue';
import MediaImage from 'Components/image/MediaImage.vue';
import CodeExample from 'WB/docs/vue/CodeExample.vue';
import EventsTable from 'WB/docs/vue/EventsTable.vue';
import ImportPath from 'WB/docs/vue/ImportPath.vue';
import PropsTable from 'WB/docs/vue/PropsTable.vue';

export default {
  components: {
    LazyAnimate,
    MediaImage,
    CodeExample,
    EventsTable,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
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
      tailwind: `<LazyAnimate
  class="transform translate-y-5 animated:translate-y-0 opacity-0 animated:opacity-100"
  observer-classes="transition duration-700"
>
  <p class="font-bold text-gray-800 text-5xl">Text that animates!</p>
</LazyAnimate>`,
      css1: `<LazyAnimate
  class="transition duration-700"
  :before-animate="{ style: { opacity: 0, transform: \`translateY(100px)\` } }"
  :after-animate="{ style: { opacity: 1 } }"
>
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\`, width: 758, height: 758 }]" />
</LazyAnimate>`,
      js1: `<LazyAnimate :animation="{ type: 'slide-in', options: { y: 100 } }" :before-animate="{ style: { opacity: 0 } }">
  <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\`, width: 758, height: 758 }]" />
</LazyAnimate>`,
      js2: `<LazyAnimate
  :animation="{
    type: 'custom',
    options: {
      properties: {
        '--demo-background-color': 160,
        startAt: {
          '--demo-background-color': 0,
        },
      },
      speed: 2,
    },
  }"
  :before-animate="{ style: { opacity: 0 } }"
  reset
>
  <div
    style="width: 100%; height: 400px; background-color: hsl(var(--demo-background-color, 0), 80%, 80%);"
  ></div>
</LazyAnimate>`,
    };

    this.events = [
      { name: 'animated', description: `Fires every time the animation function is fired.` },
      { name: 'intersected', description: `Fires when the wrapper element intersection fires.` },
    ];
    this.props = [
      {
        name: 'afterAnimate',
        type: 'Object',
        description: `Attributes bound to the wrapper element after the animation has fired.`,
      },
      {
        name: 'animation',
        type: 'Object',
        description: `Properties passed into 'animation.js'.`,
      },
      {
        name: 'animation.options',
        type: 'Object',
        description: `Options to pass in to 'animation.js' that are used to configure Greensock’s animation.`,
      },
      {
        name: 'animation.type',
        type: 'String',
        description: `Select an animation from 'animation.ts' or enter 'css' to create a CSS animation.`,
      },
      {
        name: 'beforeAnimate',
        type: 'Object',
        description: `Attributes bound to the wrapper element before the animation has fired.`,
      },
      {
        name: 'elementType',
        type: 'String',
        default: `'div'`,
        description: `Change the element of the wrapper element for semantic HTML or accessibility.`,
      },
      {
        name: 'observerAttributes',
        type: 'Object',
        description: `Attributes that are bound into the wrapper element while the observer is active.`,
      },
      {
        name: 'observerMargin',
        type: 'String',
        default: `'-100px'`,
        description: `If set, a custom Intersection Observer will be created with this as the 'rootMargin' value.`,
      },
      {
        name: 'observerThreshold',
        type: 'Number',
        default: `0`,
        description: `If set, a custom Intersection Observer will be created with this as the 'threshold' value.`,
      },
      {
        name: 'reset',
        type: 'Boolean',
        default: `false`,
        description: `Determine if the animation should be fired every time the element enters the viewport.`,
      },
    ];
  },
};
</script>
