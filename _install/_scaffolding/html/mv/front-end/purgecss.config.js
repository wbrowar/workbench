const wb = require(`./wb.config.js`);

let content = [
  `${wb.paths.components.src}**/*.vue`,
  `${wb.paths.wb.source}**/*.vue`,
  `${wb.paths.wb.source}**/*.js`,
  `${wb.paths.wb.source}**/*.jsx`,
  `${wb.paths.wb.source}**/*.html`,
  `${wb.paths.wb.source}**/*.ejs`,
  `${wb.paths.wb.source}**/*.md`,
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