// LIBRARY FUNCTIONS
let methods = {};

// import node modules
const chalk = require('chalk'),
      ejs = require('ejs'),
      exec = require('child_process'),
      fs = require('fs-extra'),
      glob = require('glob-all'),
      path = require('path'),
      semver = require('semver');

// synchronously crawls each file
methods.asyncForEach = async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
};

// Synchronously run a function and wait for a callback to fire
methods.asyncFunction = async function asyncFunction(startMessage, endMessage, func) {
    methods.log('title', startMessage);

    const p = await new Promise(resolve => {
        func(resolve);
    }).then(()=>'');
    methods.log('title', endMessage);
    return p;
};

// bump version
methods.bumpVersion = function bumpVersion(version, release = 'patch') {
    return semver.inc(version, release);
};

// get dist and src paths based on base path options
methods.getPaths = function getPaths(paths) {
    return {
        components: {
            src: process.cwd() + '/' + paths.base.src + paths.components.src,
        },
        css: {
            dist: process.cwd() + '/' + paths.base.dist + paths.css.dist,
            src: process.cwd() + '/' + paths.base.src + paths.css.src,
        },
        favicon: {
            dist: process.cwd() + '/' + paths.base.dist + paths.favicon.dist,
            src: process.cwd() + '/' + paths.base.src + paths.favicon.src,
        },
        icon: {
            dist: process.cwd() + '/' + paths.base.dist + paths.icon.dist,
            src: process.cwd() + '/' + paths.base.src + paths.icon.src,
        },
        img: {
            dist: process.cwd() + '/' + paths.base.dist + paths.img.dist,
            src: process.cwd() + '/' + paths.base.src + paths.img.src,
        },
        js: {
            dist: process.cwd() + '/' + paths.base.dist + paths.js.dist,
            src: process.cwd() + '/' + paths.base.src + paths.js.src,
        },
        templates: {
            dist: process.cwd() + '/' + paths.base.dist + paths.templates.dist,
            src: process.cwd() + '/' + paths.base.src + paths.templates.src,
        },
        starter: {
            backups: process.cwd() + '/_starter/backups/',
            build: process.cwd() + paths.base.build,
            components: process.cwd() + '/_starter/components/',
            templates: process.cwd() + '/_starter/templates/',
            styleInventory: process.cwd() + '/_starter/style_inventory/',
        }
    }
};

// get version number based on build environment
methods.getVersion = function getVersion(release, version) {
    return release ? version : null;
};

// display a message in the command line
methods.log = function log(type = 'message', message, verbose = false) {
    switch (type) {
        case 'app':
            console.log(chalk.bgRgb(230, 20, 20)(`  ${ message }  `));
            break;
        case 'dump':
            if (verbose) {
                console.log(chalk.magenta.bold(`📦 ${ JSON.stringify(message, null, 2) }`));
            }
            break;
        case 'running':
            console.log(chalk.green.bold(`💻 ${ chalk.green(message) }`));
            break;
        case 'title':
            console.log(chalk.blue.bold(`🛠 ${ message }`));
            break;
        case 'verbose':
            if (verbose) {
                console.log(chalk.keyword('orange')(`👓 ${ message }`));
            }
            break;
        case 'warn':
            console.warn(chalk.red.bold(`❗️ ${ message }`));
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
        if(i > 1) {
            if (arg.substr(0, 2) === "--") {
                // remove leading dashes
                const str = arg.substr(2);

                // split out to key/value pairs
                if (str.indexOf("=") !== -1) {
                    const strSplit = str.split('=');
                    options[strSplit[0]] = strSplit[1];
                } else {
                    options[str] = true;
                }
            }
            else {
                args.push(arg);
            }
        }
    });

    return {
        args: args,
        options: options
    }
};

methods.prebuildCssTemplates = function prebuildCssTemplates(callback, paths, ejsVars, verbose) {
    glob(`${ paths.starter.templates }_css/*.{css,scss}`, function (er, files) {
        methods.log('verbose', `CSS templates: ${ JSON.stringify(files, null, 2) }`, verbose);
        let count = files.length;
        files.forEach((item) => {
            ejs.renderFile(item, ejsVars, {}, function(err, str) {
                if (err) {
                    methods.log('warn', err);
                }
                fs.outputFile(paths.css.src + 'automated/' + path.basename(item), str, (err) => {
                    if(!err) {
                        methods.log('verbose', `CSS templates compiled: ${ item }`, verbose);
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

methods.prebuildPrettier = function prebuildPrettier(options, file = null, verbose) {
    methods.log('title', `Running Prettier`);

    let files = false;

    if (file) {
        if (glob.sync(options.files).includes(file)) {
            files = file;
        }
    } else {
        files = options.files;
    }

    if (files) {
        methods.verboseExec(`prettier --config ./.prettierrc ${ options.options || '' } "${ files }"`, verbose);
    }
    methods.log('title', `Prettier Ran`);
};

methods.prebuildScssIncludes = function prebuildScssIncludes(callback, paths, verbose) {
    glob(`${ paths.css.src }components/*.scss`, function (er, files) {
        methods.log('verbose', `SCSS Files: ${ JSON.stringify(files, null, 2) }`, verbose);
        let count = files.length;
        let data = '';
        files.forEach((item) => {
            data += `@import "components/${ path.basename(item) }";
`;
        });
        methods.log('verbose', data, verbose);

        if (data) {
            const scssIncludesPath = paths.css.src + '_default.scss';
            fs.outputFile(scssIncludesPath, data, (err) => {
                if(!err) {
                    methods.log('verbose', `Writing combined SCSS files to: ${ scssIncludesPath }`, verbose);
                    callback();
                }
            });
        } else {
            callback();
        }
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

// determine if a command should be displayed in terminal when running shell commands
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