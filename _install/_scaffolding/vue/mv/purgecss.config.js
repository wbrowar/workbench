const wb = require(`./wb.config.js`);

let content = [
  `${wb.paths.components.src}**/*.vue`,
  `${wb.paths.starter.src}**/*.vue`,
  `${wb.paths.starter.src}**/*.js`,
  `${wb.paths.starter.src}**/*.jsx`,
  `${wb.paths.starter.src}**/*.html`,
  `${wb.paths.starter.src}**/*.pug`,
  `${wb.paths.starter.src}**/*.md`,
];
if (wb.enableDocs) {
  content.push(`${wb.paths.starter.starter}docs/**/*.vue`);
}

let whitelist = [
  'body',
  'html',
  'img',
  'a',
  'g-image',
  'g-image--lazy',
  'g-image--loaded',
  'hidden',
];

let whitelistPatterns = [
  /scheme/,
];

module.exports = {
  content: content,
  whitelist: whitelist,
  whitelistPatterns: whitelistPatterns,
  extractors: [
    {
      extractor: content => {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
      },
      extensions: ['vue', 'js', 'jsx', 'md', 'html', 'pug'],
    },
  ],
};