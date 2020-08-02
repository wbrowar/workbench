import theme from '@nuxt/content-theme-docs';

export default theme({
  loading: { color: 'rgb(126, 159, 195)' },
  generate: {
    fallback: '404.html', // for Netlify
    routes: ['/'], // give the first url to start crawling
  },
  i18n: {
    locales: () => [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.js',
        name: 'English',
      },
    ],
    defaultLocale: 'en',
  },
});