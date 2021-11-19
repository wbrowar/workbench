/*
 * Colors values that are converted to CSS custom properties.
 * Accepts any CSS color value as a string, or an object of color shades.
 * These will replace Tailwind’s default color settings.
 */
const colors = {
  black: {
    value: 'rgb(0,0,0)',
    default: 'rgb(0,0,0)',
    '.light': 'rgb(0,0,0)',
    '.dark': 'rgb(255, 255, 255)',
  },
  white: {
    value: 'rgb(255, 255, 255)',
    default: 'rgb(255, 255, 255)',
    '.light': 'rgb(255, 255, 255)',
    '.dark': 'rgb(0,0,0)',
  },
  success: 'rgba(45, 176, 51, .9)',
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
 * Define values to merge into tailwind.config.cjs, other than those defined above.
 */
const tailwind = {
  darkMode: 'class',
  mode: 'jit',
  important: false,
  purge: {
    content: [
      `./_source/_components/**/*.vue`,
      `./_source/_components/**/*.ts`,
      `./{composables,layouts,pages}/**/*.vue`,
      `./{composables,layouts,pages}/**/*.ts`,
      `./index.html`,
    ],
  },
  theme: {
    // fontSize: {
    //   base: ['0.813rem', '1.125rem'], // 13px
    //   '5xlc6xl': ['clamp(2.5rem, 6vw, 3.438rem)', '1.15em'],
    // },
    extend: {
      // animation: {
      //   'fade-in': 'fade-in var(--duration, 0.5s) var(--ease, ease) var(--delay, 0s) forwards',
      //   'fade-up': 'fade-up var(--duration, 0.5s) var(--ease, ease) var(--delay, 0s) forwards',
      //   'fade-right': 'fade-right var(--duration, 0.5s) var(--ease, ease) var(--delay, 0s) forwards',
      //   'fade-down': 'fade-down var(--duration, 0.5s) var(--ease, ease) var(--delay, 0s) forwards',
      //   'fade-left': 'fade-left var(--duration, 0.5s) var(--ease, ease) var(--delay, 0s) forwards',
      // },
      // gridTemplateColumns: {
      //   it: 'max-content 1fr', // icon | text
      //   ti: '1fr max-content', // text | icon
      // },
      // gridTemplateRows: {
      //   card: 'max-content auto', // fixed header height | fluid body
      // },
      // margin: {
      //   'center-line': '.15em',
      // },
      // padding: {
      //   '1/1': '100%',
      //   '16/9': '56.25%',
      //   aspect: `var(--aspect-ratio)`,
      // },
      // transitionDuration: {
      //   0: '0ms',
      //   100: '100ms',
      //   200: '200ms',
      //   300: '300ms',
      //   400: '400ms',
      //   500: '500ms',
      //   600: '600ms',
      //   700: '700ms',
      //   800: '800ms',
      //   900: '900ms',
      //   1000: '1000ms',
      //   1100: '1100ms',
      //   1200: '1200ms',
      //   1300: '1300ms',
      //   1400: '1400ms',
      //   1500: '1500ms',
      // },
    },
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
const tailwindPlugins = [
  function({ addUtilities, theme }) {
    const newUtilities = {
      // '.aspect': {
      //   aspectRatio: 'var(--aspect-ratio)',
      // },
      // '.aspect-0': {
      //   aspectRatio: 'unset',
      // },
      // '.columns-1': {
      //   columns: '1',
      // },
      // '.columns-2': {
      //   columns: '2',
      // },
      // '.cursor-grab': {
      //   cursor: 'grab',
      // },
      // '.cursor-grabbing': {
      //   cursor: 'grabbing',
      // },
      // '.scroll-snap-none': {
      //   scrollSnapType: 'none',
      // },
      // '.scroll-snap-x': {
      //   scrollSnapType: 'x mandatory',
      // },
      // '.scroll-snap-y': {
      //   scrollSnapType: 'y mandatory',
      // },
      // '.scroll-snap-start': {
      //   scrollSnapAlign: 'start',
      // },
      // '.scroll-snap-center': {
      //   scrollSnapAlign: 'center',
      // },
      // '.scroll-snap-end': {
      //   scrollSnapAlign: 'end',
      // },
    };

    // const transitionDuration = theme('transitionDuration');
    // Object.keys(transitionDuration).forEach((key) => {
    //   newUtilities[`.animate-duration-${key}`] = {
    //     '--duration': transitionDuration[key],
    //   };
    //   newUtilities[`.animate-delay-${key}`] = {
    //     '--delay': transitionDuration[key],
    //   };
    // });
    // const transitionTimingFunction = theme('transitionTimingFunction');
    // Object.keys(transitionTimingFunction).forEach((key) => {
    //   newUtilities[`.animate-ease-${key}`] = {
    //     '--ease': transitionTimingFunction[key],
    //   };
    // });

    addUtilities(newUtilities);
  },
  // function({ addVariant, e }) {
  //   addVariant('link-active', ({ modifySelectors, separator }) => {
  //     modifySelectors(({ className }) => {
  //       return `.${e(`link-active${separator}${className}`)}.nuxt-link-active`;
  //     });
  //   });
  // },
  // function({ addVariant, e }) {
  //   addVariant('link-exact', ({ modifySelectors, separator }) => {
  //     modifySelectors(({ className }) => {
  //       return `.${e(`link-exact${separator}${className}`)}.nuxt-link-exact-active`;
  //     });
  //   });
  // },
];

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
