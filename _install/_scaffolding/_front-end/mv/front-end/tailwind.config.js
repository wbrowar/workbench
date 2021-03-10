const _ = require('lodash');
const plugin = require('tailwindcss/plugin');
const theme = require('./wb.theme.js');
const settings = require('./wb.settings.js');

// Add colors
const colors = theme.colors;
colors.current = 'currentColor';
colors.transparent = 'transparent';

// Add fonts
const fontFamily = {};
Object.keys(theme.fonts).forEach((key) => {
  fontFamily[key] = theme.fonts[key].fontStack;
});

// Add media queries
const screens = {};
Object.keys(theme.mq.tailwind).forEach((key) => {
  screens[key] = `${theme.mq.tailwind[key]}px`;
});

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
  ...theme.tailwindPlugins,
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
  theme.tailwind
);
