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
          <ColorSwatch :name="name" :color="item" v-if="!name.startsWith('dev-')" v-for="(item, name) in scheme" :key="name" />
        </div>
      </div>
    </CodeExample>

    <CodeExample
      title="Fonts"
      description="Fonts configured in the `package.json` file. Change the sample text to preview different words and characters in each font."
      v-if="globalData.wb.fonts"
    >
      <div class="mb-4" v-for="(font, index) in globalData.wb.fonts" :key="index">
        <div class="flex items-center justify-between border-b" v-for="weight in font.demoWeights" :key="weight" v-if="font.demoWeights">
          <FontSample :handle="index" :size="fontSampleSize" :text="fontSampleText" :weight="weight" />
          <h3 class="cursor-pointer"><span class="mx-1" :title="`Click to copy 'text-${index}'`" @click="copyToClipboard(`text-${index}`)">{{ index }}</span><span class="mx-1" :title="`Click to copy 'font-${weight}'`" @click="copyToClipboard(`font-${weight}`)">{{ weight }}</span><span class="mx-1" :title="`Click to copy 'text-${fontSampleSize}'`" @click="copyToClipboard(`text-${fontSampleSize}`)">{{ fontSampleSize }}</span></h3>
        </div>
        <div class="flex justify-between border-b" v-else>
          <FontSample :handle="index" :size="fontSampleSize" :text="fontSampleText" />
          <h3 class="cursor-pointer"><span class="mx-1" :title="`Click to copy 'text-${index}'`" @click="copyToClipboard(`text-${index}`)">{{ index }}</span><span class="mx-1" :title="`Click to copy 'text-${fontSampleSize}'`" @click="copyToClipboard(`text-${fontSampleSize}`)">{{ fontSampleSize }}</span></h3>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: auto 80px; grid-gap: 30px; margin-top: 60px;">
        <div>
          <label for="font_sample_text_input" style="display: block; margin-bottom: 3px">Sample Text</label>
          <input id="font_sample_text_input" class="dev__components__input" type="text" v-model="fontSampleText" />
        </div>
        <div>
          <label for="font_sample_size_input" style="display: block; margin-bottom: 3px">Size</label>

          <select class="dev__components__input appearance-none" v-model="fontSampleSize">
            <option :value="item" v-for="item in Object.keys(twConfig.theme.fontSize)">{{ item }}</option>
          </select>
        </div>
      </div>
    </CodeExample>

    <CodeExample
      title="SVG Icons"
      description="Icons available within the design system."
      v-if="svgIcons"
    >
      <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div class="grid grid-cols-it gap-2 my-1 items-center" v-for="(icon, index) in svgIcons" :key="index">
          <div class="w-10 h-10" @click="copyToClipboard(`<IconSVG handle='${icon}' />`)">
            <IconSVG class="w-10 h-10" :handle="icon" />
          </div>
          <p class="text-xs">{{ icon }}</p>
        </div>
      </div>
    </CodeExample>

    <CodeExample title="Media Queries" description="Media queries used in Tailwind and vue-mq.">
      <div class="flex flex-wrap">
        <div class="flex flex-col justify-center flex-grow flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 text-3xl">📱</div>
        <div class="flex flex-col justify-center flex-grow flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 border-l border-solid border-black-40" v-for="(item, index) in twConfig.theme.screens" :key="index">
          <p class="font-semibold text-2xl">{{ item }}</p>
          <p class="font-semibold text-sm">{{ index }}</p>
        </div>
        <div class="flex flex-col justify-center flex-grow flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 border-l border-solid border-black-40 text-3xl">🖥</div>
      </div>
    </CodeExample>

    <CodeExample title="Spacing" description="Tailwind spacing units. Used for margins, padding, widths, heights, and gaps.">
      <div :style="{ columnCount: $mq === 'sm' ? 1 : 3 }">
        <div class="grid grid-cols-it gap-2 my-1 items-center" style="break-inside: avoid" v-for="(item, index) in twConfig.theme.spacing" :key="index">
          <div class="w-20 bg-black" :class="[`h-${index}`]"></div>
          <p class="font-semibold text-xs">{{ index }}<span style="margin-left: 1em; opacity: 0.4;">{{ item }}</span></p>
        </div>
      </div>
    </CodeExample>

    <CodeExample title="REM Converter" description="Convert pixels to REM, based on: 16px equals 1rem.">
      <div class="grid grid-cols-4 gap-4 items-center">
        <div class="flex items-center">
          <input id="rem_converter_from" class="dev__components__input" type="text" v-model.number="remConverterFrom" />
          <span class="ml-1">{{ remConverterConversion === 'pxToRem' ? 'px' : 'rem' }}</span>
        </div>
        <div>
          <select class="dev__components__input appearance-none" v-model="remConverterConversion">
            <option value="pxToRem">Pixels to REM</option>
            <option value="remToPx">REM to Pixels</option>
          </select>
        </div>
        <div class="col-span-2 text-4xl">= <span>{{ remConverterResults }}</span></div>
      </div>
    </CodeExample>

    <CodeExample title="Border Radius" description="Border radius settings.">
      <div class="md:flex md:space-x-4">
        <div class="flex items-center justify-center w-20 h-20 bg-black" :class="[item === 'default' ? 'rounded' : `rounded-${item}`]" v-for="item in Object.keys(twConfig.theme.borderRadius)" :key="item" :title="`Click to copy '${item === 'default' ? 'rounded' : `rounded-${item}`}'`" @click="copyToClipboard(item === 'default' ? 'rounded' : `rounded-${item}`)">
          <p class="text-xs text-white">{{ item }}</p>
        </div>
      </div>
    </CodeExample>

    <CodeExample title="Opacity" description="Opacity used in Tailwind config.">
      <div class="flex flex-wrap">
        <div class="flex flex-col justify-center flex-grow flex-shrink w-16 text-center" v-for="(item, index) in twConfig.theme.opacity" :key="index">
          <div class="h-16" :class="[`bg-black-${index}`]" :title="`Click to copy 'opacity-${index}'`" @click="copyToClipboard(`opacity-${index}`)"></div>
          <p class="mt-1 font-semibold text-2xl">{{ index }}</p>
          <p class="font-semibold text-xs" style="opacity: 0.4;">{{ item }}</p>
        </div>
      </div>
    </CodeExample>

    <CodeExample title="Transitions" description="Preview transition timing durations and timing functions.">
      <div class="grid grid-cols-ti gap-4">
        <select class="dev__components__input appearance-none" v-model="transitionTiming">
          <option value="__none__">Select Timing Function</option>
          <option :value="`ease-${item}`" v-for="item in Object.keys(twConfig.theme.transitionTimingFunction)">{{ `ease-${item}` }}</option>
        </select>

        <button class="dev__components__input appearance-none" @click="transitionExampleActive = !transitionExampleActive">Animate!</button>
      </div>

      <div class="md:flex md:space-x-4 mt-4">
        <div class="flex items-center justify-center w-16 h-16 bg-black rounded-lg transform transition-transform" :class="[`duration-${item}`, transitionTiming, { 'translate-y-full': transitionExampleActive }]" v-for="item in Object.keys(twConfig.theme.transitionDuration)" :key="item" :title="`Click to copy 'duration-${item}'`" @click="copyToClipboard(`duration-${item}`)">
          <p class="text-xs text-white">{{ item }}</p>
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
import { icons } from 'JS/automated/svg.js';
import resolveConfig from 'tailwindcss/resolveConfig';
import IconSVG from 'Components/icon_svg/IconSVG.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import ColorSwatch from 'Starter/docs/vue/ColorSwatch.vue';
import FontSample from 'Starter/docs/vue/FontSample.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';
import TailwindTester from 'Starter/docs/vue/TailwindTester.vue';

