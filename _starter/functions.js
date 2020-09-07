// LIBRARY FUNCTIONS
let methods = {};

// import node modules
const _ = require('lodash'),
  chalk = require('chalk'),
  Color = require('color'),
  ejs = require('ejs'),
  exec = require('child_process'),
  fs = require('fs-extra'),
  glob = require('glob-all'),
  path = require('path'),
  plugin = require('tailwindcss/plugin'),
  requestSync = require('sync-request');

// Synchronously run a function and wait for a callback to fire
methods.asyncFunction = async function asyncFunction(startMessage, endMessage, func) {
  methods.log('title', startMessage);

  const p = await new Promise(resolve => {
    func(resolve);
  }).then(() => '');
  methods.log('title', endMessage);
  return p;
};

// display a message in the command line
methods.log = function log(type = 'message', message, verbose = false) {
  switch (type) {
    case 'app':
      console.log(chalk.bgRgb(230, 20, 20)(`  ${message}  `));
      break;
    case 'dump':
      if (verbose) {
        console.log(chalk.magenta.bold(`📦 ${JSON.stringify(message, null, 2)}`));
      }
      break;
    case 'running':
      console.log(chalk.green.bold(`💻 ${chalk.green(message)}`));
      break;
    case 'title':
      console.log(chalk.blue.bold(`🛠 ${message}`));
      break;
    case 'verbose':
      if (verbose) {
        console.log(chalk.keyword('orange')(`👓 ${message}`));
      }
      break;
    case 'warn':
      console.warn(chalk.red.bold(`❗️ ${message}`));
      break;
    default:
      console.log(message);
  }
};

// parse process arguments into an array format
methods.parseArgv = function parseArgv() {
  let args = [];
  let options = {};

  process.argv.forEach(function(arg, i) {
    if (i > 1) {
      if (arg.substr(0, 2) === '--') {
        // remove leading dashes
        const str = arg.substr(2);

        // split out to key/value pairs
        if (str.indexOf('=') !== -1) {
          const strSplit = str.split('=');
          options[strSplit[0]] = strSplit[1];
        } else {
          options[str] = true;
        }
      } else {
        args.push(arg);
      }
    }
  });

  return {
    args: args,
    options: options,
  };
};


// POSTBUILD
methods.postbuildMarketoVariables = function postbuildMarketoVariables(callback, paths, config, verbose) {
  const options = {
    config: config,
  };

  methods.log('dump', config.variables, true);

  if (config.variables.head) {
    ejs.renderFile(`${paths.starter.templates}_html/marketo_vars.ejs`, { metaVars: [], variables: config.variables.head }, {}, function(err, headString) {
      if (err) {
        methods.log('warn', err);
      }
      methods.log('verbose', `Compiled marketo values for <head>`, verbose);
      methods.log('dump', headString, verbose);

      if (config.variables.body) {
        ejs.renderFile(`${paths.starter.templates}_html/marketo_vars.ejs`, { metaVars: config.variables.head, variables: config.variables.body }, {}, function(err, bodyString) {
          if (err) {
            methods.log('warn', err);
          }
          methods.log('verbose', `Compiled marketo values for <body>`, verbose);
          methods.log('dump', bodyString, verbose);

          if (fs.existsSync('./dist/index.html')) {
            const indexFile = fs.readFileSync('./dist/index.html', 'utf8');

            if (indexFile) {
              const updatedIndexFile = indexFile.replace(`</head>`, `${headString}</head>`).replace(`<body>`, `<body><div id="marketo_variables" class="hidden">${bodyString}</div>`);

              methods.log('dump', updatedIndexFile, verbose);
              fs.renameSync('./dist/index.html', './dist/index_BACKUP.html');
              fs.outputFile('./dist/index.html', updatedIndexFile, (err) => {
                if (!err) {
                  callback();
                }
              });
            }
          }
        });
      } else {
        methods.log('warn', `Object for variables.body missing`);
      }
    });
  } else {
    methods.log('warn', `Object for variables.head missing`);
  }
};


