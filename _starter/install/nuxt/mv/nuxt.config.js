const path = require('path');
const glob = require('glob-all');
const wb = require(`./wb.config.js`);

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
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
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    `${path.resolve(wb.paths.css.src)}/app.scss`,
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    // '@nuxtjs/tailwindcss',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  pageTransition: 'page',
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extractCSS: true,
    postcss: {
      plugins: {
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
      },
    },
    extend(config, ctx) {
      config.resolve.alias.Components = path.resolve(wb.paths.components.src);
      config.resolve.alias.CSS = path.resolve(wb.paths.css.src);
      config.resolve.alias.GQL = path.resolve(`${wb.paths.starter.src}gql/`);
      config.resolve.alias.JS = path.resolve(wb.paths.js.src);
      config.resolve.alias.Layouts = path.resolve(`${wb.paths.starter.src}layouts/`);
      config.resolve.alias.Pages = path.resolve(`${wb.paths.starter.src}pages/`);
      config.resolve.alias.Source = path.resolve(wb.paths.starter.source);
      config.resolve.alias.Starter = path.resolve(wb.paths.starter.starter);
      config.resolve.alias.Templates = path.resolve(`${wb.paths.starter.src}templates/`);
    },
  },
  /*
   ** Load SCSS into all components
   */
  styleResources: {
    scss: [
      path.resolve(`${wb.paths.css.src}automated/_colors.scss`),
      path.resolve(`${wb.paths.css.src}automated/_fonts.scss`),
      path.resolve(`${wb.paths.css.src}base/_functions.scss`),
      path.resolve(`${wb.paths.css.src}base/_variables.scss`),
      path.resolve(`${wb.paths.css.src}base/_mixins.scss`),
    ],
  },
  /*
   ** Extend Vue Router
   */
  router: {
    extendRoutes(routes, resolve) {
      // Create style inventory pages
      if (wb.enableDocs) {
        // const componentDocPages = glob.sync(`./_source/_js/automated/dev/*.vue`);
        const componentDocPages = glob.sync(`${wb.paths.components.src}**/demo.vue`);
        componentDocPages.forEach((item) => {
          const slug = path.dirname(item).split(path.sep).pop();
          routes.push({
            path: `/dev/docs/${slug}`,
            component: `${wb.paths.js.src}automated/ComponentDocs.vue`,
            params: {
              slug: slug,
            },
          });
        });
      }
    }
  }
}
