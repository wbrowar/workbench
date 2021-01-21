<template>
  <div>
    <h1>Carousel</h1>
    <p>Combine carousel and carousel controls to build a flexible slider.</p>

    <ImportPath path="import Carousel from 'Components/carousel/Carousel.vue';" />

    <CodeExample
      :code="code.default"
      title="Carousel"
      description="Combination of carousel components to create a basic image slider."
    >
      <Carousel ref="carousel" autoplay carousel-heading="Carousel Example" :height="400" transition-type="slide">
        <CarouselSlide class="flex items-center justify-center bg-black">
          <p class="text-6xl text-white">1</p>
        </CarouselSlide>
        <CarouselSlide>
          <MediaImage class="w-full h-full" background alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
        </CarouselSlide>
        <CarouselSlide class="flex items-center justify-center bg-black">
          <p class="text-6xl text-white">3</p>
        </CarouselSlide>

        <template slot="controls">
          <TouchBox
            class="absolute top-0 left-0 w-full h-full bg-black-30 z-10"
            drag-type="x"
            @swipe-left="onSwipeLeft"
            @swipe-right="onSwipeRight"
          />
          <CarouselControl class="absolute bottom-0 left-0 text-white z-50" prev>Prev</CarouselControl>
          <CarouselControl class="absolute bottom-0 right-0 text-white z-50" next>Next</CarouselControl>
        </template>
      </Carousel>
    </CodeExample>

    <PropsTable :props="props.default" />

    <EventsTable :events="events.default" />

    <h1>Carousel Slide</h1>
    <p>
      The CarouselSlide component does not take any props or fires any events. It contains all of the code that handles
      the transition effects that occur when the slide is moved ino and out of the current slide position.
    </p>

    <ImportPath path="import CarouselSlide from 'Components/carousel/CarouselSlide.vue';" />

    <CodeExample
      :code="code.controls"
      title="Controls"
      description="Controls can be placed within a carousel’s 'controls' slot, or placed outside of a Carousel component."
    >
      <div class="flex items-center justify-between">
        <CarouselControl prev :controls="[carouselRef]">Prev</CarouselControl>
        <div class="flex items-center justify-center space-x-3">
          <CarouselControl :go-to="0" :controls="[carouselRef]">1</CarouselControl>
          <CarouselControl :go-to="1" :controls="[carouselRef]">2</CarouselControl>
          <CarouselControl :go-to="2" :controls="[carouselRef]">3</CarouselControl>
        </div>
        <CarouselControl next :controls="[carouselRef]">Next</CarouselControl>
      </div>
    </CodeExample>

    <PropsTable :props="props.controls" />

    <EventsTable :events="events.controls" />
  </div>
</template>

<script>
import Carousel from 'Components/carousel/Carousel.vue';
import CarouselControl from 'Components/carousel/CarouselControl.vue';
import CarouselSlide from 'Components/carousel/CarouselSlide.vue';
import MediaImage from 'Components/image/MediaImage.vue';
import TouchBox from 'Components/touch_box/TouchBox.vue';
import CodeExample from 'WB/docs/vue/CodeExample.vue';
// import CssModifiers from 'WB/docs/vue/CssModifiers.vue';
import EventsTable from 'WB/docs/vue/EventsTable.vue';
import ImportPath from 'WB/docs/vue/ImportPath.vue';
import PropsTable from 'WB/docs/vue/PropsTable.vue';

