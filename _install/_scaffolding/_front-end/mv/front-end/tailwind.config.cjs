// import * as global from './_wb/functions.mjs';

const _ = require('lodash');
const plugin = require('tailwindcss/plugin');
const global = require('./_wb/functions.mjs');
const theme = require('./wb.theme.js');
const settings = require('./wb.settings.js');

// Add colors
const colors = {};
colors.current = 'currentColor';
colors.transparent = 'transparent';
colors.fpo = 'rgb(230,0,255)';

// Add colors
const themeColors = global.parseThemeColors(theme.colors);
_.merge(colors, themeColors.tailwind);

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

if (settings.devMode) {
  // Add dev colors
  _.merge(colors, {
    'dev-black': '#000000',
    'dev-gray': {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
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
  // Used to animate an element from one visual state to another
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
  // Used to animate a child element from a parent with an `.animated` class on it
  function({ addVariant, e }) {
    addVariant('group-animated', ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.animated-group .${e(`group-animated${separator}${className}`)}`;
      });
    });
  },
  // Used to remove motion when user turns on `reduce-motion`
  function({ addVariant, e }) {
    addVariant('reduce-motion', ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.reduce-motion .${e(`reduce-motion${separator}${className}`)}`;
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