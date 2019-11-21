<template>
  <div>
    <h1>Headers</h1>
    <p>
      Style page and section headers. The numbers used for each header can be treated like an ID and does not have to be
      related to size or hierarchy. The style is not affected by the HTML tag used for the header element. That
      means—for example—an H2 can be styled as `c_header--1`.
    </p>

    <CodeExample title="Header 1" :code="code.h1">
      <div class="c_header c_header--1">{{ fontSampleText }}</div>
    </CodeExample>

    <CodeExample title="Header 2" :code="code.h2">
      <div class="c_header c_header--2">{{ fontSampleText }}</div>
    </CodeExample>

    <CodeExample title="Header 3" :code="code.h3">
      <div class="c_header c_header--3">{{ fontSampleText }}</div>
    </CodeExample>

    <CodeExample title="Sample" description="Change the header text above.">
      <div>
        <label for="font_sample_text_input" style="display: block; margin-bottom: 3px">Sample Text</label>
        <input id="font_sample_text_input" type="text" v-model="fontSampleText" style="padding: 5px; width: 100%;" />
      </div>
    </CodeExample>
  </div>
</template>

<script>
import CodeExample from 'Starter/style_inventory/vue/CodeExample.vue';
import CssModifiers from 'Starter/style_inventory/vue/CssModifiers.vue';
import ColorSwatch from 'Starter/style_inventory/vue/ColorSwatch.vue';
import FontSample from 'Starter/style_inventory/vue/FontSample.vue';
import PropsTable from 'Starter/style_inventory/vue/PropsTable.vue';

export default {
  components: {
    CodeExample,
    ColorSwatch,
    CssModifiers,
    FontSample,
    PropsTable,
  },
  data() {
    return {
      code: false,
      modifiers: false,
      props: false,
      fontSampleText: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.fontSampleText = `The quick brown fox jumps over the lazy dog`;

    this.code = {
      h1: `<h1 class="c_header c_header--1">${this.fontSampleText}</h1>`,
      h2: `<h2 class="c_header c_header--2">${this.fontSampleText}</h2>`,
      h3: `<h3 class="c_header c_header--3">${this.fontSampleText}</h3>`,
    };
  },
};
</script>
