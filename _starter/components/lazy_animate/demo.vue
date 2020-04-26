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
        observer-classes="transition duration-700"
      >
        <p class="font-bold text-gray-800 text-5xl">Text that animates!</p>
      </LazyAnimate>
    </CodeExample>

    <CodeExample
      title="CSS Transition Animation"
      description="Use CSS Transitions to move from the `css-start` state to the `css-end` state upon entering the viewport."
      :code="code.css1"
    >
      <!-- ClientOnly -->
      <LazyAnimate
        :css-start="{ opacity: 0, transform: `translateY(100px)` }"
        :css-end="{ opacity: 1 }"
        css-transition="opacity .4s ease-out, transform .4s ease-out"
      >
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png`, width: 758, height: 758 }]" />
      </LazyAnimate>
      <!-- /ClientOnly -->
    </CodeExample>

    <CodeExample
      title="GSAP Animation"
      description="Use Greensock for more complicated animations. NOTE: this will lazy load Greensock when it is in use."
      :code="code.js1"
    >
      <!-- ClientOnly -->
      <LazyAnimate style="opacity: 0;" type="slide-in" :options="{ y: 100 }">
        <MediaImage alt="FPO image" :sources="[{ src: `/img/FPO.png`, width: 758, height: 758 }]" />
      </LazyAnimate>
      <!-- /ClientOnly -->
    </CodeExample>

    <CodeExample
      title="GSAP Animate CSS Custom Property"
      description="Use Greensock to animate a CSS Custom Property."
      :code="code.js2"
    >
      <!-- ClientOnly -->
      <LazyAnimate
        type="custom"
        :options="{
          properties: {
            '--demo-background-color': 160,
            startAt: {
              '--demo-background-color': 0,
            },
          },
          speed: 2,
        }"
      >
        <div
          style="width: 100%; height: 400px; background-color: hsl(var(--demo-background-color, 0), 80%, 80%);"
        ></div>
      </LazyAnimate>
      <!-- /ClientOnly -->
    </CodeExample>

    <PropsTable :props="props" />
  </div>
</template>

<script>
import LazyAnimate from 'Components/lazy_animate/LazyAnimate.vue';
import MediaImage from 'Components/image/MediaImage.vue';
import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    LazyAnimate,
    MediaImage,
    CodeExample,
    CssModifiers,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      code: false,
      props: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.code = {
      tailwind: `<!-- ClientOnly -->
  <LazyAnimate
    class="transform translate-y-5 animated:translate-y-0 opacity-0 animated:opacity-100"
    observer-classes="transition duration-700"
  >
    <p class="font-bold text-5xl">Text that animates!</p>
  </LazyAnimate>
<!-- /ClientOnly -->`,
      css1: `<!-- ClientOnly -->
  <LazyAnimate
    :css-start="{ opacity: 0, transform: \`translateY(100px)\` }"
    :css-end="{ opacity: 1 }"
    css-transition="opacity .4s ease-out, transform .4s ease-out"
  >
    <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\`, width: 758, height: 758 }]" />
  </LazyAnimate>
<!-- /ClientOnly -->`,
      js1: `<!-- ClientOnly -->
  <LazyAnimate
    style="opacity: 0;"
    type="slide-in"
    :options="{ y: 100 }"
  >
    <MediaImage alt="FPO image" :sources="[{ src: \`/img/FPO.png\`, width: 758, height: 758 }]" />
  </LazyAnimate>
<!-- /ClientOnly -->`,
      js2: `<!-- ClientOnly -->
  <LazyAnimate
    type="custom"
    :options="{ properties: {
      '--demo-background-color': 160,
      startAt: {
        '--demo-background-color': 0
      }
    }, speed: 2 }"
  >
    <div style="width: 100%; height: 400px; background-color: hsl(var(--demo-background-color, 0), 80%, 80%);"></div>
  </LazyAnimate>
<!-- /ClientOnly -->`,
    };

    this.props = [
      { name: 'box', type: 'Object', description: `Props to pass into the containing Box component.` },
      {
        name: 'cssAnimation',
        type: 'String',
        description: `(CSS) Use a CSS animation instead of a CSS transition for CSS animations.`,
      },
      { name: 'cssEnd', type: 'Object', description: `(CSS) The end state of a CSS transition.` },
      {
        name: 'cssStart',
        type: 'Object',
        description: `(CSS) The starting state for an element before a transition has begun.`,
      },
      {
        name: 'cssTransition',
        type: 'String',
        description: `(CSS) The CSS transitions used in CSS animations. This can be omitted if a transition is already set in CSS.`,
      },
      {
        name: 'elementType',
        type: 'String',
        default: `'div'`,
        description: `Change the element of the wrapper element for semantic HTML or accessibility.`,
      },
      {
        name: 'observerClasses',
        type: 'String',
        description: `Classes that are set only when intersection observer is active.`,
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
        name: 'options',
        type: 'Object',
        description: `(JS) Options to pass in to 'animation.js' that are used to configure Greensock’s animation.`,
      },
      {
        name: 'reset',
        type: 'Boolean',
        default: `false`,
        description: `(JS) Determine if the animation should be fired every time the element enters the viewport.`,
      },
      {
        name: 'type',
        type: 'String',
        default: `css`,
        description: `Select an animation from 'animation.js' or enter 'css' to create a CSS animation.`,
      },
    ];
  },
};
</script>
