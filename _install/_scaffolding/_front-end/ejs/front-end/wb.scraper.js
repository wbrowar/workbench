const dotenv = require('dotenv');
const paths = require('./wb.paths.js');
dotenv.config();

/*
 * Options used by Workbench scraper script.
 */
module.exports = {
  pages:
    process.env.ENABLE_LIVE_PREVIEW !== 'true'
      ? [
        // {
        //   dist: `${paths.wb.static}/robots.txt`,
        //   src: `${process.env.CRAFT_URL_ROOT}/robots.txt`,
        //   allow404: true,
        //   replacements: {
        //     [`${process.env.CRAFT_URL_ROOT}/`]: process.env.CRAFT_URL_ROOT ? paths.publicPath : null,
        //   },
        // },
      ]
      : [],
};
