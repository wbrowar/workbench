// import node modules
const autoprefixer = require('autoprefixer'),
      browserSync = require('browser-sync').create(),
      critical = require('critical'),
      chalk = require('chalk'),
      exec = require('child_process'),
      ejs = require('ejs'),
      favicons = require('favicons'),
      fs = require('fs-extra'),
      glob = require('glob'),
      inquirer = require('inquirer'),
      mqpacker = require("css-mqpacker"),
      notifier = require('node-notifier'),
      path = require('path'),
      postcss = require('postcss'),
      purgecss = require('@fullhuman/postcss-purgecss'),
      sass = require('node-sass'),
      sassGlobImporter = require('node-sass-glob-importer'),
      sharp = require('sharp'),
      semver = require('semver'),
      webpack = require('webpack');

// HELLO
log('app', `Beginning`);

// load package file
let pkg = require(`${ process.cwd() }/package.json`);

// set constants
const argv = parseArgv(),
      env = process.env.NODE_ENV || 'development',
      release = env === 'production';

// use CLI arguments to set variables
const enableImg  = argv.options.noimg ? false : true,
      runBuild   = argv.options.build || false,
      runPublish = argv.options.publish || false,
      runWatch   = argv.options.watch || false,
      verbose    = pkg.verboseOverride || argv.options.verbose || false;

// set variables based on pkg options
let paths = getPaths(pkg.paths),
    version = getVersion(pkg.version);

// set variables to be processed by EJS
let ejsVars = Object.assign({
    favicons: [],
    filenameVersion: filenameVersion('.'),
    paths: paths,
    pkg: pkg,
    release: release,
    version: version,
}, pkg.ejs);

// other variables
let publishAnswers = {};

// set notify configs
const notify = {
    icon: `${ pkg.paths.base.src }_favicon/favicon.png`,
    name: pkg.name,
};

