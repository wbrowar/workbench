const paths = require(`./wb.paths.js`);

let content = [
  `${paths.components.src}**/*.vue`,
  `${paths.wb.src}**/*.vue`,
  `${paths.wb.src}**/*.ts`,
  `${paths.wb.src}**/*.js`,
  `${paths.wb.src}**/*.jsx`,
  `${paths.wb.src}**/*.html`,
  `${paths.wb.src}**/*.pug`,
  `${paths.wb.src}**/*.md`,
];

let whitelist = ['body', 'html', 'img', 'a', 'g-image', 'g-image--lazy', 'g-image--loaded', 'hidden'];

let whitelistPatterns = [/scheme/];

module.exports = {
  content: content,
  whitelist: whitelist,
  whitelistPatterns: whitelistPatterns,
  extractors: [
    {
      extractor: (content) => {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '');
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
      },
      extensions: ['vue', 'js', 'jsx', 'md', 'html', 'pug'],
    },
  ],
};
