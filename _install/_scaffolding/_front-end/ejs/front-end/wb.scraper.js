const dotenv = require('dotenv');
const paths = require('./wb.paths.js');
dotenv.config();

/*
 * Options used by Workbench favicon script.
 */
module.exports = {
  pages: [
    // {
    //   dist: `${paths.wb.static}/humans.txt`,
    //   src: `${process.env.CRAFT_URL_ROOT}/humans.txt`,
    // },
    // {
    //   dist: `${paths.wb.static}/robots.txt`,
    //   src: `${process.env.CRAFT_URL_ROOT}/robots.txt`,
    //   allow404: true,
    //   replacements: {
    //     [`${process.env.CRAFT_URL_ROOT}/`]: process.env.CRAFT_URL_ROOT ? paths.publicPath : null,
    //   },
    // },
    // {
    //   dist: `${paths.wb.static}/sitemap.xml`,
    //   src: `${process.env.CRAFT_URL_ROOT}/sitemap.xml`,
    //   type: 'sitemap',
    //   sitemapRootSrc: process.env.FRONT_END_URL_ROOT,
    //   sitemapRootDist: process.env.CRAFT_URL_ROOT,
    // },
  ],
};
