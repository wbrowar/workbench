// import global functions
const g = require('./global.js');

// load package file
let pkg = require(`${ process.cwd() }/package.json`);

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const runComponentDocs = argv.options.componentdocs || false,
      runCssTemplates = argv.options.csstemplates || false,
      runIconMethods  = argv.options.iconmethods || false,
      runPrettier     = argv.options.prettier || false,
      runScssIncludes = argv.options.scssincludes || false,
      verbose         = pkg.overrideVerbose || argv.options.verbose || false;

// set variables based on pkg options
let paths = g.getPaths(pkg.paths);
let ejsVars = Object.assign({
    paths: paths,
    pkg: pkg,
}, pkg.ejs);

async function run() {
    const clean = g.asyncFunction(
      `Removing Prebuild Files`, `Prebuild Files Removed`, (resolve) => {
          g.prebuildClean(resolve, paths, verbose);
      }
    );
    let cleanComplete = await clean;

    if (runPrettier) {
        g.prebuildPrettier(pkg.prettier, null, verbose);
    }

    if (runComponentDocs) {
        const componentDocs = g.asyncFunction(
          `Creating Component Docs`, `Component Docs Created`, (resolve) => {
              g.prebuildComponentDocs(resolve, paths, pkg, verbose);
          }
        );
        let componentDocsComplete = await componentDocs;
    }

    if (runCssTemplates) {
        const cssTemplates = g.asyncFunction(
            `Compiling CSS Templates`, `CSS Templates Compiled`, (resolve) => {
                g.prebuildCssTemplates(resolve, paths, ejsVars, verbose);
            }
        );
        let cssTemplatesComplete = await cssTemplates;
    }

    if (runIconMethods) {
        const iconMethods = g.asyncFunction(
          `Creating SVG Methods`, `SVG Methods Created`, (resolve) => {
              g.prebuildIconMethods(resolve, paths, verbose);
          }
        );
        let iconMethodsComplete = await iconMethods;
    }

    if (runScssIncludes) {
        const scssIncludes = g.asyncFunction(
            `Combining SCSS Files`, `SCSS Files Combined`, (resolve) => {
                g.prebuildScssIncludes(resolve, paths, verbose);
            }
        );
        let scssIncludesComplete = await scssIncludes;
    }
}

run();