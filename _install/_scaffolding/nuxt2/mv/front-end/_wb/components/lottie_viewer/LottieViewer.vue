<template>
  <div class="relative overflow-hidden" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div
      ref="container"
      class="aspect"
      :class="[currentColor ? 'c-lottie-viewer-current' : null]"
      :style="{ '--aspect-ratio': aspectRatio }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api';
import { log } from 'JS/global';
import lottie, { AnimationItem, AnimationSegment } from 'lottie-web';
import merge from 'lodash/merge';

interface LottieAnimationSettings {
  initialSegment: AnimationSegment | null;
  mouseOverSegments: Record<string, Record<'in' | 'out', AnimationSegment[]>>;
  renderer: 'svg';
  rendererSettings: {
    clearCanvas: boolean;
    hideOnTransparent: boolean;
    progressiveLoad: boolean;
    scaleMode: 'centerCrop';
  };
}

export default defineComponent({
  name: 'LottieViewer',
  components: {},
  props: {
    autoplay: { type: Boolean, default: false },
    aspectRatio: { type: String, default: '16 / 9' },
    currentColor: { type: Boolean, default: true },
    loop: { type: Boolean, default: false },
    path: { type: String, required: true },
    speed: { type: Number, default: 1 },
    animationSettings: String,
  },
  setup(props) {
    const state = reactive({
      buildVersion: '',
      currentMouseOverSegment: '',
      lottieAnimation: null as AnimationItem | null,
      settings: {
        initialSegment: null,
        mouseOverSegments: {},
        renderer: 'svg',
        rendererSettings: {
          clearCanvas: true,
          hideOnTransparent: true,
          progressiveLoad: false,
          scaleMode: 'centerCrop',
        },
      } as LottieAnimationSettings,
    });

    let buildVersion = '';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 32; i > 0; --i) buildVersion += chars[Math.floor(Math.random() * chars.length)];
    state.buildVersion = buildVersion;

    if (props.animationSettings) {
      merge(state.settings, JSON.parse(props.animationSettings));
    }

    return { ...toRefs(state) };
  },
  methods: {
    init() {
      lottie.setSpeed(this.speed);

      if (this.autoplay) {
        this.play();
      }
    },
    loadAnimation() {
      const animationContainer = this.$refs.container as HTMLElement;

      if (animationContainer) {
        this.lottieAnimation = lottie.loadAnimation({
          autoplay: false,
          container: animationContainer,
          initialSegment: this.settings.initialSegment || undefined,
          loop: this.loop,
          name: 'default',
          path: this.path ? `${this.path}?v=${this.buildVersion}` : undefined,
          renderer: this.settings.renderer,
          rendererSettings: this.settings.rendererSettings,
        });

        log('Lottie loaded animation', JSON.stringify(this.settings));
      }
    },
    onMouseEnter() {
      let segmentKey = 'default';
      if (Object.keys(this.settings?.mouseOverSegments)?.length > 1) {
        segmentKey = Object.keys(this.settings.mouseOverSegments)[
          Math.floor(Math.random() * Object.keys(this.settings.mouseOverSegments).length)
        ];
      } else if (Object.keys(this.settings?.mouseOverSegments)?.[0]) {
        segmentKey = Object.keys(this.settings.mouseOverSegments)[0];
      }

      if (this.settings.mouseOverSegments?.[segmentKey]?.in) {
        this.currentMouseOverSegment = segmentKey;
        this.playSegments(this.settings.mouseOverSegments[this.currentMouseOverSegment].in, true);
      }
    },
    onMouseLeave() {
      if (this.currentMouseOverSegment !== '' && this.settings.mouseOverSegments?.[this.currentMouseOverSegment]?.out) {
        this.playSegments(this.settings.mouseOverSegments[this.currentMouseOverSegment].out, true);
        this.currentMouseOverSegment = '';
      }
    },
    play() {
      if (this.lottieAnimation) {
        log('Lottie playing animation');
        this.lottieAnimation.play();
      }
    },
    playSegments(segments: AnimationSegment[], forceFlag: boolean = false) {
      if (this.lottieAnimation) {
        log('Lottie playing segment', segments);
        this.lottieAnimation.playSegments(segments, forceFlag);
      }
    },
    stop() {
      if (this.lottieAnimation) {
        log('Lottie stopping animation');
        this.lottieAnimation.stop();
      }
    },
  },
  mounted() {
    log(`Loaded LottieViewer`);

    this.loadAnimation();
    this.init();
  },
});
</script>

<style>
.c-lottie-viewer svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.c-lottie-viewer-current svg *[fill='rgb(255,0,0)'] {
  fill: rgba(var(--color-iron), var(--tw-text-opacity));
}
.c-lottie-viewer-current svg *[fill='rgb(0,255,0)'] {
  fill: rgba(var(--color-sand), var(--tw-text-opacity));
}
.c-lottie-viewer-current svg *[fill='rgb(0,0,255)'] {
  fill: currentColor;
}
.c-lottie-viewer-current svg *[stroke='rgb(255,0,0)'] {
  stroke: rgba(var(--color-iron), var(--tw-text-opacity));
}
.c-lottie-viewer-current svg *[stroke='rgb(0,255,0)'] {
  stroke: rgba(var(--color-sand), var(--tw-text-opacity));
}
.c-lottie-viewer-current svg *[stroke='rgb(0,0,255)'] {
  stroke: currentColor;
}
</style>
