const paths = {
  publicPath: process.env.<%- appEnvPrefix %>PUBLIC_PATH || `/`,
  sourcePath: process.cwd() + '/_source/',
  srcPath: process.cwd() + '/<% if (!['vue3-marketo', 'nuxt2', 'vue3'].includes(install.projectType)) { %>src/<% } %>',
  workbenchPath: process.cwd() + '/_wb/',
  staticPath: process.cwd() + '/static/',
};

const wb = {
  // Colors values that are converted to CSS custom properties
  // Accepts any CSS color value as a string, or an object of color shades
  // These will replace Tailwind’s default color settings
  colors: {
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
  },
  fonts: {
    // Set up fonts for Tailwind by defining a `fontStack`
    // These will replace Tailwind’s default font stack settings
    'apple': {
      fontStack: "-apple-system, BlinkMacSystemFont, 'Avinir Next', 'Avinir', Helvetica, Arial, sans-serif",
      demoWeights: ['hairline', 'thin', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
    // For fonts loaded locally, via @font-face, define both a `fontFamily` and a `fontStack`, then provide at least one font file path
    // 'eaves': {
    //   fontFamily: "'MrEavesXLSanRRegular'",
    //   fontStack: "'MrEavesXLSanRRegular', Helvetica, Arial, sans-serif",
    //   fontStyle: "normal",
    //   fontWeight: "normal",
    //   files: {
    //     eot: "/fonts/mreavesxlsanr-020415006EmigreWebOnly.eot",
    //     woff: "/fonts/mreavesxlsanr-020415006EmigreWebOnly.woff",
    //     woff2: "/fonts/mreavesxlsanr-020415006EmigreWebOnly.woff2",
    //   }.
    // }
  },
  mq: {
    // Define breakpoints (in pixel values) used in Tailwind and vue-mq
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1300,
    },
    // Define breakpoints to be used in Tailwind
    // They should match breakpoints above, but can accept any value that Tailwind can accept
    tailwind: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1300,
    },
  },
  tailwind: {
    // Define values to merge into tailwind.config.js, other than those defined above
    theme: {
      extend: {
        gridTemplateColumns: {
          'it': 'max-content 1fr', // icon | text
          'ti': '1fr max-content', // text | icon
        },
        gridTemplateRows: {
          'card': 'max-content auto', // fixed header height | fluid body
        },
        padding: {
          '1/1': '100%',
          '16/9': '56.25%',
        },
      },
      opacity: {
        '0': '0',
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '100': '1',
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
      enabled: false,
    },
  },
  tailwindPlugins: [
    // Define Tailwind plugins
    // Use this when variants are needed for specific classes
    // function({ addUtilities }) {
    //   const newUtilities = {
    //     '.text-vertical': {
    //       writingMode: 'vertical-rl',
    //     },
    //   };
    //
    //   addUtilities(newUtilities, { variants: ['responsive'] });
    // },
  ],
  // Config options for build process
  name: '<%- install.handle %>',
  projectType: '<%- install.projectType %>',
  devMode: process.env.<%- appEnvPrefix %>DEV_MODE === 'true',
  enableDocs: process.env.<%- appEnvPrefix %>ENABLE_DOCS === 'true',
  enableWebp: process.env.<%- appEnvPrefix %>ENABLE_WEBP === 'true',
  ejs: {
    // Define any data to be processed with EJS
  },
  favicon: {
    distPath: 'img/meta/',
    themeColor: '#fff',
    tileColor: '#fff',
  },
  paths: {
    components: {
      src: `${paths.srcPath}components/`,
    },
    css: {
      src: `${paths.sourcePath}_css/`,
    },
    favicon: {
      src: `${paths.sourcePath}_favicon/`,
    },
    img: {
      src: `${paths.sourcePath}_img/`,
    },
    js: {
      src: `${paths.sourcePath}_js/`,
    },
    publicPath: paths.publicPath,
    wb: {
      components: `${paths.workbenchPath}components/`,
      source: paths.sourcePath,
      src: paths.srcPath,
      workbench: paths.workbenchPath,
      static: paths.staticPath,
      templates: `${paths.workbenchPath}templates/`,
    }
  },
  scraper: {
    pages: [
      // {
      //   dist: `${paths.staticPath}/humans.txt`,
      //   src: `${process.env.CRAFT_URL_ROOT}/humans.txt`,
      // },
      // {
      //   dist: `${paths.staticPath}/robots.txt`,
      //   src: `${process.env.CRAFT_URL_ROOT}/robots.txt`,
      //   allow404: true,
      //   replacements: {
      //     [`${process.env.CRAFT_URL_ROOT}/`]: process.env.CRAFT_URL_ROOT ? paths.publicPath : null,
      //   },
      // },
      // {
      //   dist: `${paths.staticPath}/sitemap.xml`,
      //   src: `${process.env.CRAFT_URL_ROOT}/sitemap.xml`,
      //   type: 'sitemap',
      //   sitemapRootSrc: process.env.URL,
      //   sitemapRootDist: process.env.CRAFT_URL_ROOT,
      // },
    ],
  },
};

module.exports = wb;