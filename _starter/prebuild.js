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
      runCssTemplates  = argv.options.csstemplates || false,
      runIconMethods   = argv.options.iconmethods || false,
      runPrettier      = argv.options.prettier || false,
      runScssIncludes  = argv.options.scssincludes || false,
      runSraper        = argv.options.scraper || false,
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
    const variables = g.asyncFunction(
      `Converting variables for front-end use`, `Variables converted`, (resolve) => {
        if (fs.existsSync(`${wb.paths.starter.src}variables.js`)) {
          g.prebuildConfigToEsm(resolve, wb.paths, require(`${wb.paths.starter.src}variables.js`), 'variables', verbose);
        } else {
          resolve();
        }
      }
    );
    const wbConfig = g.asyncFunction(
      `Converting WB Config for front-end use`, `WB Config converted`, (resolve) => {
        g.prebuildWbConfig(resolve, wb.paths, wb, verbose);
      }
    );

    let cleanComplete = await clean;
    let tailwindConfigComplete = await tailwindConfig;
    let variablesComplete = await variables;
    let wbConfigComplete = await wbConfig;

    if (runPrettier) {
        g.prebuildPrettier(wb.prettier, null, verbose);
    }

    if (runComponentDocs) {
        const componentDocs = g.asyncFunction(
          `Creating Component Docs`, `Component Docs Created`, (resolve) => {
            g.prebuildComponentDocs(resolve, wb.paths, wb, verbose);
          }
        );
        const componentDocsList = g.asyncFunction(
          `Creating Component Docs List`, `Component Docs List Created`, (resolve) => {
            g.prebuildComponentDocsList(resolve, wb.paths, wb, verbose);
          }
        );
        let componentDocsComplete = await componentDocs;
        let componentDocsListComplete = await componentDocsList;
    }

    if (runCssTemplates) {
        const cssTemplates = g.asyncFunction(
            `Compiling CSS Templates`, `CSS Templates Compiled`, (resolve) => {
                g.prebuildCssTemplates(resolve, wb.paths, ejsVars, verbose);
            }
        );
        let cssTemplatesComplete = await cssTemplates;
    }

    if (runIconMethods) {
        const iconMethods = g.asyncFunction(
          `Creating SVG Methods`, `SVG Methods Created`, (resolve) => {
              g.prebuildIconMethods(resolve, wb.paths, verbose);
          }
        );
        let iconMethodsComplete = await iconMethods;
    }

    if (runScssIncludes) {
        const scssIncludes = g.asyncFunction(
            `Combining SCSS Files`, `SCSS Files Combined`, (resolve) => {
                g.prebuildScssIncludes(resolve, wb.paths, verbose);
            }
        );
        let scssIncludesComplete = await scssIncludes;
    }

    if (runSraper) {
      const scraper = g.asyncFunction(
        `Scraping HTML Pages`, `Pages Scraped`, (resolve) => {
          g.prebuildScraper(resolve, wb.paths, wb.scraper, verbose);
        }
      );
      let scraperComplete = await scraper;
    }
}

run();
