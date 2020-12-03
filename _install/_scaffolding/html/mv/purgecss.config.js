const wb = require(`./wb.config.js`);

let content = [
  `${wb.paths.components.src}**/*.vue`,
  `${wb.paths.starter.source}**/*.vue`,
  `${wb.paths.starter.source}**/*.js`,
  `${wb.paths.starter.source}**/*.jsx`,
  `${wb.paths.starter.source}**/*.html`,
  `${wb.paths.starter.source}**/*.ejs`,
  `${wb.paths.starter.source}**/*.md`,
];

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
        return content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
      },
      extensions: ['vue', 'js', 'jsx', 'md', 'html', 'ejs'],
    },
  ],
};