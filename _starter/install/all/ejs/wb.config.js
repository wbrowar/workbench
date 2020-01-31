const paths = {
  sourcePath: process.cwd() + '/_source/',
  starterPath: process.cwd() + '/_starter/',
};

module.exports = {
  // Colors values that are converted to CSS custom properties
  // Accepts any CSS color value as a string, or an object of color shades
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
      alert_success: "rgb(45, 176, 51)",
      alert_error: "rgb(176, 25, 22)",
      alert_warning: "rgb(238, 199, 0)",
    },
    // Define colors for (prefers-color-scheme: dark)
    // dark: {
    //   white: "rgb(40, 40, 40)",
    //   black: "rgb(200, 200, 200)",
    //   gray: {
    //     '100': '#212121',
    //     '200': '#424242',
    //     '300': '#616161',
    //     '400': '#757575',
    //     '500': '#9e9e9e',
    //     '600': '#bdbdbd',
    //     '700': '#e0e0e0',
    //     '800': '#eeeeee',
    //     '900': '#f5f5f5',
    //   },
    // },
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
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1300,
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
  tailwind: {
    // Define values to merge into tailwind.config.js, other than those defined above
  },
  // Config options for build process
  name: '<%- install.handle %>',
  projectType: '<%- install.projectType %>',
  ejs: {
    // Define any data to be processed with EJS
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
    starter: {
      components: `${paths.starterPath}components/`,
      source: paths.sourcePath,
      starter: paths.starterPath,
      templates: `${paths.starterPath}templates/`,
    }
  },
  prettier: {
    files: "{_source,src}_source/**/*.{js,json,scss,vue}",
    options: "--write",
  },
};