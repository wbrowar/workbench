// import axios from 'axios';

const path = require('path');
const paths = require(`./wb.paths.js`);
const theme = require(`./wb.theme.js`);

export default {
  build: {
    babel: {
      plugins: ['@babel/plugin-proposal-optional-chaining'],
    },
    extractCSS: true,
    html: {
      minify: {
        minifyCSS: false,
        minifyJS: false,
      },
    },
    postcss: {
      plugins: {
        'postcss-import': {},
        'postcss-simple-vars': {},
        'postcss-nested': {},
        'postcss-custom-media': {
          importFrom: [
            () => {
              const customMedia = {};
              Object.entries(theme.mq.breakpoints).forEach(([key, value]) => {
                customMedia[`--mq-${key}`] = `(min-width: ${value}px)`;
              });

              return { customMedia };
            },
          ],
        },
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
        autoprefixer: {},
      },
    },
    transpile: ['gsap'],
    extend(config, ctx) {
      config.resolve.alias.Components = path.resolve(paths.components.src);
      config.resolve.alias.CSS = path.resolve(paths.css.src);
      config.resolve.alias.GQL = path.resolve(`${paths.wb.src}gql/`);
      config.resolve.alias.JS = path.resolve(paths.js.src);
      config.resolve.alias.Layouts = path.resolve(`${paths.wb.src}layouts/`);
      config.resolve.alias.Pages = path.resolve(`${paths.wb.src}pages/`);
      config.resolve.alias.Source = path.resolve(paths.wb.source);
      config.resolve.alias.WB = path.resolve(paths.wb.workbench);
      config.resolve.alias.Templates = path.resolve(`${paths.wb.src}templates/`);
    },
  },
  buildModules: ['@nuxtjs/eslint-module', ['@nuxt/typescript-build', { typeCheck: false }], '@nuxtjs/style-resources'],
  // components: [{ path: paths.components.src, pathPrefix: false }],
  components: false,
  css: [`${path.resolve(paths.css.src)}/app.css`],
  dir: {
    static: 'public',
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  loading: { color: '#fff' },
  modules: [
    [
      'nuxt-mq',
      {
        // Default breakpoint for SSR
        defaultBreakpoint: 'default',
        breakpoints: {
          ...theme.mq.breakpoints,
          lg: Infinity,
        },
      },
    ],
  ],
  pageTransition: 'page',
  plugins: [
    // '~/plugins/craft.js',
    // '~/plugins/preview.client.js'
  ],
  // privateRuntimeConfig: {
  //   craftApiUrl: process.env.CRAFT_API_URL,
  //   craftAuthToken: process.env.CRAFT_AUTH_TOKEN,
  // },
  // publicRuntimeConfig: {
  //   livePreview: process.env.LIVE_PREVIEW === 'true',
  //   craftApiUrl: process.env.LIVE_PREVIEW === 'true' ? process.env.CRAFT_API_URL : '',
  //   // craftApiUrl: process.env.CRAFT_API_URL,
  //   craftAuthToken: process.env.LIVE_PREVIEW === 'true' ? process.env.CRAFT_AUTH_TOKEN : '',
  // },
  target: 'static',
  server: {
    host: '0',
  },
  watchers: {
    webpack: {
      poll: 500,
      ignored: ['./_wb', './node_modules'],
    },
  },
};
