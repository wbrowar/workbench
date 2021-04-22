import axios from 'axios';
import { defineNuxtConfig } from '@nuxtjs/composition-api';
import { getPayloadForSection } from './nuxtGenerateRoutes.js';

const path = require('path');
const paths = require(`./wb.paths.js`);
const theme = require(`./wb.theme.js`);

export default defineNuxtConfig({
  analyze: true,
  alias: {
    Components: path.resolve(paths.components.src),
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
        autoprefixer: {},
      },
    },
    quiet: false,
    transpile: ['gsap'],
  },
  buildModules: ['@nuxtjs/eslint-module', '@nuxt/typescript-build', '@nuxtjs/composition-api', '@nuxtjs/tailwindcss'],
  components: false,
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
  generate: {
    fallback: true,
    interval: 1,
    crawler: false,
    async routes() {
      const routes = [];
      if (process.env.CRAFT_API_URL !== '' && process.env.CRAFT_AUTH_TOKEN !== '') {
        // Globals shared across entries
        const globals = await getPayloadForSection('globals');

        // EXAMPLE usage
        // const news = await getPayloadForSection('news', globals, { offset: '0', limit: '20' });
        // routes.push(...news);
      }
      return routes;
    },
  },
  loading: { color: '#fff' },
  pageTransition: 'page',
  plugins: ['~/plugins/craft.js', '~/plugins/preview.client.js'],
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
    host: '0',
    port: 3000,
  },
  ssr: process.env.ENABLE_LIVE_PREVIEW !== 'true',
  tailwindcss: {
    cssPath: `${path.resolve(paths.css.src)}/app.css`,
    jit: true,
  },
  target: 'static',
  telemetry: false,
});
