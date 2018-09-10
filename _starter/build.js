// import node modules
const browserSync = require('browser-sync').create(),
      critical = require('critical'),
      chalk = require('chalk'),
      exec = require('child_process'),
      ejs = require('ejs'),
      favicons = require('favicons'),
      fs = require('fs-extra'),
      glob = require('glob'),
      inquirer = require('inquirer'),
      notifier = require('node-notifier'),
      path = require('path'),
      sass = require('node-sass'),
      sassGlobImporter = require('node-sass-glob-importer'),
      semver = require('semver'),
      webpack = require('webpack');

// set variables
let env = process.env.NODE_ENV || 'development',
    release = env === 'production',
    runBuild,
    runPublish,
    runWatch,
    verbose; // whether or not commands are displayed in terminal output

// load package file
let pkg = require(`${ process.cwd() }/package.json`);
let paths = getPaths(pkg.paths),
    version = getVersion(pkg.version, env);

// set variables to be processed by EJS
let ejsVars = Object.assign({
    favicons: [],
    pkg: pkg,
    filenameVersion: filenameVersion('.'),
    release: release,
    version: version,
}, pkg.ejsVars);

// set notify configs
const notify = {
    icon: `${ pkg.paths.base.src }_favicon/favicon.png`,
    name: pkg.name,
};

async function run() {
    // HELLO
    log('app', `Beginning`);

    // INIT
    // get command line arguments and set default config variables
    const argv = parseArgv();
    runBuild   = argv.options.build || false;
    runPublish = argv.options.publish || false;
    runWatch   = argv.options.watch || false;
    verbose    = pkg.verboseOverride || argv.options.verbose || false;

    // backup package file then overwrite the version number
    if (release) {
        log('title', `Bumping version number`);
        version = bumpVersion(pkg.version);
        pkg.version = version;
        ejsVars.pkg = pkg;

        fs.copy(`${ process.cwd() }/package.json`, `${ paths.starter.backups }package.json`)
            .then(() => {
                fs.outputFile(`${ process.cwd() }/package.json`, JSON.stringify(pkg, null, 2), function (err) {
                    if (err) return console.log(err);
                    log('verbose', `Version changed to: ${ version }`, verbose);
                });
            })
            .catch(err => console.error(err))
    }

    // run build tasks
    if (runBuild) {
        log('title', `Running Build`);

        const buildCleanAll                  = clean();
        let buildCleanComplete               = await buildCleanAll;

        if (release) {
            const buildCompileFavicon        = compileFavicon();
            let buildCompileFaviconComplete  = await buildCompileFavicon;
        }

        const buildCompileCssTemplates       = compileCssTemplates();
        const buildUpdateComponents          = updateComponents();

        let buildCompileCssTemplatesComplete = await buildCompileCssTemplates;
        let buildUpdateComponentsComplete    = await buildUpdateComponents;

        const buildCompileCss                = compileCss();
        const buildCompileJs                 = compileJs();
        const buildCompileTemplates          = compileTemplates();

        let buildCompileCssComplete          = await buildCompileCss;
        let buildCompileJsComplete           = await buildCompileJs;
        let buildCompileTemplatesComplete    = await buildCompileTemplates;

        if (!runWatch) {
            const buildCleanComponents       = clean('components');
            let buildCleanComponentsComplete = await buildCleanComponents;
        }

        notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Build Complete' });
    }

    if (runPublish) {
        log('title', `Running Publish`);

        const publishQuestions = [
            {
                type: 'confirm',
                name: 'enableTag',
                message: 'Tag commit for release?',
                default: false,
            },
            {
                type: 'input',
                name: 'message',
                message: 'Commit message',
                default: (answers) => {
                    return answers.enableTag ? `Version ${ version }` : '';
                },
                validate: (answer) => {
                    return answer !== '';
                },
            },
            {
                type: 'input',
                name: 'tag',
                message: 'Release tag',
                default: (answers) => {
                    return version;
                },
                validate: (answer) => {
                    return answer !== '';
                },
                when: (answers) => {
                    return answers.enableTag;
                },
            },
        ];

        const askPublishQuestions = await inquirer.prompt(publishQuestions).then(function (answers) {
            log('verbose', `Component Options: ${ JSON.stringify(answers, null, 2) }`, verbose);
        });

        notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Project Published' });
    } else if (runWatch) {
        log('title', `Running Watch`);

        if (pkg.browserSync.url === 'CHANGE_ME') {
            $.gutil.log($.gutil.colors.inverse(' Browsersync is not set up, yet. Add your local site URL to the Browsersync setting in package.json. '));
        } else {
            browserSync.init({
                browser: pkg.browserSync.browser,
                proxy: pkg.browserSync.url,
            });
        }

        const watchCss = watch(paths.css.src, async () => {
            const watchCompileCss       = compileCss();
            let watchCompileCssComplete = await watchCompileCss;
            notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'CSS Updated' });
        });

        const watchComponents = watch(paths.components.src, async () => {
            const watchUpdateComponents          = updateComponents();
            let watchUpdateComponentsComplete    = await watchUpdateComponents;

            const watchCompileCssTemplates       = compileCssTemplates();
            let watchCompileCssTemplatesComplete = await watchCompileCssTemplates;

            browserSync.reload();
            notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Components Updated' });
        });

        const watchIcon = watch(paths.icon.src, async () => {
            // const watchCompileIcon       = compileIcon();
            // let watchCompileIconComplete = await watchCompileIcon;
            browserSync.reload();
            notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Icons Updated' });
        });

        const watchImg = watch(paths.img.src, async () => {
            // const watchCompileImg       = compileImg();
            // let watchCompileImgComplete = await watchCompileImg;
            browserSync.reload();
            notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'JS Updated' });
        });

        const watchJs = watch(paths.js.src, async () => {
            const watchCompileJs       = compileJs();
            let watchCompileJsComplete = await watchCompileJs;
            browserSync.reload();
            notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'JS Updated' });
        });

        const watchTemplates = watch(paths.templates.src, async () => {
            const watchCompileTemplates       = compileTemplates();
            let watchCompileTemplatesComplete = await watchCompileTemplates;
            browserSync.reload();
            notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Templates Updated' });
        });
    }


    // BYE
    if (!runWatch) {
        log('app', `End`);
    }
}


