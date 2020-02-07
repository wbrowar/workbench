const wb = require(`./wb.config.js`);

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\\/]+/g)
  }
}

module.exports = {
  content: [
    `${wb.paths.starter.components}**/*.vue`,
    `${wb.paths.starter.src}**/*.vue`,
    `${wb.paths.starter.src}**/*.js`,
    `${wb.paths.starter.src}**/*.jsx`,
    `${wb.paths.starter.src}**/*.html`,
    `${wb.paths.starter.src}**/*.pug`,
    `${wb.paths.starter.src}**/*.md`,
  ],
  whitelist: [
    'body',
    'html',
    'img',
    'a',
    'g-image',
    'g-image--lazy',
    'g-image--loaded',
  ],
  extractors: [
    {
      extractor: TailwindExtractor,
      extensions: ['vue', 'js', 'jsx', 'md', 'html', 'pug'],
    },
  ],
}