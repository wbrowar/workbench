<template>
  <div>
    <h1 class="dev__components__demo__header">Text</h1>
    <p>Style basic text content elements, like `p`, `ol`, and `ul` tags by wrapping them in 'c-text'.</p>

    <CodeExample title="Text Styling">
      <div v-html="fontSampleText"></div>
    </CodeExample>

    <CodeExample title="Sample" description="Change the text above.">
      <div>
        <label for="font_sample_text_input" style="display: block; margin-bottom: 3px; font-size: 0.9rem;"
          >Sample Text</label
        >
        <textarea
          class="dev__components__input"
          name="font_sample_text_input"
          v-model="fontSampleText"
          rows="30"
        ></textarea>
      </div>
    </CodeExample>

    <!--    <CssModifiers root-class="c-text" :modifiers="modifiers" />-->
  </div>
</template>

<script>
import CodeExample from 'WB/docs/vue/CodeExample.vue';

export default {
  components: {
    CodeExample,
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
    this.fontSampleText = `<h1 class="c-header-1">Page Header</h1>
<div class="c-text">
    <p>Lorem ipsum dolor sit amet, <a href="/">consectetur adipiscing elit</a>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <p>Excepteur sint occaecat cupidatat non <b>proident</b>, sunt in culpa qui <i>officia deserunt</i> mollit <i><b>anim</b></i> id <b><i>est laborum</i></b>.</p>
    <ul>
        <li>List item I</li>
        <li>List item II</li>
        <li>List item III</li>
    </ul>
</div>
<h2 class="c-header-2">Section Subheader</h2>
<div class="c-text">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <ol>
        <li>List item I</li>
        <li>List item II</li>
        <li>List item III</li>
    </ol>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <p>Excepteur sint occaecat cupidatat non <strong>proident</strong>, sunt in culpa qui <em>officia deserunt</em> mollit <em><strong>anim</strong></em> id <strong><em>est laborum</em></strong>.</p>
</div>`;

    this.code = {
      default: this.fontSampleText,
    };

    this.modifiers = [
      { name: 'center', description: `Sets 'text-align: center'` },
      { name: 'hide', description: `Hides text from view but keeps it available for screen readers.` },
      { name: 'margin', description: `Adds margin above and below the text based on the value of $spacing_text.` },
      { name: 'margin--auto', description: `Sets 'margin-left: auto' and 'margin-right: auto'` },
      { name: 'margin--top' },
      { name: 'margin--right' },
      { name: 'margin--bottom' },
      { name: 'margin--left' },
      { name: 'padding', description: `Adds padding above and below the text based on the value of $spacing_text.` },
      { name: 'padding--top' },
      { name: 'padding--right' },
      { name: 'padding--bottom' },
      { name: 'padding--left' },
    ];

    if (this.globalData.wb.colors.light !== undefined) {
      const colorKeys = Object.keys(this.globalData.wb.colors.light);

      colorKeys.forEach((item) => {
        this.modifiers.push({ name: item, description: `Change text color to the value of $color_${item}` });
      });
    }
  },
};
</script>
