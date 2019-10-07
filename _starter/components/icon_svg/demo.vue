<template>
  <div>
    <h1>Icons (SVG)</h1>
    <p>Create SVG elements from the files in the `_source/_icon/` folder.</p>

    <ImportPath path="import IconSVG from 'Components/icon_svg/IconSVG.vue';" />

    <CodeExample :code="code.default" title="SVG element" description="An <svg> element.">
      <div style="width: 40px;">
        <IconSVG handle="plus" />
      </div>
    </CodeExample>

    <CodeExample
      dark
      :code="code.changeColors"
      title="Color Replacements"
      description="Change colors of <svg> elements. NOTE: This does not work with background or image SVG icons."
    >
      <div style="width: 40px;">
        <IconSVG handle="plus" color="rgb(255, 0, 255)" />
        <IconSVG handle="plus" color-var="white" />
        <IconSVG handle="plus" :replacements="{ '<polygon': `<polygon fill='yellow'` }" />
      </div>
    </CodeExample>

    <CodeExample :code="code.image" title="Background SVG" description="Sets the SVG to a CSS background url.">
      <div style="width: 40px;">
        <IconSVG handle="close" background style="width: 40px; height: 40px;" />
      </div>
    </CodeExample>

    <CodeExample
      :code="code.background"
      title="Content Image"
      description="Creates and image with the SVG set to its src attribute."
    >
      <div style="width: 40px;">
        <IconSVG handle="minus" image />
      </div>
    </CodeExample>

    <PropsTable :props="props" />
  </div>
</template>

<script>
import IconSVG from 'Components/icon_svg/IconSVG.vue';
import CodeExample from 'Starter/style_inventory/vue/CodeExample';
import ImportPath from 'Starter/style_inventory/vue/ImportPath';
import PropsTable from 'Starter/style_inventory/vue/PropsTable';

export default {
  components: {
    IconSVG,
    CodeExample,
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
      default: `<IconSVG handle="plus" />`,
      changeColors: `<IconSVG handle="plus" color="rgb(255, 0, 255)" />
<IconSVG handle="plus" color-var="white" />
<IconSVG handle="plus" :replacements="{ '<polygon': \`<polygon fill='yellow'\` }" />`,
      image: `<IconSVG handle="close" background />`,
      background: `<IconSVG handle="minus" image />`,
    };
    this.props = [
      { name: 'background', type: 'Boolean', description: `Turns the SVG into a background url style element.` },
      { name: 'color', type: 'String', description: `Style <svg> elements with a CSS color.` },
      {
        name: 'colorVar',
        type: 'String',
        description: `Style <svg> elements with a color variable as defined in 'package.json'.`,
      },
      {
        name: 'handle',
        type: 'String',
        description: `The name of the svg based on its original filename. For example, an SVG at '_source/_icon/plus.svg' would have the handle 'plus'`,
      },
      { name: 'image', type: 'Boolean', description: `Sets the SVG as a src attribute in an <img> element.` },
      {
        name: 'replacements',
        type: 'Object',
        description: `Perform string replacements on using key/value paring. This can be used to set fill colors, replace titles, or remove elements from the SVG code.`,
      },
    ];
  },
};
</script>