// PREBUILD
methods.prebuildClean = function prebuildClean(callback, paths, verbose) {
  glob(`${paths.js.src}automated/dev/**/*`, function(er, files) {
    methods.log('verbose', `Removing Files: ${JSON.stringify(files, null, 2)}`, verbose);
    let count = files.length;

    if (count > 0) {
      files.forEach((item) => {
        fs.remove(item, err => {
          if (err) {
            return console.error(err);
          }

          count--;
          if (count === 0) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  });
};

methods.prebuildComponentDocs = function prebuildComponentDocs(callback, paths, wb, verbose) {
  glob(`${paths.components.src}**/demo.vue`, function(er, files) {
    methods.log('verbose', `Docs Files: ${JSON.stringify(files, null, 2)}`, verbose);
    let components = [];
    let count = files.length;
    files.forEach((item) => {
      components.push(path.dirname(item).split(path.sep).pop());
    });

    const options = {
      components: components,
      wb: wb,
    };

    ejs.renderFile(`${paths.starter.templates}_vue/ComponentDocs.vue`, options, {}, function(err, str) {
      if (err) {
        methods.log('warn', err);
      }
      fs.outputFile(paths.js.src + 'automated/ComponentDocs.vue', str, (err) => {
        if (!err) {
          methods.log('verbose', `Component Docs template created.`, verbose);
          callback();
        }
      });
    });
  });
};

methods.prebuildComponentDocsList = function prebuildComponentDocsList(callback, paths, wb, verbose) {
  glob(`${paths.components.src}**/demo.vue`, function(er, files) {
    methods.log('verbose', `Docs Files for List: ${JSON.stringify(files, null, 2)}`, verbose);
    let components = [];
    files.forEach((item) => {
      components.push(path.dirname(item).split(path.sep).pop());
    });

    components.sort(function(x, y) {
      return x == 'general' ? -1 : y == 'general' ? 1 : 0;
    });

    const options = {
      components: components,
      wb: wb,
    };

    ejs.renderFile(`${paths.starter.templates}_js/docs.js`, options, {}, function(err, str) {
      if (err) {
        methods.log('warn', err);
      }
      fs.outputFile(paths.js.src + 'automated/docs.js', str, (err) => {
        if (!err) {
          methods.log('verbose', `JS templates compiled: docs.js`, verbose);
          callback();
        }
      });
    });
  });
};

methods.prebuildConfigToEsm = function prebuildConfigToEsm(callback, paths, config, outputFilename, verbose) {
  const options = {
    config: config,
  };

  ejs.renderFile(`${paths.starter.templates}_js/config.js`, options, {}, function(err, str) {
    if (err) {
      methods.log('warn', err);
    }
    fs.outputFile(paths.js.src + `automated/${outputFilename}.js`, str, (err) => {
      if (!err) {
        methods.log('verbose', `JS templates compiled: automated/${outputFilename}.js`, verbose);
        callback();
      }
    });
  });
};

methods.prebuildCssTemplates = function prebuildCssTemplates(callback, paths, ejsVars, verbose) {
  methods.log('dump', ejsVars);
  // Process color object so that nested shades are on the top level
  ejsVars.colors = {};
  const themeColors = ejsVars.wb.colors;
  Object.keys(themeColors).forEach((schemeKey) => {
    Object.keys(themeColors[schemeKey]).forEach((colorKey) => {
      if (!ejsVars.colors[schemeKey]) {
        ejsVars.colors[schemeKey] = {};
      }
      if (typeof themeColors[schemeKey][colorKey] === 'string') {
        if (themeColors[schemeKey][colorKey].startsWith('var(')) {
          ejsVars.colors[schemeKey][colorKey] = themeColors[schemeKey][colorKey];
        } else {
          const color = Color(themeColors[schemeKey][colorKey]);
          const hsl = color.hsl().object();
          ejsVars.colors[schemeKey][colorKey] = { hsl: `${hsl.h}, ${hsl.s}%, ${hsl.l}%`, alpha: color.alpha() };
        }
      } else {
        Object.keys(themeColors[schemeKey][colorKey]).forEach((shadeKey) => {
          if (themeColors[schemeKey][colorKey][shadeKey].startsWith('var(')) {
            ejsVars.colors[schemeKey][`${colorKey}-${shadeKey}`] = themeColors[schemeKey][colorKey][shadeKey];
          } else {
            const color = Color(themeColors[schemeKey][colorKey][shadeKey]);
            const hsl = color.hsl().object();
            ejsVars.colors[schemeKey][`${colorKey}-${shadeKey}`] = { hsl: `${hsl.h}, ${hsl.s}%, ${hsl.l}%`, alpha: color.alpha() };
          }
        });
      }
    });
  });

  // Process CSS Templates
  glob(`${paths.starter.templates}_css/*.{css,scss}`, function(er, files) {
    methods.log('verbose', `CSS templates: ${JSON.stringify(files, null, 2)}`, verbose);
    let count = files.length;
    files.forEach((item) => {
      ejs.renderFile(item, ejsVars, {}, function(err, str) {
        if (err) {
          methods.log('warn', err);
        }
        fs.outputFile(paths.css.src + 'automated/' + path.basename(item), str, (err) => {
          if (!err) {
            methods.log('verbose', `CSS templates compiled: ${item}`, verbose);
            count--;
            if (count === 0) {
              callback();
            }
          }
        });
      });
    });
  });
};

methods.prebuildIconMethods = function prebuildIconMethods(callback, paths, verbose) {
  glob(`${paths.icon.src}**/*.svg`, function(er, files) {
    methods.log('verbose', `Icon Files: ${JSON.stringify(files, null, 2)}`, verbose);
    let svgs = [];
    files.forEach((item) => {
      svgs.push({
        name: path.basename(item, '.svg'),
        path: item,
      });
    });

    const options = {
      svgs: svgs,
      paths: paths,
    };

    ejs.renderFile(`${paths.starter.templates}_js/svg.js`, options, {}, function(err, str) {
      if (err) {
        methods.log('warn', err);
      }
      fs.outputFile(paths.js.src + 'automated/svg.js', str, (err) => {
        if (!err) {
          methods.log('verbose', `JS templates compiled: svg.js`, verbose);
          callback();
        }
      });
    });
  });
};

methods.prebuildScssIncludes = function prebuildScssIncludes(callback, paths, verbose) {
  glob(`${paths.components.src}**/*.css`, function(er, files) {
    methods.log('verbose', `SCSS Files: ${JSON.stringify(files, null, 2)}`, verbose);
    let data = '';
    files.forEach((item) => {
      data += `@import "../../_components/${item.replace(paths.components.src, '')}";
`;
    });
    methods.log('verbose', data, verbose);

    if (data) {
      const scssIncludesPath = paths.css.src + 'automated/_components.css';
      fs.outputFile(scssIncludesPath, data, (err) => {
        if (!err) {
          methods.log('verbose', `Writing combined SCSS files to: ${scssIncludesPath}`, verbose);
          callback();
        }
      });
    } else {
      callback();
    }
  });
};

methods.prebuildScraper = function prebuildScraper(callback, paths, options, verbose) {
  let count = options.pages.length;

  if (count > 0) {
    options.pages.forEach((page) => {

      if (page.dist && page.src) {
        methods.log('verbose', `Scraping page: ${page.src}`, verbose);
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
          methods.log('verbose', `Wrote file: ${page.dist}`, verbose);

          // Extract URLs form sitemap index and parse secondary pages
          if (page.type === 'sitemap') {
            methods.log('verbose', `Extracting sitemap URLs from ${page.src}`, verbose);
            const removedDates = request.body.toString().replace(/(<lastmod>(.....)+<\/lastmod>)/ig,"");
            const removedTags = removedDates.replace(/(<([^>]+)>)/ig,",");
            const replacedRoots = removedTags.replace(new RegExp(page.sitemapRootSrc,"g"),page.sitemapRootDist);
            const subSitemaps = replacedRoots.split(',').filter((item) => item !== '');

            if (subSitemaps) {
              subSitemaps.forEach((subPage) => {
                const subPageRequest = requestSync('GET', subPage);

                if (subPageRequest.statusCode === 200) {
                  fs.outputFileSync(subPage.replace(page.sitemapRootDist, paths.starter.static), subPageRequest.body);
                }
              });
            }
            methods.log('dump', subSitemaps, verbose);
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

  // glob(`${paths.js.src}automated/dev/**/*`, function(er, files) {
  //   methods.log('verbose', `Removing Files: ${JSON.stringify(files, null, 2)}`, verbose);
  //   let count = files.length;
  //
  //   if (count > 0) {
  //     files.forEach((item) => {
  //       fs.remove(item, err => {
  //         if (err) {
  //           return console.error(err);
  //         }
  //
  //         count--;
  //         if (count === 0) {
  //           callback();
  //         }
  //       });
  //     });
  //   } else {
  //     callback();
  //   }
  // });
};

methods.prebuildWbConfig = function prebuildWbConfig(callback, paths, wb, verbose) {
  const clonedWb = Object.assign({}, wb);
  delete clonedWb.paths;

  const options = {
    config: clonedWb,
  };

  ejs.renderFile(`${paths.starter.templates}_js/config.js`, options, {}, function(err, str) {
    if (err) {
      methods.log('warn', err);
    }
    fs.outputFile(paths.js.src + 'automated/wb.js', str, (err) => {
      if (!err) {
        methods.log('verbose', `JS templates compiled: wb.js`, verbose);
        callback();
      }
    });
  });
};

methods.slugify = function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

methods.snake = function snake(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '_')           // Replace spaces with _
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '_')         // Replace multiple - with single _
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// Determine if a command should be displayed in terminal when running shell commands
methods.verboseExec = function verboseExec(command, verbose = false) {
  if (verbose) {
    methods.log('running', command);
    exec.spawnSync(command, [], { stdio: 'inherit', shell: true });
  } else {
    exec.execSync(`${command} > /dev/null 2>&1`);
  }
};

// INIT
module.exports = methods;
