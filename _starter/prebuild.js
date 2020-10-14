// import node modules
const _ = require('lodash'),
      fs = require('fs-extra');

// import global functions
const g = require('./functions.js');

// load config files
let tailwind = require(`${ process.cwd() }/tailwind.config.js`);
let wb = require(`${ process.cwd() }/wb.config.js`);

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const runComponentDocs = argv.options.componentdocs || false,
      runIconMethods   = argv.options.iconmethods || false,
      runCssIncludes   = argv.options.cssincludes || false,
      runScraper       = argv.options.scraper || false,
      verbose          = argv.options.verbose || false;

// set variables based on wb options
let ejsVars = _.merge({
    paths: wb.paths,
    wb: wb,
}, wb.ejs);

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

    if (runComponentDocs) {
        const componentDocsList = g.asyncFunction(
          `Creating Component Docs List`, `Component Docs List Created`, (resolve) => {
            g.prebuildComponentDocsList(resolve, wb.paths, wb, verbose);
          }
        );
        let componentDocsListComplete = await componentDocsList;
    }

    if (runIconMethods) {
        const iconMethods = g.asyncFunction(
          `Creating SVG Methods`, `SVG Methods Created`, (resolve) => {
              g.prebuildIconMethods(resolve, wb.paths, verbose);
          }
        );
        let iconMethodsComplete = await iconMethods;
    }

    if (runCssIncludes) {
        const cssIncludes = g.asyncFunction(
            `Combining PostCSS Files`, `PostCSS Files Combined`, (resolve) => {
                g.prebuildCssIncludes(resolve, wb.paths, verbose);
            }
        );
        let cssIncludesComplete = await cssIncludes;
    }

    if (runScraper) {
      const scraper = g.asyncFunction(
        `Scraping HTML Pages`, `Pages Scraped`, (resolve) => {
          g.prebuildScraper(resolve, wb.paths, wb.scraper, verbose);
        }
      );
      let scraperComplete = await scraper;
    }
}

run();