async function clean(type = 'all') {
    log('title', `Cleaning ${ type }`);

    const p = await new Promise(resolve => {
        let cleanPaths = [];

        switch (type) {
            case 'components':
                cleanPaths.push(paths.css.src + 'components');
                cleanPaths.push(paths.js.src + 'components');
                cleanPaths.push(paths.templates.src + 'components');
                break;
            case 'css':
                cleanPaths.push(paths.css.dist + `**/*`);
                break;
            case 'icon':
                cleanPaths.push(paths.icon.dist + `**/*`);
                break;
            case 'img':
                cleanPaths.push(paths.img.dist + `**/*`);
                break;
            case 'js':
                cleanPaths.push(paths.js.dist + `**/*`);
                break;
            case 'templates':
                cleanPaths.push(paths.templates.dist + `**/*.{${ pkg.templateExtensions }}`);
                break;
            default:
                cleanPaths.push(paths.css.src + 'components/**/*');
                cleanPaths.push(paths.js.src + 'components/**/*');
                cleanPaths.push(paths.templates.src + 'components/**/*');
                cleanPaths.push(paths.css.dist + `**/*`);
                cleanPaths.push(paths.icon.dist + `**/*`);
                cleanPaths.push(paths.img.dist + `**/*`);
                cleanPaths.push(paths.js.dist + `**/*`);
                cleanPaths.push(paths.templates.dist + `**/*.{${ pkg.templateExtensions }}`);
        }

        let tasks = cleanPaths.length; // count of tasks below
        let removeTaskIndex = () => {
            tasks--;
            if (tasks === 0) {
                resolve();
            }
        };
        cleanPaths.forEach((pattern) => {
            glob(pattern, function (er, files) {
                let count = files.length;
                if (count > 0) {
                    files.forEach((item) => {
                        fs.remove(item, err => {
                            if (err) return console.error(err);
                            log('verbose', `Deleted: ${ item }`, verbose);
                            count--;
                            if (count === 0) {
                                removeTaskIndex();
                            }
                        })
                    });
                } else {
                    removeTaskIndex();
                }
            });
        });
    }).then(()=>'');
    log('title', `${ type } Cleaned`);
    return p;
}