export default {
  components: {
    Carousel,
    CarouselControl,
    CarouselSlide,
    MediaImage,
    TouchBox,
    CodeExample,
    // CssModifiers,
    EventsTable,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      carouselRef: false,
      code: false,
      props: false,
    };
  },
  props: {
    globalData: Object,
  },
  computed: {},
  methods: {
    onSwipeLeft() {
      this.$refs.carousel.goToNextSlide();
    },
    onSwipeRight() {
      this.$refs.carousel.goToPrevSlide();
    },
  },
  created() {
    this.code = {
      default: `<Carousel ref="carousel" autoplay carousel-heading="Carousel Example" :height="400" transition-type="slide">
  <CarouselSlide class="flex items-center justify-center bg-black">
    <p class="text-6xl text-white">1</p>
  </CarouselSlide>
  <CarouselSlide>
    <MediaImage class="w-full h-full" background alt="FPO image" :sources="[{ src: \`/img/FPO.png\` }]" />
  </CarouselSlide>
  <CarouselSlide class="flex items-center justify-center bg-black">
    <p class="text-6xl text-white">3</p>
  </CarouselSlide>

  <template slot="controls">
    <TouchBox
      class="absolute top-0 left-0 w-full h-full bg-black-30 z-10"
      drag-type="x"
      @swipe-left="onSwipeLeft"
      @swipe-right="onSwipeRight"
    />
    <CarouselControl class="absolute bottom-0 left-0 text-white z-50" prev>Prev</CarouselControl>
    <CarouselControl class="absolute bottom-0 right-0 text-white z-50" next>Next</CarouselControl>
  </template>
</Carousel>`,
      controls: `<div class="flex items-center justify-between">
  <CarouselControl prev :controls="[carouselRef]">Prev</CarouselControl>
  <div class="flex items-center justify-center space-x-3">
    <CarouselControl :go-to="0" :controls="[carouselRef]">1</CarouselControl>
    <CarouselControl :go-to="1" :controls="[carouselRef]">2</CarouselControl>
    <CarouselControl :go-to="2" :controls="[carouselRef]">3</CarouselControl>
  </div>
  <CarouselControl next :controls="[carouselRef]">Next</CarouselControl>
</div>`,
    };
    this.events = {
      default: [
        {
          name: 'current-slide-updated',
          arguments: 'Number (index number)',
          description: `Fires when slide index has been updated.`,
        },
      ],
      controls: [
        {
          name: 'on-go-to',
          arguments: 'Number (index number)',
          description: `Fires when carousel is sent to a specific slide index.`,
        },
        { name: 'on-go-to-next', description: `Fires when carousel is sent to the next slide.` },
        { name: 'on-go-to-prev', description: `Fires when carousel is sent to the previous slide.` },
      ],
    };
    this.props = {
      default: [
        {
          name: 'autoplay',
          type: 'Boolean',
          default: `false`,
          description: `Allows the carousel to automatically move to the next slide.`,
        },
        {
          name: 'carouselHeading',
          type: 'String',
          default: `''`,
          description: `The heading of the carousel read to screen readers.`,
        },
        {
          name: 'debounceDuration',
          type: 'Number',
          default: `500`,
          description: `Sets the amount of time required to pass between accepting commands.`,
        },
        { name: 'height', type: 'Number', description: `The height of the slider in pixel units.` },
        {
          name: 'indicatorClass',
          type: 'String',
          default: `'p-2 bg-white cursor-pointer'`,
          description: `Classes used to style individual indicator nodes.`,
        },
        {
          name: 'indicatorNumbers',
          type: 'Boolean',
          default: `false`,
          description: `Determines if indicator numbers should be visually displayed.`,
        },
        {
          name: 'indicatorWrapperClass',
          type: 'String',
          default: `'flex items-center justify-center mx-auto absolute bottom-0 inset-x-0 space-x-3 mb-2 z-30'`,
          description: `Classes used to position the indicator nodes within the carousel. Set this to 'sr-only' if you would like to hide the indicators.`,
        },
        {
          name: 'interval',
          type: 'Number',
          default: `5000`,
          description: `The time between advancing to the next slide when autoplay has been turned on.`,
        },
        {
          name: 'transitionType',
          type: 'String',
          default: `'fade'`,
          description: `The name of the transition that will be passed into child CarouselSlide components.`,
        },
      ],
      controls: [
        {
          name: 'controls',
          type: 'String',
          description: `An array of Carousel components this control will affect when the control is located outside of a Carousel component.`,
        },
        {
          name: 'goTo',
          type: 'String',
          description: `The index of the slide that the carousel will go to up click. NOTE: indexes are 0-based.`,
        },
        { name: 'next', type: 'String', default: `false`, description: `Advances the carousel to the next slide.` },
        {
          name: 'prev',
          type: 'String',
          default: `false`,
          description: `Move the carousel back to the previous slide.`,
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.carouselRef = this.$refs.carousel;
    });
  },
};
</script>
