// Tailwind config is set in wb.config.js
const g = require('./global.js');
let wb = require(`${ process.cwd() }/wb.config.js`);

module.exports = g.tailwindConfig(wb);