async function run() {
    if (release) {
        const bumpPackageVersion       = bumpPackage();
        let bumpPackageVersionComplete = await bumpPackageVersion;
    }

    // ask questions related to build task
    if (runPublish) {
        const askPublishQuestions = asyncFunction(
            `Publish Options`, `Publish Options Set`, (resolve) => {

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

                inquirer.prompt(publishQuestions).then((answers) => {
                    log('verbose', `Publishing with settings:`, verbose);
                    log('dump', answers, verbose);

                    publishAnswers = answers;
                    resolve();
                });
            });
        let askPublishQuestionsComplete = await askPublishQuestions;
    }

    // run build tasks
    if (runBuild) {
        log('title', `Running Build`);

        const buildCleanAll                      = clean();
        let buildCleanComplete                   = await buildCleanAll;

        if (release) {
            const buildCompileFavicon            = compileFavicon();
            let buildCompileFaviconComplete      = await buildCompileFavicon;
        }

        const buildCompileCssTemplates           = compileCssTemplates();
        const buildUpdateComponents              = updateComponents();
        let buildCompileCssTemplatesComplete     = await buildCompileCssTemplates;
        let buildUpdateComponentsComplete        = await buildUpdateComponents;

        const buildCompileCss                    = compileCss();
        const buildCompileIcon                   = compileIcon();
        const buildCompileJs                     = compileJs();
        if (enableImg) {
            const buildCompileImg                = compileImg();
        }
        let buildCompileCssComplete              = await buildCompileCss;
        let buildCompileIconComplete             = await buildCompileIcon;
        let buildCompileJsComplete               = await buildCompileJs;
        if (enableImg && typeof buildCompileImg != 'undefined') {
            let buildCompileImgComplete          = await buildCompileImg;
        }

        const buildUpdateStyleInventory          = updateStyleInventory();
        let buildUpdateStyleInventoryComplete    = await buildUpdateStyleInventory;

        const buildCompileTemplates              = compileTemplates();
        let buildCompileTemplatesComplete        = await buildCompileTemplates;

        if (release) {
            const buildPostCss                   = postCss();
            let buildPostCssComplete             = await buildPostCss;

            const buildCritcss                   = critCss();
            let buildCritcssComplete             = await buildCritcss;
        }

        if (!runWatch) {
            const buildCleanComponents           = clean('components');
            const buildCleanStyleInventory       = clean('style_inventory');
            let buildCleanComponentsComplete     = await buildCleanComponents;
            let buildCleanStyleInventoryComplete = await buildCleanStyleInventory;
        }

        notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Build Complete' });
    }

    if (runPublish) {
        log('title', `Running Publish`);

        verboseExec(`git pull`, verbose);
        verboseExec(`git status`, verbose);
        verboseExec(`git add -A && git commit -m "${ publishAnswers.message }" && git push && git status`, verbose);

        if (publishAnswers.enableTag) {
            verboseExec(`git tag -a ${ publishAnswers.tag } -m "${ publishAnswers.message }"`, verbose);
            verboseExec(`git push --follow-tags`, verbose);
        }

        notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Project Published' });
    } else if (runWatch) {
        log('title', `Running Watch`);

        if (pkg.browserSync.url === 'CHANGE_ME') {
            log('warn', 'Browsersync is not set up, yet. Add your local site URL to the Browsersync setting in package.json.')
        } else {
            let changing = false;
            browserSync.watch(paths.css.src + '**/*', async (event, file) => {
                if (!changing && event === "change") {
                    changing = true;
                    const watchCompileCss       = compileCss();
                    let watchCompileCssComplete = await watchCompileCss;
                    browserSync.reload();
                    notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'CSS Updated' });
                    changing = false;
                }
            });

            browserSync.watch(paths.components.src + '**/*', async (event, file) => {
                if (!changing && event === "change") {
                    changing = true;
                    const watchUpdateComponents           = updateComponents();
                    let watchUpdateComponentsComplete     = await watchUpdateComponents;

                    const watchCompileCssTemplates        = compileCssTemplates();
                    let watchCompileCssTemplatesComplete  = await watchCompileCssTemplates;

                    const watchUpdateStyleInventory       = updateStyleInventory();
                    let watchUpdateStyleInventoryComplete = await watchUpdateStyleInventory;

                    const watchCompileCss                 = compileCss();
                    const watchCompileJs                  = compileJs();
                    const watchCompileTemplates           = compileTemplates();
                    let watchCompileCssComplete           = await watchCompileCss;
                    let watchCompileJsComplete            = await watchCompileJs;
                    let watchCompileTemplatesComplete     = await watchCompileTemplates;

                    browserSync.reload();
                    notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Components Updated' });
                    changing = false;
                }
            });

            browserSync.watch(paths.icon.src + '**/*', async (event, file) => {
                if (!changing && event === "change") {
                    changing = true;
                    const watchCompileIcon       = compileIcon();
                    let watchCompileIconComplete = await watchCompileIcon;
                    browserSync.reload();
                    notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Icons Updated' });
                    changing = false;
                }
            });

            browserSync.watch(paths.img.src + '**/*', async (event, file) => {
                if (!changing && event === "change") {
                    changing = true;
                    const watchCompileImg       = compileImg();
                    let watchCompileImgComplete = await watchCompileImg;
                    browserSync.reload();
                    notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Images Updated' });
                    changing = false;
                }
            });

            browserSync.watch(paths.js.src + '**/*', async (event, file) => {
                if (!changing && event === "change") {
                    changing = true;
                    const watchCompileJs       = compileJs();
                    let watchCompileJsComplete = await watchCompileJs;
                    browserSync.reload();
                    notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'JS Updated' });
                    changing = false;
                }
            });

            browserSync.watch(paths.templates.src + '**/*', async (event, file) => {
                if (!changing && event === "change") {
                    changing = true;
                    const watchCompileTemplates       = compileTemplates();
                    let watchCompileTemplatesComplete = await watchCompileTemplates;
                    browserSync.reload();
                    notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Templates Updated' });
                    changing = false;
                }
            });

            browserSync.init({
                browser: pkg.browserSync.browser,
                proxy: pkg.browserSync.url,
            });
        }
    }


    // BYE
    if (!runWatch) {
        log('app', `End`);
    }
}




