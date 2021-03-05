<template>
  <div>
    <h1>Accessibility Tools</h1>
    <p>Test design system for accessibility issues.</p>

    <CodeExample
      title="Color checker"
      description="Select a background color and a foreground color to see example text for all font sizes and weights. Use Inspector to see if contrast issues occur at specific sizes."
    >
      <div class="grid grid-cols-2 gap-5">
        <div>
          <label for="color_checker_background">Background Color</label>
          <select
            id="color_checker_background"
            class="dev__components__input appearance-none"
            v-model="colorCheckerBackground"
          >
            <option :value="item" v-for="item in Object.keys(colorSwatches)" :key="item">{{ item }}</option>
          </select>
        </div>
        <div>
          <label for="color_checker_foreground">Foreground Color</label>
          <select
            id="color_checker_foreground"
            class="dev__components__input appearance-none"
            v-model="colorCheckerForeground"
          >
            <option :value="item" v-for="item in Object.keys(colorSwatches)" :key="item">{{ item }}</option>
          </select>
        </div>
      </div>
      <div v-if="colorCheckerBackground && colorCheckerForeground">
        <div v-for="family in Object.keys(twConfig.theme.fontFamily)" :key="family">
          <div v-for="weight in Object.keys(twConfig.theme.fontWeight)" :key="weight">
            <div v-for="size in Object.keys(twConfig.theme.fontSize)" :key="size">
              <div
                class="my-3 p-5"
                :class="[
                  `font-${family}`,
                  `text-${size}`,
                  `font-${weight}`,
                  `bg-${colorCheckerBackground}`,
                  `text-${colorCheckerForeground}`,
                ]"
              >
                EXAMPLE: {{ family }} {{ size }} {{ weight }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CodeExample>
  </div>
</template>

<script>
import { log } from 'JS/global';
import resolveConfig from 'tailwindcss/resolveConfig';
import CodeExample from 'WB/docs/vue/CodeExample.vue';

export default {
  components: {
    CodeExample,
  },
  data() {
    return {
      colorCheckerBackground: false,
      colorCheckerForeground: false,
      colorSwatches: {},
      twConfig: {},
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.twConfig = resolveConfig(this.globalData.tailwind);
    log(this.twConfig.theme);

    // Object.keys(this.globalData.wb.colors).forEach((schemeKey) => {
    //   const color = this.globalData.wb.colors[schemeKey];
    //
    //   if (!this.colorSwatches[schemeKey]) {
    //     this.colorSwatches[schemeKey] = {};
    //   }
    //   Object.keys(scheme).forEach((colorKey) => {
    //     if (typeof scheme[colorKey] === 'string') {
    //       this.colorSwatches[schemeKey][colorKey] = scheme[colorKey];
    //     } else {
    //       Object.keys(scheme[colorKey]).forEach((shadeKey) => {
    //         this.colorSwatches[schemeKey][`${colorKey}-${shadeKey}`] = scheme[colorKey][shadeKey];
    //       });
    //     }
    //   });
    // });

    Object.keys(this.globalData.wb.colors).forEach((key) => {
      const color = this.globalData.wb.colors[key];

      if (!key.startsWith('dev-')) {
        if (typeof color === 'string') {
          this.colorSwatches[key] = color;
        } else {
          if (color.default) {
            this.colorSwatches[`${key}`] = color.default;
          }
          Object.keys(color).forEach((shadeKey) => {
            if (shadeKey !== 'default') {
              this.colorSwatches[`${key}-${shadeKey}`] = color[shadeKey];
            }
          });
        }
      }
    });

    log(this.colorSwatches);
  },
};
</script>
