// Tailwind config is set in wb.config.js
const wb = require(`${ process.cwd() }/wb.config.js`);
const g = require(`${wb.paths.starter.starter}functions.js`);

module.exports = g.tailwindConfig(wb);