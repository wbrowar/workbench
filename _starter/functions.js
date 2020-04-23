// LIBRARY FUNCTIONS
let methods = {};

// import node modules
const _ = require('lodash'),
  chalk = require('chalk'),
  ejs = require('ejs'),
  exec = require('child_process'),
  fs = require('fs-extra'),
  glob = require('glob-all'),
  path = require('path'),
  plugin = require('tailwindcss/plugin');

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

  methods.log('dump', config.wb.marketo.variables, true);

  if (config.wb.marketo.variables.head) {
    ejs.renderFile(`${paths.starter.templates}_html/marketo_vars.ejs`, { metaVars: [], variables: config.wb.marketo.variables.head }, {}, function(err, headString) {
      if (err) {
        methods.log('warn', err);
      }
      methods.log('verbose', `Compiled marketo values for <head>`, verbose);
      methods.log('dump', headString, verbose);

      if (config.wb.marketo.variables.body) {
        ejs.renderFile(`${paths.starter.templates}_html/marketo_vars.ejs`, { metaVars: config.wb.marketo.variables.head, variables: config.wb.marketo.variables.body }, {}, function(err, bodyString) {
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
        methods.log('warn', `Object for wb.marketo.variables.body missing`);
      }
    });
  } else {
    methods.log('warn', `Object for wb.marketo.variables.head missing`);
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
        ejsVars.colors[schemeKey][colorKey] = themeColors[schemeKey][colorKey];
      } else {
        Object.keys(themeColors[schemeKey][colorKey]).forEach((shadeKey) => {
          ejsVars.colors[schemeKey][`${colorKey}-${shadeKey}`] = themeColors[schemeKey][colorKey][shadeKey];
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

methods.prebuildPrettier = function prebuildPrettier(options, file = null, verbose) {
  methods.log('title', `Running Prettier`);

  let files = false;

  if (file) {
    if (glob.sync(options.files).includes(file)) {
      files = file;
    }
  } else {
    if (glob.sync(options.files).length > 0) {
      files = options.files;
    }
  }

  if (files) {
    methods.verboseExec(`prettier --config ./.prettierrc ${options.options || ''} "${files}"`, verbose);
    methods.log('title', `Prettier Ran`);
  } else {
    methods.log('title', `Prettier Ran but No Files Were Updated`);
  }
};

methods.prebuildScssIncludes = function prebuildScssIncludes(callback, paths, verbose) {
  glob(`${paths.components.src}**/*.scss`, function(er, files) {
    methods.log('verbose', `SCSS Files: ${JSON.stringify(files, null, 2)}`, verbose);
    let data = '';
    files.forEach((item) => {
      data += `@import "Components/${item.replace(paths.components.src, '')}";
`;
    });
    methods.log('verbose', data, verbose);

    if (data) {
      const scssIncludesPath = paths.css.src + 'automated/_components.scss';
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

methods.prebuildTailwindConfig = function prebuildTailwindConfig(callback, paths, config, verbose) {
  const options = {
    config: config,
  };

  ejs.renderFile(`${paths.starter.templates}_js/tailwind.js`, options, {}, function(err, str) {
    if (err) {
      methods.log('warn', err);
    }
    fs.outputFile(paths.js.src + 'automated/tailwind.js', str, (err) => {
      if (!err) {
        methods.log('verbose', `JS templates compiled: tailwind.js`, verbose);
        callback();
      }
    });
  });
};

methods.prebuildWbConfig = function prebuildWbConfig(callback, paths, wb, verbose) {
  const options = {
    wb: wb,
  };

  ejs.renderFile(`${paths.starter.templates}_js/wb.js`, options, {}, function(err, str) {
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

// Prepare theme options from wb.config.js for tailwind.config.js
methods.tailwindConfig = function tailwindConfig(wb) {
  let colorsList = [];
  let colors = {};
  let fontFamily = {};
  let opacity = {};
  let plugins = [];
  let screens = {};

  // Prepare colors for Tailwind
  const themeColors = wb.colors.default;
  // Add Docs colors
  if (wb.enableDocs) {
    _.merge(themeColors, {
      'dev-gray': {
        '100': '#f5f5f5',
        '200': '#eeeeee',
        '300': '#e0e0e0',
        '400': '#bdbdbd',
        '500': '#9e9e9e',
        '600': '#757575',
        '700': '#616161',
        '800': '#424242',
        '900': '#212121',
      }
    });
  }
  Object.keys(themeColors).forEach((colorKey) => {
    if (typeof themeColors[colorKey] === 'string') {
      colors[colorKey] = `var(--color-${colorKey})`;
      colorsList.push(colorKey);
    } else {
      if (!colors[colorKey]) {
        colors[colorKey] = {};
      }
      Object.keys(themeColors[colorKey]).forEach((shadeKey) => {
        colors[colorKey][shadeKey] = `var(--color-${colorKey}-${shadeKey})`;
        colorsList.push(`${colorKey}-${shadeKey}`);
      });
    }
  });

  // Prepare font families for Tailwind
  Object.keys(wb.fonts).forEach((fontKey) => {
    fontFamily[fontKey] = wb.fonts[fontKey]['fontStack'];
  });

  // Prepare opacity values for Tailwind
  Object.keys(wb.opacity).forEach((key) => {
    opacity[key] = wb.opacity[key];
  });

  // Add plugins
  plugins.push(
    plugin(function({ addVariant, e }) {
      addVariant('animated', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`animated${separator}${className}`)}.animated`;
        });
      });
    }),
    plugin(function({ addUtilities }) {
      let newUtilities = {};

      colorsList.forEach((color) => {
        Object.keys(wb.opacity).forEach((opacityKey) => {
          newUtilities[`.bg-${color}-${opacityKey}`] = {
            backgroundColor: `hsla(var(--color-${color}-hsl), ${wb.opacity[opacityKey]});`,
          };
          newUtilities[`.text-${color}-${opacityKey}`] = {
            color: `hsla(var(--color-${color}-hsl), ${wb.opacity[opacityKey]});`,
          };
          newUtilities[`.border-${color}-${opacityKey}`] = {
            borderColor: `hsla(var(--color-${color}-hsl), ${wb.opacity[opacityKey]});`,
          };
        });
      });

      addUtilities(newUtilities, {
        variants: ['responsive', 'hover', 'focus', 'active', 'group-hover', 'animated'],
      });
    }),
  );
  wb.tailwindPlugins.forEach((item) => {
      plugins.push(plugin(item));
  });

  // Prepare media queries for Tailwind
  Object.keys(wb.mq).forEach((mqKey) => {
    screens[mqKey] = `${wb.mq[mqKey]}px`;
  });

  return _.merge({
    theme: {
      colors: colors,
      fontFamily: fontFamily,
      opacity: opacity,
      screens: screens,
    },
    plugins: plugins,
  }, wb.tailwind);

  fs.outputFile(paths.js.src + 'automated/tailwind.config.js', str, (err) => {
    if (!err) {
      methods.log('verbose', `Component Docs template created.`, verbose);
      callback();
    }
  });
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