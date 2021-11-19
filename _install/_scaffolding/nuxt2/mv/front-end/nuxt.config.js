const path = require('path');
const paths = require(`./wb.paths.js`);
const theme = require(`./wb.theme.js`);

export default {
  alias: {
    Components: path.resolve(paths.components.src),
    Composables: path.resolve(paths.composables.src),
    CSS: path.resolve(paths.css.src),
    GQL: path.resolve(`${paths.wb.src}gql/`),
    JS: path.resolve(paths.js.src),
    Layouts: path.resolve(`${paths.wb.src}layouts/`),
    Pages: path.resolve(`${paths.wb.src}pages/`),
    Source: path.resolve(paths.wb.source),
    WB: path.resolve(paths.wb.workbench),
    Templates: path.resolve(`${paths.wb.src}templates/`),
  },
  build: {
    babel: {
      plugins: ['@babel/plugin-proposal-optional-chaining'],
    },
    extractCSS: {
      ignoreOrder: true,
    },
    optimizeCSS: true,
    quiet: false,
    // transpile: ['gsap', 'three'],
  },
  buildModules: [
    './modules/craft-globals',
    '@nuxtjs/composition-api/module',
    ['@nuxt/typescript-build', { typeCheck: true }],
    // '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    'nuxt-mq',
    '@nuxtjs/gtm',
  ],
  components: false,
  dir: {
    static: 'public',
  },
  // eslint: {
  //   cache: true,
  // },
  generate: {
    fallback: false,
    interval: 10,
    crawler: false,
  },
  gtm: {
    // id: 'GTM-XXXXXXX',
    pageTracking: true,
  },
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: 'Title (set in nuxt.config.js)',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Description (set in nuxt.config.js)',
      },
    ],
  },
  // loading: { color: '' },
  mq: {
    defaultBreakpoint: 'sm',
    breakpoints: {
      ...theme.mq.breakpoints,
    },
  },
  pageTransition: 'page',
  plugins: [
    // '~/plugins/simple-portal.js',
    // '~/plugins/browser-preferences.client.js',
    '~/plugins/craft.ts',
    '~/plugins/preview.client.js',
  ],
  privateRuntimeConfig: {
    craftApiUrl: process.env.CRAFT_API_URL,
    craftAuthToken: process.env.CRAFT_AUTH_TOKEN,
  },
  publicRuntimeConfig: {
    craftApiUrl: process.env.ENABLE_LIVE_PREVIEW === 'true' ? process.env.CRAFT_API_URL : '',
    craftAuthToken: process.env.ENABLE_LIVE_PREVIEW === 'true' ? process.env.CRAFT_AUTH_TOKEN : '',
    livePreview: process.env.ENABLE_LIVE_PREVIEW === 'true',
    livePreviewEndpoint: process.env.LIVE_PREVIEW_ENDPOINT !== '' ? process.env.LIVE_PREVIEW_ENDPOINT : null,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  // ssr: false,
  tailwindcss: {
    cssPath: `${path.resolve(paths.css.src)}/app.css`,
  },
  target: 'static',
  telemetry: false,
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: true,
    },
  },
};
