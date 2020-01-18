const paths = {
  source: process.cwd() + '/_source/',
  starter: process.cwd() + '/_starter/',
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
      alert_warning: "rgb(238, 199, 0)"
    },
    // Define colors for (prefers-color-scheme: dark)
    // dark: {
    //   white: "rgb(240, 240, 240)"
    // },
    // Define colors for (prefers-color-scheme: light)
    // light: {
    //   white: "rgb(255, 255, 255)",
    // }
    // Define colors that override by class
    // high_contrast: {
    //   white: "rgb(255, 255, 255)",
    // }
  },
  fonts: {
    'apple': {
      fontStack: "-apple-system, BlinkMacSystemFont, 'Avinir Next', 'Avinir', Helvetica, Arial, sans-serif",
    },
    'eaves': {
      fontFamily: "'MrEavesXLSanRRegular'",
      fontStack: "'MrEavesXLSanRRegular', Helvetica, Arial, sans-serif",
      fontStyle: "normal",
      fontWeight: "normal",
      files: {
        eot: "/fonts/mreavesxlsanr-020415006EmigreWebOnly.eot",
        woff: "/fonts/mreavesxlsanr-020415006EmigreWebOnly.woff",
        woff2: "/fonts/mreavesxlsanr-020415006EmigreWebOnly.woff2"
      }
    }
  },
  mq: {
    // Define breakpoints used in Tailwind and vue-mq
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
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
      src: `${paths.source}_components/`,
    },
    css: {
      src: `${paths.source}_css/`,
    },
    favicon: {
      src: `${paths.source}_favicon/`,
    },
    icon: {
      src: `${paths.source}_icon/`,
    },
    img: {
      src: `${paths.source}_img/`,
    },
    js: {
      src: `${paths.source}_js/`,
    },
    starter: {
      components: `${paths.starter}components/`,
      templates: `${paths.starter}templates/`,
    }
  },
  prettier: {
    files: "{_source,src}_source/**/*.{js,json,scss,vue}",
    options: "--write"
  },
};