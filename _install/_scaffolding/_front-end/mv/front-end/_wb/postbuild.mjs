import { default as _ } from 'lodash';
import { default as fs } from 'fs-extra';
import * as g from './functions.mjs';
import { default as paths } from '../wb.paths.js';
import { default as settings } from '../wb.settings.js';

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const runMarketoVariables = typeof argv.options.marketovars !== 'undefined' ? argv.options.marketovars : false;
const verbose = typeof argv.options.verbose !== 'undefined' ? argv.options.verbose : false;


// set variables based on wb options
let ejsVars = _.merge(
  {
    paths: paths,
    wb: wb,
  },
  settings.ejs
);

if (fs.existsSync(`./node.variables.js`)) {
  ejsVars.variables = import(`./node.variables.js`);
  g.log('dump', ejsVars.variables, true);
}

async function run() {
  if (runMarketoVariables) {
    const marketoVariables = g.asyncFunction(
      `Adding Marketo Variables to index.html`,
      `Marketo Variables added to index.html`,
      (resolve) => {
        _postbuildMarketoVariables(resolve, paths, ejsVars);
      }
    );
    let marketoVariablesComplete = await marketoVariables;
  }
}

function _postbuildMarketoVariables(callback, paths, config) {
  const options = {
    config: config,
  };

  g.log('dump', config.variables, true);

  if (config.variables.head) {
    ejs.renderFile(
      `${paths.wb.templates}_html/marketo_vars.ejs`,
      { metaVars: [], variables: config.variables.head },
      {},
      function (err, headString) {
        if (err) {
          g.log('warn', err);
        }
        g.log('verbose', `Compiled marketo values for <head>`, verbose);
        g.log('dump', headString, verbose);

        if (config.variables.body) {
          ejs.renderFile(
            `${paths.wb.templates}_html/marketo_vars.ejs`,
            { metaVars: config.variables.head, variables: config.variables.body },
            {},
            function (err, bodyString) {
              if (err) {
                g.log('warn', err);
              }
              g.log('verbose', `Compiled marketo values for <body>`, verbose);
              g.log('dump', bodyString, verbose);

              if (fs.existsSync('./dist/index.html')) {
                const indexFile = fs.readFileSync('./dist/index.html', 'utf8');

                if (indexFile) {
                  const updatedIndexFile = indexFile
                    .replace(`</head>`, `${headString}</head>`)
                    .replace(`<body>`, `<body><div id="marketo_variables" class="hidden">${bodyString}</div>`);

                  g.log('dump', updatedIndexFile, verbose);
                  fs.renameSync('./dist/index.html', './dist/index_BACKUP.html');
                  fs.outputFile('./dist/index.html', updatedIndexFile, (err) => {
                    if (!err) {
                      callback();
                    }
                  });
                }
              }
            }
          );
        } else {
          g.log('warn', `Object for variables.body missing`);
        }
      }
    );
  } else {
    g.log('warn', `Object for variables.head missing`);
  }
}

run();
