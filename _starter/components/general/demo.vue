<template>
  <div>
    <CodeExample
      title="Colors"
      description="Color schemes configured in the `package.json` file. The `default` scheme is shown by default. The `dark` theme appears when the browser is set to dark mode."
      v-if="globalData.wb.colors"
    >
      <div v-for="(scheme, index) in colorSwatches" :key="index">
        <h3 style="margin: 20px 0;">{{ index }}</h3>
        <div
          class="root__color_grid"
          style="display: grid; grid-gap: 20px; grid-template-columns: repeat(auto-fit, 174px); grid-template-rows: auto;"
        >
          <ColorSwatch :name="name" :color="item" v-for="(item, name) in scheme" :key="name" />
        </div>
      </div>
    </CodeExample>

    <CodeExample
      title="Fonts"
      description="Fonts configured in the `package.json` file. Change the sample text to preview different words and characters in each font."
      v-if="globalData.wb.fonts"
    >
      <div v-for="(font, index) in globalData.wb.fonts" :key="index">
        <div class="flex items-center justify-between" v-for="weight in font.demoWeights" :key="weight" v-if="font.demoWeights">
          <FontSample :handle="index" :size="fontSampleSize" :text="fontSampleText" :weight="weight" />
          <h3 class="my-3 cursor-pointer"><span class="mx-1" :title="`Click to copy 'text-${index}'`" @click="copyToClipboard(`text-${index}`)">{{ index }}</span><span class="mx-1" :title="`Click to copy 'font-${weight}'`" @click="copyToClipboard(`font-${weight}`)">{{ weight }}</span><span class="mx-1" :title="`Click to copy 'text-${fontSampleSize}'`" @click="copyToClipboard(`text-${fontSampleSize}`)">{{ fontSampleSize }}</span></h3>
        </div>
        <div class="flex justify-between" v-else>
          <FontSample :handle="index" :size="fontSampleSize" :text="fontSampleText" />
          <h3 class="my-3 cursor-pointer"><span class="mx-1" :title="`Click to copy 'text-${index}'`" @click="copyToClipboard(`text-${index}`)">{{ index }}</span><span class="mx-1" :title="`Click to copy 'text-${fontSampleSize}'`" @click="copyToClipboard(`text-${fontSampleSize}`)">{{ fontSampleSize }}</span></h3>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: auto 80px; grid-gap: 30px; margin-top: 60px;">
        <div>
          <label for="font_sample_text_input" style="display: block; margin-bottom: 3px">Sample Text</label>
          <input id="font_sample_text_input" class="dev__components__input" type="text" v-model="fontSampleText" />
        </div>
        <div>
          <label for="font_sample_size_input" style="display: block; margin-bottom: 3px">Size (rem)</label>

          <select class="dev__components__input appearance-none" v-model="fontSampleSize">
            <option :value="item" v-for="item in Object.keys(twConfig.theme.fontSize)">{{ item }}</option>
          </select>
        </div>
      </div>
    </CodeExample>

    <CodeExample title="Media Queries" description="Media queries used in Tailwind and vue-mq.">
      <div class="flex">
        <div class="flex flex-col justify-center flex-grow flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 text-3xl">📱</div>
        <div class="flex flex-col justify-center flex-grow flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 border-l border-solid border-black-40" v-for="(item, index) in twConfig.theme.screens" :key="index">
          <p class="font-semibold text-2xl">{{ item }}</p>
          <p class="font-semibold text-sm">{{ index }}</p>
        </div>
        <div class="flex flex-col justify-center flex-grow flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 border-l border-solid border-black-40 text-3xl">🖥</div>
      </div>
    </CodeExample>

    <CodeExample title="Spacing" description="Tailwind spacing units. Used for margins, padding, and gaps.">
      <div class="flex flex-wrap bg-black-50">
        <div class="flex flex-col justify-center w-20 h-20 bg-white even:bg-black text-black even:text-white text-center" style="-webkit-text-stroke: 1px hsla(var(--color-white-hsl), 0.3)" :style="{ width: item }" v-for="(item, index) in twConfig.theme.spacing" :key="index">
          <p class="font-semibold text-2xl">{{ index }}</p>
          <p class="font-semibold text-xs">{{ item }}</p>
        </div>
      </div>
    </CodeExample>

    <CodeExample title="Opacity" description="Opacity used in Tailwind config." copy-text='opacity-50'>
      <div class="flex">
        <div class="flex flex-col justify-center flex-grow flex-shrink w-20 h-20 text-center" :class="[`bg-black-${index}`]" style="-webkit-text-stroke: 1px hsla(var(--color-white-hsl), 0.3)" v-for="(item, index) in twConfig.theme.opacity" :key="index">
          <p class="font-semibold text-2xl">{{ item }}</p>
          <p class="font-semibold text-xs">{{ index }}</p>
        </div>
      </div>
    </CodeExample>

    <CodeExample title="Tailwind Explorer" description="Test Tailwind classes and see the results.">
      <TailwindTester />
    </CodeExample>
  </div>
</template>

<script>
import { log } from 'JS/global.js';
import resolveConfig from 'tailwindcss/resolveConfig';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import ColorSwatch from 'Starter/docs/vue/ColorSwatch.vue';
import FontSample from 'Starter/docs/vue/FontSample.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';
import TailwindTester from 'Starter/docs/vue/TailwindTester.vue';

export default {
  components: {
    CodeExample,
    ColorSwatch,
    FontSample,
    PropsTable,
    TailwindTester,
  },
  data() {
    return {
      colorSwatches: {},
      twConfig: {},
      fontSampleSize: false,
      fontSampleText: false,
      tailwindSample: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.twConfig = resolveConfig(this.globalData.tailwind);
    log(this.twConfig.theme);

    this.fontSampleSize = `2xl`;
    this.fontSampleText = `The quick brown fox jumps over the lazy dog`;

    Object.keys(this.globalData.wb.colors).forEach((schemeKey) => {
      let scheme = this.globalData.wb.colors[schemeKey];

      if (!this.colorSwatches[schemeKey]) {
        this.colorSwatches[schemeKey] = {};
      }
      Object.keys(scheme).forEach((colorKey) => {
        if (typeof scheme[colorKey] === 'string') {
          this.colorSwatches[schemeKey][colorKey] = scheme[colorKey];
        } else {
          Object.keys(scheme[colorKey]).forEach((shadeKey) => {
            this.colorSwatches[schemeKey][`${colorKey}-${shadeKey}`] = scheme[colorKey][shadeKey];
          })
        }
      });
    });
  },
  methods: {
    copyToClipboard: function (text) {
      navigator.clipboard.writeText(text).then(function() {
        log(`Copied to clipboard: ${ text }`);
      }, function() {
        log(`Could not copy ${ text } to clipboard`);
      });
    },
  },
};
</script>
