const paths = require('./wb.paths.js');

/*
 * Colors values that are converted to CSS custom properties.
 * Accepts any CSS color value as a string, or an object of color shades.
 * These will replace Tailwind’s default color settings.
 */
const colors = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  // gray: {
  //   DEFAULT: '#9e9e9e',
  //   '100': '#f5f5f5',
  //   '200': '#eeeeee',
  //   '300': '#e0e0e0',
  //   '400': '#bdbdbd',
  //   '500': '#9e9e9e',
  //   '600': '#757575',
  //   '700': '#616161',
  //   '800': '#424242',
  //   '900': '#212121',
  // },
  success: 'rgb(45, 176, 51)',
  error: 'rgb(176, 25, 22)',
  warning: 'rgb(238, 199, 0)',
};

/*
 * Set up fonts for Tailwind by defining a `fontStack`. These will replace Tailwind’s default font stack settings.
 *
 * For fonts loaded locally, via @font-face, define both a `fontFamily` and a `fontStack`, then provide at least one font file path.
 *
 */
const fonts = {
  apple: {
    fontStack: "-apple-system, BlinkMacSystemFont, 'Avinir Next', 'Avinir', Helvetica, Arial, sans-serif",
    demoWeights: ['hairline', 'thin', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
  },
  // 'eaves': {
  //   fontFamily: "'MrEavesXLSanRRegular'",
  //   fontStack: "'MrEavesXLSanRRegular', Helvetica, Arial, sans-serif",
  //   fontStyle: "normal",
  //   fontWeight: "normal",
  //   files: {
  //     eot: "/fonts/mreavesxlsanr-020415006EmigreWebOnly.eot",
  //     woff: "/fonts/mreavesxlsanr-020415006EmigreWebOnly.woff",
  //     woff2: "/fonts/mreavesxlsanr-020415006EmigreWebOnly.woff2",
  //   },
  // },
};

/*
 * Define breakpoints (in pixel values) used in Tailwind and vue-mq.
 * `breakpoints` will be used in PostCSS and vue-mq.
 *
 * `tailwind` should match breakpoints above, but can accept any value that Tailwind can accept.
 */
const mq = {
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1300,
  },
  tailwind: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1300,
  },
};

/*
 * Define values to merge into tailwind.config.js, other than those defined above.
 */
const tailwind = {
  theme: {
    extend: {
      gridTemplateColumns: {
        it: 'max-content 1fr', // icon | text
        ti: '1fr max-content', // text | icon
      },
      gridTemplateRows: {
        card: 'max-content auto', // fixed header height | fluid body
      },
      padding: {
        '1/1': '100%',
        '16/9': '56.25%',
      },
    },
    opacity: {
      0: '0',
      10: '0.1',
      20: '0.2',
      30: '0.3',
      40: '0.4',
      50: '0.5',
      60: '0.6',
      70: '0.7',
      80: '0.8',
      90: '0.9',
      100: '1',
    },
  },
  variants: {
    // Variants added by Workbench: animated, current
    backgroundColor: ['responsive', 'current', 'hover', 'focus', 'animated', 'even', 'odd'],
    opacity: ['responsive', 'hover', 'focus', 'animated'],
    textColor: ['responsive', 'hover', 'focus', 'animated', 'even', 'odd'],
    translate: ['responsive', 'hover', 'focus', 'animated'],
  },
  purge: {
    content: [
      `${paths.components.src}**/*.vue`,
      `${paths.wb.src}**/*.vue`,
      `${paths.wb.src}**/*.ts`,
      `${paths.wb.src}**/*.js`,
      `${paths.wb.src}**/*.jsx`,
      `${paths.wb.src}**/*.html`,
      `${paths.wb.src}**/*.pug`,
      `${paths.wb.src}**/*.md`,
      `./index.html`,
    ],
  },
};

/*
 * Define Tailwind plugins.
 * Use this when variants are needed for specific classes.
 * function({ addUtilities }) {
 *   const newUtilities = {
 *     '.text-vertical': {
 *       writingMode: 'vertical-rl',
 *     },
 *   };
 *
 *   addUtilities(newUtilities, { variants: ['responsive'] });
 * },
 */
const tailwindPlugins = [];

/*
 * All theme settings combined
 */
module.exports = {
  colors,
  fonts,
  mq,
  tailwind,
  tailwindPlugins,
};
