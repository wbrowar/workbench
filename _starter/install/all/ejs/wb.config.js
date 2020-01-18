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
    // high-contrast: {
    //   white: "rgb(255, 255, 255)",
    // }
  },
  fonts: {
    'apple': {
      fontFamily: "-apple-system",
      fallbackStack: "BlinkMacSystemFont, 'Avinir Next', 'Avinir', Helvetica, Arial, sans-serif",
      fontStyle: "normal",
      fontWeight: "normal"
    },
    'apple-bold': {
      fontFamily: "-apple-system",
      fallbackStack: "BlinkMacSystemFont, 'Avinir Next', 'Avinir', Helvetica, Arial, sans-serif",
      fontStyle: "normal",
      fontWeight: "700"
    },
    'apple-italic': {
      fontFamily: "-apple-system",
      fallbackStack: "BlinkMacSystemFont, 'Avinir Next', 'Avinir', Helvetica, Arial, sans-serif",
      fontStyle: "italic",
      fontWeight: "normal"
    },
    'apple-bold-italic': {
      fontFamily: "-apple-system",
      fallbackStack: "BlinkMacSystemFont, 'Avinir Next', 'Avinir', Helvetica, Arial, sans-serif",
      fontStyle: "italic",
      fontWeight: "700"
    },
    'eaves': {
      fontFamily: "'MrEavesXLSanRRegular'",
      fallbackStack: "Helvetica, Arial, sans-serif",
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
  paths: {
    components: {
      // grouped: true,
      src: `${process.cwd()}/${paths.source}_components/`
    },
    css: {
      // dist: "public/css/",
      src: `${process.cwd()}/${paths.source}_css/`
    },
    favicon: {
      // dist: "public/favicon/",
      src: `${process.cwd()}/${paths.source}_favicon/`
    },
    icon: {
      // dist: "public/icon/",
      src: `${process.cwd()}/${paths.source}_icon/`
    },
    img: {
      // dist: "public/img/",
      src: `${process.cwd()}/${paths.source}_img/`
    },
    js: {
      // dist: "public/js/",
      src: `${process.cwd()}/${paths.source}_js/`
    },
    templates: {
      // dist: "public/",
      src: `${process.cwd()}/${paths.source}_templates/`
    }
  },
  prettier: {
    files: "{_source,src}_source/**/*.{js,json,scss,vue}",
    options: "--write"
  },
};