export default {
  components: {
    IconSVG,
    CodeExample,
    ColorSwatch,
    FontSample,
    PropsTable,
    TailwindTester,
  },
  data() {
    return {
      colorSwatches: {},
      fontSampleSize: false,
      fontSampleText: false,
      remConverterConversion: 'pxToRem', // pxToRem, remToPx
      remConverterFrom: 16,
      svgIcons: false,
      tailwindSample: false,
      transitionExampleActive: false,
      transitionTiming: '__none__',
      twConfig: {},
    };
  },
  props: {
    globalData: Object,
  },
  computed: {
    remConverterResults() {
      return this.remConverterConversion === 'pxToRem' ? `${(this.remConverterFrom / 16)}rem` : `${(this.remConverterFrom * 16)}px`;
    },
  },
  created() {
    this.twConfig = resolveConfig(this.globalData.tailwind);
    log('Tailwind Config', this.twConfig.theme);

    this.fontSampleSize = `base`;
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
          if (scheme[colorKey]['default']) {
            this.colorSwatches[schemeKey][`${colorKey}`] = scheme[colorKey]['default'];
          }
          Object.keys(scheme[colorKey]).forEach((shadeKey) => {
            if (shadeKey !== 'default') {
              this.colorSwatches[schemeKey][`${colorKey}-${shadeKey}`] = scheme[colorKey][shadeKey];
            }
          })
        }
      });
    });

    log('The Colors!', this.colorSwatches);

    this.svgIcons = Object.keys(icons);
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