async function compileCssTemplates() {
    log('title', `Moving CSS Components`);

    const p = await new Promise(resolve => {
        glob(`${ paths.starter.templates }_css/*.{css,scss}`, function (er, files) {
            log('verbose', `CSS templates: ${ JSON.stringify(files, null, 2) }`, verbose);
            let count = files.length;
            files.forEach((item) => {
                ejs.renderFile(item, ejsVars, {}, function(err, str) {
                    fs.outputFile(paths.css.src + 'automated/' + path.basename(item), str, (err) => {
                        if(!err){
                            log('verbose', `CSS templates compiled: ${ item }`, verbose);
                        }
                        count--;
                        if (count === 0) {
                            resolve();
                        }
                    });
                });
            });
        });
    }).then(() => '');
    log('title', `CSS Components Moved`);
    return p;
}
async function compileCss() {
    log('title', `Compiling CSS`);

    const p = await new Promise(resolve => {
        glob(`${ paths.css.src }/*.scss`, async function (er, files) {
            let compileTemplatesComplete = await compileTemplates;
            files.forEach((item) => {
                log('verbose', `CSS: compiling ${ item }`, verbose);

                sass.render({
                    file: item,
                    importer: sassGlobImporter(),
                    outputStyle: release ? 'compressed' : 'expanded',
                }, function(error, result) { // node-style callback from v3.0.0 onwards
                    if (error) {
                        log('verbose', `SASS Error: ${ error.status }`); // used to be "code" in v2x and below
                        log('verbose', `SASS Error: ${ error.column }`);
                        log('verbose', `SASS Error: ${ error.message }`);
                        log('verbose', `SASS Error: ${ error.line }`);
                    }
                    else {
                        const outputFilename = `${ paths.css.dist }${ path.basename(item, path.extname(item)) }${ filenameVersion('.') }.css`;
                        fs.outputFile(outputFilename, result.css, (err) => {
                            if(!err){
                                log('verbose', `SASS compiled: ${ item } → ${ outputFilename }`, verbose);
                            }
                        });

                        resolve();
                    }
                });
            });
        });
    }).then(() => '');
    log('title', `CSS Compiled`);
    return p;
}

async function compileFavicon() {
    log('title', `Generating Favicons`);

    const p = await new Promise(resolve => {
        favicons(`${ paths.favicon.src }favicon.png`, {
            path: `${ pkg.paths.base.siteUrl }favicon/`,
            background: "#fff",
            theme_color: "#fff",
            version: version,
        }, (error, response) => {
            let tasks = 2; // count of tasks below
            let removeTaskIndex = () => {
                tasks--;
                if (tasks === 0) {
                    resolve();
                }
            };

            // array of favicon meta tags
            ejsVars.favicons = response.html;

            let countImages = response.images.length;
            response.images.forEach((item) => {
                fs.outputFile(paths.favicon.dist + item.name, item.contents, function (err) {
                    if (err) return console.log(err);
                    log('verbose', `Favicon icon moved: ${ item.name }`, verbose);
                    countImages--;
                    if (countImages === 0) {
                        removeTaskIndex();
                    }
                });
            });

            let countFiles = response.files.length;
            response.files.forEach((item) => {
                fs.outputFile(paths.favicon.dist + item.name, item.contents, function (err) {
                    if (err) return console.log(err);
                    log('verbose', `Favicon file moved: ${ item.name }`, verbose);
                    countFiles--;
                    if (countFiles === 0) {
                        removeTaskIndex();
                    }
                });
            });
        });
    }).then(()=>'');
    log('title', `Favicons Generated`);
    return p;
}

async function compileJs() {
    log('title', `Compiling JS`);

    const p = await new Promise(resolve => {
        if (pkg.webpack.entries.js || false) {
            let webpackConfig = require(process.cwd() + (release ? '/webpack.prod.js' : '/webpack.dev.js'));
            webpackConfig.forEach((item, key) => {
                const legacySuffix = item.output.filename === 'legacy' ? '-legacy' : '';
                item['entry'] = () => {
                    let entries = {};

                    // js files
                    for (const [key, value] of Object.entries(pkg.webpack.entries.js)) {
                        entries[key] = paths.js.src + value;
                    }

                    return entries;
                };
                item['output'] = {
                    chunkFilename: '[id].js',
                    filename: `[name]${ legacySuffix + filenameVersion('.') }.js`,
                    path: paths.js.dist,
                };
            });

            log('verbose', `JS Webpack config: ${ JSON.stringify(webpackConfig, null, 2) }`, verbose);

            webpack(webpackConfig, function (err, stats) {
                if (err || stats.hasErrors()) {
                    throw new Error(err);
                }

                log('verbose', `JS compiled: ${ stats.toString({
                    assets: true,
                    chunks: false,
                    chunkModules: false,
                    colors: true,
                    hash: false,
                    timings: false,
                    version: false
                })}`, verbose);

                resolve();
            });
        } else {
            throw new Error("A valid webpack config file is not provided. Point config.webpack to a valid webpack.config.json file.");
        }
    }).then(()=>'');
    log('title', `JS Compiled`);
    return p;
}

