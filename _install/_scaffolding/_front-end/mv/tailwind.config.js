// Tailwind config is set in wb.config.js
const _ = require('lodash');
const plugin = require('tailwindcss/plugin');
const wb = require(`${process.cwd()}/wb.config.js`);

// Add colors
const colors = wb.colors;
colors.current = 'currentColor';
colors.transparent = 'transparent';

// Add fonts
const fontFamily = {};
Object.keys(wb.fonts).forEach((key) => {
  fontFamily[key] = wb.fonts[key].fontStack;
});

// Add media queries
const screens = {};
Object.keys(wb.mq).forEach((key) => {
  screens[key] = `${wb.mq[key]}px`;
});

if (wb.devMode || wb.enableDocs) {
  // Add dev colors
  _.merge(colors, {
    'dev-black': '#000000',
    'dev-gray': {
      '100': '#f5f5f5',
      '200': '#eeeeee',
      '300': '#e0e0e0',
      '400': '#bdbdbd',
      '500': '#9e9e9e',
      '600': '#757575',
      '700': '#616161',
      '800': '#424242',
      '900': '#212121',
    },
    'dev-white': '#ffffff',
  });

  // Add dev fonts
  _.merge(fontFamily, {
    'dev-apple': "-apple-system, BlinkMacSystemFont, 'Avinir Next', 'Avinir', Helvetica, Arial, sans-serif",
  });
}

// Add Tailwind plugins
const plugins = [];
const pluginFunctions = [
  // Modify a property after LazyAnimate has been activated on an element
  function({ addVariant, e }) {
    addVariant('animated', ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.${e(`animated${separator}${className}`)}.animated`;
      });
    });
  },
  // A generic "current" class that can be used in components where you need to identify one item in a list of like elements
  function({ addVariant, e }) {
    addVariant('current', ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.${e(`current${separator}${className}`)}.current`;
      });
    });
  },
  ...wb.tailwindPlugins,
];
pluginFunctions.forEach((item) => {
  plugins.push(plugin(item));
});

// Export Tailwind config
module.exports = _.merge(
  {
    theme: {
      colors,
      fontFamily,
      screens,
    },
    plugins,
  },
  wb.tailwind
);
