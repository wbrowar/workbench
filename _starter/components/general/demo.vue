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
        <div v-for="weight in font.demoWeights" :key="weight" v-if="font.demoWeights">
          <h3 style="margin: 20px 0;">{{ index }} {{ weight }}</h3>
          <FontSample :handle="index" :size="parseFloat(fontSampleSize)" :text="fontSampleText" :weight="weight" />
        </div>
        <div v-else>
          <h3 style="margin: 20px 0;">{{ index }}</h3>
          <FontSample :handle="index" :size="parseFloat(fontSampleSize)" :text="fontSampleText" />
        </div>
      </div>
      <div style="display: grid; grid-template-columns: auto 80px; grid-gap: 30px; margin-top: 60px;">
        <div>
          <label for="font_sample_text_input" style="display: block; margin-bottom: 3px">Sample Text</label>
          <input id="font_sample_text_input" class="dev__components__input" type="text" v-model="fontSampleText" />
        </div>
        <div>
          <label for="font_sample_size_input" style="display: block; margin-bottom: 3px">Size (rem)</label>
          <input
            id="font_sample_size_input"
            class="dev__components__input"
            type="number"
            step="0.01"
            v-model="fontSampleSize"
          />
        </div>
      </div>
    </CodeExample>

    <CodeExample title="Opacity" description="Opacity used in Tailwind config" copy-text='opacity-50'>
      <div class="flex">
        <div class="flex flex-col justify-center w-20 h-20 text-center" :class="[`bg-black-${index}`]" style="-webkit-text-stroke: 1px hsla(var(--color-white-hsl), 0.3)" v-for="(item, index) in globalData.wb.opacity">
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
      fontSampleSize: false,
      fontSampleText: false,
      tailwindSample: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.fontSampleSize = `2`;
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
};
</script>
