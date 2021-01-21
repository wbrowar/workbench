const wb = require(`wb.config.js`);

let content = [
  `${wb.paths.components.src}**/*.vue`,
  `${wb.paths.wb.src}**/*.vue`,
  `${wb.paths.wb.src}**/*.ts`,
  `${wb.paths.wb.src}**/*.js`,
  `${wb.paths.wb.src}**/*.jsx`,
  `${wb.paths.wb.src}**/*.html`,
  `${wb.paths.wb.src}**/*.pug`,
  `${wb.paths.wb.src}**/*.md`,
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
