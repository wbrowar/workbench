// import node modules
const fs = require('fs-extra');

// import global functions
const g = require('./functions.js');

// load config files
let tailwind = require(`${ process.cwd() }/tailwind.config.js`);
let wb = require(`${ process.cwd() }/wb.config.js`);

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const runScraper = argv.options.scraper || false,
      verbose    = argv.options.verbose || false;

async function run() {
    const clean = g.asyncFunction(
      `Removing Prebuild Files`, `Prebuild Files Removed`, (resolve) => {
          g.prebuildClean(resolve, wb.paths, verbose);
      }
    );
    const tailwindConfig = g.asyncFunction(
      `Converting Tailwind Config for front-end use`, `Tailwind Config converted`, (resolve) => {
        g.prebuildConfigToEsm(resolve, wb.paths, tailwind, 'tailwind', verbose);
      }
    );
    const wbConfig = g.asyncFunction(
      `Converting WB Config for front-end use`, `WB Config converted`, (resolve) => {
        g.prebuildWbConfig(resolve, wb.paths, wb, verbose);
      }
    );

    let cleanComplete = await clean;
    let tailwindConfigComplete = await tailwindConfig;
    let wbConfigComplete = await wbConfig;

    if (runScraper) {
      const scraper = g.asyncFunction(
        `Scraping HTML Pages`, `Pages Scraped`, (resolve) => {
          _prebuildScraper(resolve, wb.paths, wb.scraper, verbose);
        }
      );
      let scraperComplete = await scraper;
    }
}

/*
 * Scrape URLs and save as local file
 * @param callback
 */
function _prebuildScraper(callback, paths, options, verbose) {
  let count = options.pages.length;

  if (count > 0) {
    options.pages.forEach((page) => {

      if (page.dist && page.src) {
        g.log('verbose', `Scraping page: ${page.src}`, verbose);
        const request = requestSync('GET', page.src);
        if (request.statusCode === 200 || page.allow404) {
          // Output page to dist
          let pagBody = request.body;
          if (options.replacements) {
            Object.keys(options.replacements).forEach((key) => {
              pagBody = pagBody.replace(/${key}/g, options.replacements[key]);
            });
          }
          fs.outputFileSync(page.dist, pagBody);
          g.log('verbose', `Wrote file: ${page.dist}`, verbose);

          // Extract URLs form sitemap index and parse secondary pages
          if (page.type === 'sitemap') {
            g.log('verbose', `Extracting sitemap URLs from ${page.src}`, verbose);
            const removedDates = request.body.toString().replace(/(<lastmod>(.....)+<\/lastmod>)/ig,"");
            const removedTags = removedDates.replace(/(<([^>]+)>)/ig,",");
            const replacedRoots = removedTags.replace(new RegExp(page.sitemapRootSrc,"g"),page.sitemapRootDist);
            const subSitemaps = replacedRoots.split(',').filter((item) => item !== '');

            if (subSitemaps) {
              subSitemaps.forEach((subPage) => {
                const subPageRequest = requestSync('GET', subPage);

                if (subPageRequest.statusCode === 200) {
                  fs.outputFileSync(subPage.replace(page.sitemapRootDist, paths.wb.static), subPageRequest.body);
                }
              });
            }
            g.log('dump', subSitemaps, verbose);
          }
        }

        count--;
        if (count === 0) {
          callback();
        }
      }
    });
  } else {
    callback();
  }
};

run();