async function compileTemplates() {
    log('title', `Compiling Templates`);

    const p = await new Promise(resolve => {
        glob(`${ paths.templates.src }**/*.{${ pkg.templateExtensions }}`, function (er, files) {
            let count = files.length;
            files.forEach((item) => {
                ejs.renderFile(item, ejsVars, {}, function(err, str) {
                    fs.outputFile(item.replace(paths.templates.src, paths.templates.dist), str, (err) => {
                        if(!err){
                            log('verbose', `EJS compiled: ${ item }`, verbose);
                            count--;
                            if (count === 0) {
                                resolve();
                            }
                        }
                    });
                });
            });
        });
    }).then(()=>'');
    log('title', `Templates Compiled`);
    return p;
}

async function updateComponents() {
    log('title', `Updating Components`);

    const p = await new Promise(resolve => {
        let tasks = 3; // count of tasks below
        let removeTaskIndex = () => {
            tasks--;
            if (tasks === 0) {
                resolve();
            }
        };

        glob(`${ paths.components.src }**/*.${ pkg.projectTemplateLanguage }`, function (er, files) {
            let count = files.length;
            if (count > 0) {
                files.forEach((item) => {
                    fs.copy(item, `${ paths.templates.src }components/${ path.basename(item) }`).then(() => {
                        log('verbose', `Component template updated: ${ item }`, verbose);
                        count--;
                        if (count === 0) {
                            removeTaskIndex();
                        }
                    });
                });
            } else {
                removeTaskIndex();
            }
        });

        glob(`${ paths.components.src }**/*.{css,scss}`, function (er, files) {
            let count = files.length;
            if (count > 0) {
                files.forEach((item) => {
                    ejs.renderFile(item, ejsVars, {}, function(err, str) {
                        fs.outputFile(`${ paths.css.src }components/${ path.basename(item) }`, str, (err) => {
                            if(!err){
                                log('verbose', `Component style updated: ${ item }`, verbose);
                            }
                            count--;
                            if (count === 0) {
                                removeTaskIndex();
                            }
                        });
                    });
                });
            } else {
                removeTaskIndex();
            }
        });

        glob(`${ paths.components.src }**/*.{js,vue}`, function (er, files) {
            let count = files.length;
            if (count > 0) {
                files.forEach((item) => {
                    ejs.renderFile(item, ejsVars, {}, function(err, str) {
                        fs.outputFile(`${ paths.js.src }components/${ path.basename(item) }`, str, (err) => {
                            if(!err){
                                log('verbose', `Component script updated: ${ item }`, verbose);
                                count--;
                                if (count === 0) {
                                    removeTaskIndex();
                                }
                            }
                        });
                    });
                });
            } else {
                removeTaskIndex();
            }
        });
    }).then(()=>'');
    log('title', `Components Updated`);
    return p;
}

function watch(directory, callback) {
    if (fs.existsSync(directory)) {
        let fsWait = false;
        fs.watch(directory, { recursive: true }, (event, filename) => {
            if (filename) {
                if (fsWait) return;
                fsWait = setTimeout(() => {
                    fsWait = false;
                }, 500);
                callback(filename);
            }
        });
    }
}










// FUNCTIONS
// functions used within this script file
function filenameVersion(prefix = '', suffix = '') {
    return version ? prefix + version + suffix : '';
}





// LIBRARY FUNCTIONS
// todo: move these to an ES6 module for sharing with other library files
// synchronously crawls each file
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

// bump version
function bumpVersion(version, release = 'patch') {
    return semver.inc(version, release);
}

// get dist and src paths based on base path options
function getPaths(paths) {
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
            templates: process.cwd() + '/_starter/templates/',
        }
    }
}

// get version number based on build environment
function getVersion(version, env) {
    return release ? version : null;
}

// display a message in the command line
function log(type = 'message', message, verbose = false) {
    switch (type) {
        case 'app':
            console.log(chalk.bgRed(`  ${ message }  `));
            break;
        case 'dump':
            if (verbose) {
                console.log(chalk.magenta.bold(`Dump: ${ JSON.stringify(message, null, 2) }`) + chalk.red(message));
            }
            break;
        case 'running':
            console.log(chalk.green.bold('Running: ') + chalk.green(message));
            break;
        case 'title':
            console.log(chalk.blue.bold('[ ' + message + ' ]'));
            break;
        case 'verbose':
            if (verbose) {
                console.log(chalk.red.bold('Build: ') + chalk.red(message));
            }
            break;
        default:
            console.log(message);
    }
}

// parse process arguments into an array format
function parseArgv() {
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
}

function snake(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '_')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// determine if a command should be displayed in terminal when running shell commands
function verboseExec(command, verbose = false) {
    if (verbose) {
        log('running', command);
        exec.spawnSync(command, [], { stdio: 'inherit', shell: true });
    } else {
        exec.execSync(`${command} > /dev/null 2>&1`);
    }
}

// INIT
run();