import axios from 'axios';

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
    extend(config) {
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
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/composition-api',
    ['@nuxt/typescript-build', { typeCheck: false }],
    '@nuxtjs/style-resources',
  ],
  // components: [{ path: paths.components.src, pathPrefix: false }],
  components: false,
  css: [`${path.resolve(paths.css.src)}/app.css`],
  generate: {
    fallback: true,
    routes() {
      if (process.env.CRAFT_API_URL !== '' && process.env.CRAFT_AUTH_TOKEN !== '') {
        return axios
          .post(
            process.env.CRAFT_API_URL,
            {
              query: `query {
      entries(limit: null) {
        uri
      }
    }`,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.CRAFT_AUTH_TOKEN}`,
              },
            }
          )
          .then((res) => {
            return res.data.data.entries.map((entry) => {
              return entry.uri === '__home__' ? `/` : `/${entry.uri}`;
            });
          });
      }
    },
  },
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
  plugins: ['~/plugins/craft.js', '~/plugins/preview.client.js'],
  privateRuntimeConfig: {
    craftApiUrl: process.env.CRAFT_API_URL,
    craftAuthToken: process.env.CRAFT_AUTH_TOKEN,
  },
  publicRuntimeConfig: {
    livePreview: process.env.ENABLE_LIVE_PREVIEW === 'true',
    craftApiUrl: process.env.ENABLE_LIVE_PREVIEW === 'true' ? process.env.CRAFT_API_URL : '',
    craftAuthToken: process.env.ENABLE_LIVE_PREVIEW === 'true' ? process.env.CRAFT_AUTH_TOKEN : '',
    serverlessDirectory: process.env.SERVERLESS_DIRECTORY !== '' ? process.env.SERVERLESS_DIRECTORY : null,
  },
  target: 'static',
  server: {
    host: '0',
  },
};