async function bumpPackage() {
    log('title', `Increasing Version Number`);

    const p = await new Promise(resolve => {
        log('title', `Bumping version number`);
        version = bumpVersion(pkg.version);
        pkg.version = version;
        ejsVars.pkg = pkg;
        ejsVars.filenameVersion = filenameVersion('.');

        // backup package file then overwrite the version number
        fs.copy(`${ process.cwd() }/package.json`, `${ paths.starter.backups }package.json`, (err) => {
            if (err) {
                log('warn', err, verbose);
            }
            log('verbose', `Package File Backed Up`, verbose);
            fs.outputFile(`${ process.cwd() }/package.json`, JSON.stringify(pkg, null, 2), function (err) {
                if (err) {
                    log('warn', err, verbose);
                }
                log('verbose', `Version changed to: ${ version }`, verbose);
                resolve();
            });
        });
    }).then(()=>'');
    log('title', `Version Number Set to "${ version }"`);
    return p;
}

async function clean(type = 'all') {
    log('title', `Cleaning "${ type }"`);

    const p = await new Promise(resolve => {
        let cleanPaths = [];

        switch (type) {
            case 'components':
                cleanPaths.push(paths.css.src + `components`);
                cleanPaths.push(paths.js.src + `components`);
                cleanPaths.push(paths.templates.src + `components`);
                break;
            case 'css':
                cleanPaths.push(paths.css.dist + `**/*`);
                cleanPaths.push(paths.templates.src + `_css`);
                break;
            case 'icon':
                cleanPaths.push(paths.icon.dist + `**/*`);
                break;
            case 'img':
                if (enableImg) {
                    cleanPaths.push(paths.img.dist + `**/*`);
                }
                break;
            case 'js':
                cleanPaths.push(paths.js.dist + `**/*`);
                break;
            case 'templates':
                cleanPaths.push(paths.templates.dist + `**/*.{${ pkg.templateExtensions }}`);
                break;
            case 'style_inventory':
                cleanPaths.push(paths.templates.src + `dev/inv`);
                break;
            default:
                cleanPaths.push(paths.css.src + `components`);
                cleanPaths.push(paths.js.src + `components`);
                cleanPaths.push(paths.templates.src + `components`);
                cleanPaths.push(paths.css.dist + `**/*`);
                cleanPaths.push(paths.templates.src + `_css`);
                cleanPaths.push(paths.icon.dist + `**/*`);
                if (enableImg) {
                    cleanPaths.push(paths.img.dist + `**/*`);
                }
                cleanPaths.push(paths.js.dist + `**/*`);
                cleanPaths.push(paths.templates.dist + `**/*.{${ pkg.templateExtensions }}`);
                cleanPaths.push(paths.templates.src + `dev/inv`);
        }

        let tasks = cleanPaths.length;
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
    log('title', `"${ type }" Cleaned`);
    return p;
}

async function critCss() {
    log('title', `Starting Critical CSS`);

    const p = await new Promise(resolve => {
        let count = pkg.critcss.length;

        if (count > 0) {
            pkg.critcss.forEach((item) => {
                if (item.src !== 'CHANGE_ME') {
                    critical.generate({
                        css: [paths.css.dist + item.css + filenameVersion('.') + '.css'],
                        src: item.src,
                        dest: `${ paths.templates.dist }_css/critcss/${ item.filename }.css`,
                        include: item.include || [],
                        ignore: item.ignore || [],
                        width: item.width || 1440,
                        height: item.height || 900
                    }, function (err, output) {
                        if (err) {
                            log('warn', err);
                        }
                        log('verbose', `Critical CSS compiled: ${ item }`, verbose);
                        count--;
                        if (count === 0) {
                            resolve();
                        }
                    });
                } else {
                    count--;
                    if (count === 0) {
                        resolve();
                    }
                }
            });
        } else {
            resolve();
        }
    }).then(()=>'');
    log('title', `Critical CSS Generated`);
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
                    if (err) {
                        log('warn', err);
                    }
                    fs.outputFile(paths.css.src + 'automated/' + path.basename(item), str, (err) => {
                        if(!err) {
                            log('verbose', `CSS templates compiled: ${ item }`, verbose);
                            count--;
                            if (count === 0) {
                                resolve();
                            }
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
        glob(`${ paths.css.src }/*.scss`, function (er, files) {
            let count = files.length;
            files.forEach((item) => {
                log('verbose', `CSS: compiling ${ item }`, verbose);

                sass.render({
                    file: item,
                    importer: sassGlobImporter(),
                    outputStyle: release ? 'compressed' : 'expanded',
                }, function(error, result) { // node-style callback from v3.0.0 onwards
                    if (error) {
                        log('warn', `SASS Error: ${ error.file }`);
                        log('warn', `Line: ${ error.line }`);
                        log('warn', `Column: ${ error.column }`);
                        log('warn', `Error: ${ error.message }`);
                    }
                    else {
                        const outputFilename = `${ path.basename(item, path.extname(item)) }${ filenameVersion('.') }.css`;
                        fs.outputFile(paths.css.dist + outputFilename, result.css, (err) => {
                            if(!err) {
                                fs.outputFile(`${ paths.templates.src }_css/${ outputFilename }`, result.css, (err) => {
                                    if(!err) {
                                        log('verbose', `SASS compiled: ${ item } → ${ outputFilename }`, verbose);
                                        count--;
                                        if (count === 0) {
                                            resolve();
                                        }
                                    }
                                });
                            }
                        });
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

async function compileIcon() {
    log('title', `Compiling Icons`);

    const p = await new Promise(resolve => {
        glob(`${ paths.icon.src }*.svg`, function (er, files) {
            let count = files.length;
            if (count > 0) {
                files.forEach((item) => {
                    fs.copy(item, item.replace(paths.icon.src, paths.icon.dist)).then(() => {
                            count--;
                            if (count === 0) {
                                resolve();
                            }
                        });
                });
            } else {
                resolve();
            }
        });
    }).then(()=>'');
    log('title', `Icons Compiled`);
    return p;
}

async function compileImg() {
    log('title', `Compiling Images`);

    const p = await new Promise(resolve => {
        // if img folder doesn't exist, create it
        fs.ensureDirSync(paths.img.dist, 0o2755);

        let tasks = 2;
        let removeTaskIndex = () => {
            tasks--;
            if (tasks === 0) {
                resolve();
            }
        };
        let compressMove = (image) => {
            sharp(image)
                .toFile(paths.img.dist + path.basename(image));
        };
        let convertWebp = (image) => {
            sharp(image)
                .webp({ lossless: true })
                .toFile(`${ paths.img.dist + path.basename(image, path.extname(image)) }.webp`);
        };
        let resizeImage = (image, options) => {
            log('verbose', `Resizing: ${ image }`, verbose);
            const resize = size => {
                const resizedImage = sharp(image).resize(size);
                    resizedImage.toFile(`${ paths.img.dist + path.basename(image, path.extname(image)) }-${ size + path.extname(image) }`);
                    resizedImage.toFormat(sharp.format.webp).toFile(`${ paths.img.dist + path.basename(image, path.extname(image)) }-${ size }.webp`);
            };

            Promise.all(options.sizes.map(resize))
                .then(() => {
                    log('verbose', `IMG resized: ${ image }`, verbose);
                    removeTaskIndex();
                });
        };

        // move and compress images in image source root
        glob(`${ paths.img.src }*.{jpg,gif,png,webp}`, { nodir: true }, function (er, files) {
            let count = files.length;
            if (count > 0) {
                files.forEach((item) => {
                    compressMove(item);
                    convertWebp(item);
                    log('verbose', `IMG moved: ${ item }`, verbose);
                    count--;
                    if (count === 0) {
                        removeTaskIndex();
                    }
                });
            } else {
                removeTaskIndex();
            }
        });

        // resize images as defined in package.json
        Object.keys(pkg.imageResize).forEach((directory) => {
            const files = glob.sync(`${ paths.img.src + directory }/**/*.{jpg,gif,png,webp}`);

            files.forEach((item) => {
                resizeImage(item, pkg.imageResize[directory])
            });
        });
    }).then(()=>'');
    log('title', `Images Compiled`);
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
                    publicPath: "/js/",
                };
            });

            log('verbose', `JS Webpack config:`, verbose);
            log('dump', webpackConfig, verbose);

            webpack(webpackConfig, function (err, stats) {
                if (err) {
                    // throw new Error(err);
                    log('warn', err);
                }

                log('verbose', `JS compiled: ${ stats.toString({
                    assets: true,
                    chunks: true,
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

            if (count > 0) {
                files.forEach((item) => {
                    ejs.renderFile(item, ejsVars, {}, function(err, str) {
                        if (err) {
                            log('warn', err);
                        }
                        fs.outputFile(item.replace(paths.templates.src, paths.templates.dist), str, (err) => {
                            if(!err) {
                                log('verbose', `EJS compiled: ${ item }`, verbose);
                                count--;
                                if (count === 0) {
                                    resolve();
                                }
                            }
                        });
                    });
                });
            } else {
                count--;
                if (count === 0) {
                    resolve();
                }
            }
        });
    }).then(()=>'');
    log('title', `Templates Compiled`);
    return p;
}

async function postCss() {
    log('title', `Post CSS Started`);

    const p = await new Promise(resolve => {
        let count = pkg.postcss.length;

        if (count > 0) {
            pkg.postcss.forEach((item) => {
                fs.readFile(paths.css.dist + item + filenameVersion('.') + '.css', (err, css) => {
                    postcss([
                        purgecss({
                            content: [`${ paths.templates.dist }**/*.${ pkg.projectTemplateLanguage }`]
                        }),
                        mqpacker,
                        autoprefixer({
                            browsers: pkg.browserlist.autoprefix
                        })
                        ])
                        .process(css)
                        .then(result => {
                            fs.outputFile(paths.css.dist + item + filenameVersion('.') + '.css', result.css, (err) => {
                                if (err) {
                                    log('warn', err, verbose);
                                }
                                log('verbose', `POST CSS ran: ${ item }`, verbose);
                                count--;
                                if (count === 0) {
                                    resolve();
                                }
                            });
                        })
                })
            });
        } else {
            count--;
            if (count === 0) {
                resolve();
            }
        }
    }).then(()=>'');
    log('title', `Post CSS Complete`);
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

        glob(`${ paths.components.src }**/*.${ pkg.projectTemplateLanguage }`, { ignore: `${ paths.components.src }**/demo.ejs` }, function (er, files) {
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
                        if (err) {
                            log('warn', err);
                        }
                        fs.outputFile(`${ paths.css.src }components/${ path.basename(item) }`, str, (err) => {
                            if(!err) {
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
                        if (err) {
                            log('warn', err);
                        }
                        fs.outputFile(`${ paths.js.src }components/${ path.basename(item) }`, str, (err) => {
                            if(!err) {
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

async function updateStyleInventory() {
    if (pkg.styleInventory.enabled) {
        log('title', `Generating Style Inventory`);

        const p = await new Promise(resolve => {
            let count = Object.keys(pkg.styleInventory.pages).length;
            let extension = 'html';

            switch (pkg.projectType) {
                case 'craft3':
                    extension = 'twig';
                    break;
            }

            Object.keys(pkg.styleInventory.pages).forEach((item) => {
                const vars = Object.assign({
                    page: item,
                }, ejsVars);

                ejs.renderFile(`${ paths.starter.styleInventory }_page.ejs`, vars, {}, function(err, str) {
                    if (err) {
                        log('warn', err);
                    }
                    fs.outputFile(`${ paths.templates.src }dev/inv/${ item }.${ extension }`, str, (err) => {
                        if(!err) {
                            log('verbose', `Style Inventory Page: ${ item }`, verbose);
                            count--;
                            if (count === 0) {
                                resolve();
                            }
                        }
                    });
                });
            });
        }).then(()=>'');
        log('title', `Style Inventory Generated`);
        return p;
    } else {
        return true;
    }
}

function watch(directory, callback) {
    if (fs.existsSync(directory)) {
        let fsWait = false;
        fs.watch(directory, { recursive: true }, (event, filename) => {
            if (filename) {
                if (fsWait) return;
                fsWait = setTimeout(() => {
                    fsWait = false;
                }, 1000);
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

// Synchronously run a function and wait for a callback to fire
async function asyncFunction(startMessage, endMessage, func) {
    log('title', startMessage);

    const p = await new Promise(resolve => {
        func(resolve);
    }).then(()=>'');
    log('title', endMessage);
    return p;
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
            build: process.cwd() + paths.base.build,
            templates: process.cwd() + '/_starter/templates/',
            styleInventory: process.cwd() + '/_starter/style_inventory/',
        }
    }
}

// get version number based on build environment
function getVersion(version) {
    return release ? version : null;
}

// display a message in the command line
function log(type = 'message', message, verbose = false) {
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
                console.log(chalk.keyword('orange')(`🕵 ${ message }`));
            }
            break;
        case 'warn':
            console.warn(chalk.red.bold(`🚧 ${ message }`));
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

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
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