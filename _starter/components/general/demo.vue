<template>
  <div>
    <CodeExample
      title="Colors"
      description="Color schemes configured in the `package.json` file. The `light` scheme is shown by default. The `dark` theme appears when the browser is set to dark mode."
      v-if="globalData.pkg.colors"
    >
      <div v-for="(scheme, index) in globalData.pkg.colors" :key="index">
        <h3 style="margin: 20px 0;">{{ index }}</h3>
        <div
          class="root__color_grid"
          style="display: grid; grid-gap: 20px; grid-template-columns: repeat(auto-fit, 174px); grid-template-rows: auto;"
        >
          <ColorSwatch :name="name" :color="item" v-for="(item, name) in scheme" :key="name" />
        </div>
      </div>
    </CodeExample>

    <CodeExample title="Fonts" description="Fonts configured in the `package.json` file. Change the sample text to preview different words and characters in each font." v-if="globalData.pkg.fonts">
      <div v-for="(font, index) in globalData.pkg.fonts" :key="index">
        <h3 style="margin: 20px 0;">{{ index }}</h3>
        <FontSample :font="font" :size="parseFloat(fontSampleSize)" :text="fontSampleText" />
      </div>
      <div style="display: grid; grid-template-columns: auto 80px; grid-gap: 30px; margin-top: 60px;">
        <div>
          <label for="font_sample_text_input" style="display: block; margin-bottom: 3px">Sample Text</label>
          <input id="font_sample_text_input" type="text" v-model="fontSampleText" style="padding: 5px; width: 100%;" />
        </div>
        <div>
          <label for="font_sample_size_input" style="display: block; margin-bottom: 3px">Size (rem)</label>
          <input
            id="font_sample_size_input"
            type="number"
            step="0.01"
            v-model="fontSampleSize"
            style="padding: 5px; width: 100%;"
          />
        </div>
      </div>
    </CodeExample>
  </div>
</template>

<script>
import CodeExample from 'Starter/style_inventory/vue/CodeExample';
import ColorSwatch from 'Starter/style_inventory/vue/ColorSwatch';
import FontSample from 'Starter/style_inventory/vue/FontSample';
import PropsTable from 'Starter/style_inventory/vue/PropsTable';

export default {
  components: {
    CodeExample,
    ColorSwatch,
    FontSample,
    PropsTable,
  },
  data() {
    return {
      fontSampleSize: false,
      fontSampleText: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.fontSampleSize = `1`;
    this.fontSampleText = `The quick brown fox jumps over the lazy dog`;

    console.log(this.globalData.pkg);
  },
};
</script>
