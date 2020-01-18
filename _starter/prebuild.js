// import node modules
const _ = require('lodash');

// import global functions
const g = require('./global.js');

// load config files
let wb = require(`${ process.cwd() }/wb.config.js`);

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const runComponentDocs = argv.options.componentdocs || false,
      runCssTemplates  = argv.options.csstemplates || false,
      runIconMethods   = argv.options.iconmethods || false,
      runPrettier      = argv.options.prettier || false,
      runScssIncludes  = argv.options.scssincludes || false,
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
    let cleanComplete = await clean;

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
            g.prebuildComponentDocsList(resolve, wb.paths, verbose);
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
}

run();