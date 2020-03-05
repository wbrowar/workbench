<template>
  <div>
    <h1 class="dev__components__demo__header">Icons (SVG)</h1>
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
        <IconSVG class="text-gray-400" handle="plus" />
        <IconSVG class="text-white md:text-gray-600" handle="plus" />
        <IconSVG class="text-gray-800 hover:text-gray-300" handle="plus" />
      </div>
    </CodeExample>

    <CodeExample :code="code.image" title="Background SVG" description="Sets the SVG to a CSS background url.">
      <div style="width: 40px;">
        <IconSVG class="text-teal-400" handle="close" background style="width: 40px; height: 40px;" />
      </div>
    </CodeExample>

    <CodeExample
      :code="code.background"
      title="Content Image"
      description="Creates and image with the SVG set to its src attribute."
    >
      <div style="width: 40px;">
        <IconSVG class="text-teal-400" handle="minus" image />
      </div>
    </CodeExample>

    <PropsTable :props="props" />
  </div>
</template>

<script>
import IconSVG from 'Components/icon_svg/IconSVG.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

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
      changeColors: `<IconSVG class="text-gray-400" handle="plus" />
<IconSVG class="text-white md:text-gray-600" handle="plus" />
<IconSVG class="text-gray-800 hover:text-gray-300" handle="plus" />`,
      image: `<IconSVG handle="close" background />`,
      background: `<IconSVG handle="minus" image />`,
    };
    this.props = [
      { name: 'background', type: 'Boolean', description: `Turns the SVG into a background url style element.` },
      { name: 'backgroundSize', type: 'String', description: `Override the background size to make it easier to resize icons.` },
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
