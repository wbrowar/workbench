const dotenv = require('dotenv');
dotenv.config();

const paths = {
  publicPath: process.env.PUBLIC_PATH || `/`,
  sourcePath: process.cwd() + '/_source/',
  srcPath: process.cwd() + '/<% if (!["nuxt"].includes(install.projectType)) { %>src/<% } %>',
  starterPath: process.cwd() + '/_starter/',
  staticPath: process.cwd() + '/static/',
};

module.exports = {
  // Colors values that are converted to CSS custom properties
  // Accepts any CSS color value as a string, or an object of color shades
  // These will replace Tailwind’s default color settings
  colors: {
    // Define colors
    default: {
      white: "rgb(255, 255, 255)",
      black: "rgb(0, 0, 0)",
      gray: {
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
      success: "rgb(45, 176, 51)",
      error: "rgb(176, 25, 22)",
      warning: "rgb(238, 199, 0)",
    },
    // Define colors for (prefers-color-scheme: dark)
    dark: {
      white: "rgb(40, 40, 40)",
      black: "rgb(200, 200, 200)",
      gray: {
        '100': '#212121',
        '200': '#424242',
        '300': '#616161',
        '400': '#757575',
        '500': '#9e9e9e',
        '600': '#bdbdbd',
        '700': '#e0e0e0',
        '800': '#eeeeee',
        '900': '#f5f5f5',
      },
    },
    // Define colors for (prefers-color-scheme: light)
    // light: {
    //   white: "rgb(255, 255, 255)",
    // },
    // Define colors that override by class
    // high_contrast: {
    //   white: "rgb(255, 255, 255)",
    // },
  },
  fonts: {
    // Set up fonts for Tailwind by defining a `fontStack`
    // These will replace Tailwind’s default font stack settings
    'apple': {
      fontStack: "-apple-system, BlinkMacSystemFont, 'Avinir Next', 'Avinir', Helvetica, Arial, sans-serif",
      demoWeights: [
        'hairline',
        'thin',
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black',
      ],
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
    // These will replace Tailwind’s default media query settings
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1300,
  },
  opacity: {
    // Define opacity values used to create opacity utility classes
    // These will replace Tailwind’s default opacity settings
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
      }
    },
    variants: {
      // Variants added by WB-Starter: animated, current
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
<% if (install.projectType === 'marketo-vue') { %>marketo: {
    // Define variables for the head and body. NOTE: a head and body array are required, even if they are empty arrays
    // Landing Page syntax: https://docs.marketo.com/display/public/DOCS/Create+a+Guided+Landing+Page+Template
    variables: {
      head: [
        {
          label: "Show Marketo Docs",
          id: "show_marketo_docs",
          type: "mktoBoolean",
          default: false,
          description: `Show landing page docs.`,
        },
        {
          // String example
          label: "Example Single Line Text",
          id: "example_single_line_text",
          type: "mktoString",
          default: "Example Headline",
          allowHtml: false,
          description: `Example of single-line string.`,
        },
        {
          // Color example
          label: "Example Color",
          id: "example_color",
          type: "mktoColor",
          default: "#FF00FF",
          description: `Example of color picker variable.`,
        },
        {
          // Boolean example
          label: "Example Lightswitch",
          id: "example_lightswitch",
          type: "mktoBoolean",
          default: true,
          description: `Example of boolean. Will be parsed as a Boolean in Vue.`,
        },
        {
          // Form example
          label: "Video Example",
          id: "example_video",
          type: "mktoString",
          default: `G4Sn91t1V4g`,
        },
      ],
      body: [
        {
          // Image example
          label: "Example Text",
          id: "example_text",
          type: "mktoText",
          default: `<p>Optionally add default text for the editable text area.</p>`,
          description: `Example rich text field.`,
        },
        {
          // Image example
          label: "Example Image",
          id: "example_image",
          type: "mktoImg",
          default: {
            alt: `Bright fuchsia image with FPO written in the center of it.`,
            src: `${paths.publicPath}img/FPO.png`,
          },
        },
        {
          // Form example
          label: "Form Example",
          id: "example_form",
          type: "mktoForm",
        },
      ],
    },
  },<% } -%>
  // Config options for build process
  name: '<%- install.handle %>',
  projectType: '<%- install.projectType %>',
  devMode: process.env.<%- appEnvPrefix %>DEV_MODE === 'true',
  enableDocs: process.env.<%- appEnvPrefix %>ENABLE_DOCS === 'true',
  enableWebp: process.env.<%- appEnvPrefix %>ENABLE_WEBP === 'true',
  colorOptions: {
    enableCustomProperties: false,
    utilities: [
      // Create color utilities from values in colors.default
      { property: 'backgroundColor', prefix: 'bg', enabled: ['opacity', 'val'] },
      { property: 'borderColor', prefix: 'border', enabled: ['opacity', 'val'] },
      { property: 'color', prefix: 'text', enabled: ['opacity', 'val'] },
      // { property: 'divideColor', prefix: 'border', enabled: ['opacity', 'val'] },
      // { property: 'placeholderColor', prefix: 'border', enabled: ['opacity', 'val'] },
    ],
    variants: [
      // Enable variants for all color combinations
      'responsive',
      'hover',
      'focus',
      // 'active',
      'group-hover',
      'animated'
      // 'current'
    ],
  },
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
      src: `${paths.sourcePath}_components/`,
    },
    css: {
      src: `${paths.sourcePath}_css/`,
    },
    favicon: {
      src: `${paths.sourcePath}_favicon/`,
    },
    icon: {
      src: `${paths.sourcePath}_icon/`,
    },
    img: {
      src: `${paths.sourcePath}_img/`,
    },
    js: {
      src: `${paths.sourcePath}_js/`,
    },
    publicPath: paths.publicPath,
    starter: {
      components: `${paths.starterPath}components/`,
      source: paths.sourcePath,
      src: paths.srcPath,
      starter: paths.starterPath,
      static: paths.staticPath,
      templates: `${paths.starterPath}templates/`,
    }
  },
  postcss: {
  },
  prettier: {
    files: "{_source,src}/**/*.{js,json,scss,vue}",
    options: "--write",
  },
};