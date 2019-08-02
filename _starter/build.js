// import node modules
const autoprefixer = require('autoprefixer'),
      browserSync = require('browser-sync').create(),
      critical = require('critical'),
      chalk = require('chalk'),
      das = require('./das.js'),
      exec = require('child_process'),
      ejs = require('ejs'),
      favicons = require('favicons'),
      fs = require('fs-extra'),
      glob = require('glob-all'),
      inquirer = require('inquirer'),
      notifier = require('node-notifier'),
      os = require('os'),
      path = require('path'),
      postcss = require('postcss'),
      prettier = require("prettier"),
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
      release = env === 'production',
      timestamp = Math.floor(new Date().getTime() / 1000);

// use CLI arguments to set variables
const enableImg     = argv.options.noimg ? false : true,
      commitMessage = argv.options.commitmessage || false,
      runBuild      = argv.options.build || false,
      runBump       = argv.options.bump || false,
      runCommit     = argv.options.commit || false,
      runCritCss    = argv.options.critcss || false,
      runDeploy     = argv.options.deploy || false,
      runPrettier    = argv.options.prettier || false,
      runPublish    = argv.options.publish || false,
      runWatch      = argv.options.watch || false,
      verbose       = pkg.overrideVerbose || argv.options.verbose || false;

// set variables based on pkg options
let paths = getPaths(pkg.paths),
    version = getVersion(pkg.version);

let templateExtension = 'html';
switch (pkg.projectType) {
    case 'craft3':
        templateExtension = 'twig';
        break;
}

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
let localConfig = false,
    publishAnswers = {};

// get local config file
log('verbose', `Looking for local configuration file in home directory: .wb-starter.config.json`, verbose);
if (fs.existsSync(`${ os.homedir() }/.wb-starter.config.json`)) {
    log('verbose', `wb-starter configuration file found`, verbose);

    localConfig = require(`${ os.homedir() }/.wb-starter.config.json`);
} else {
    log('verbose', `wb-starter configuration file not found`, verbose);
}

// set notify configs
const notify = {
    icon: `${ pkg.paths.base.src }_favicon/favicon.png`,
    name: pkg.name,
};

// webpack config
let webpackConfig = require(process.cwd() + (release ? '/webpack.prod.js' : '/webpack.dev.js'));

// browser sync config
let browsersyncComponentsMoving = false;
const browsersyncInterval = 500;
let browsersyncReady = {
    css: true,
    components: true,
    icon: true,
    img: true,
    js: true,
    templates: true,
};


async function run() {
    dasReset();
    dasAnimate('rainbow', { key: '7,5', color: '#c2ff07', title: 'Compiling Icons' }); // SPC

    if (runBump) {
        const bumpPackageVersion       = bumpPackage();
        let bumpPackageVersionComplete = await bumpPackageVersion;
    }

    // ask questions related to build task
    if (runCommit) {
        const askCommitQuestions = asyncFunction(
            `Git Options`, `Publish Options Set`, (resolve) => {

                if (commitMessage) {
                    publishAnswers.commitRelease = true;
                    publishAnswers.message = commitMessage;
                    resolve();
                } else {
                    const publishQuestions = [
                        {
                            type: 'confirm',
                            name: 'commitRelease',
                            message: 'Commit and push release?',
                            default: true,
                            when: () => {
                                return !!commitMessage;
                            },
                        },
                        {
                            type: 'input',
                            name: 'message',
                            message: 'Commit message',
                            default: (answers) => {
                                return commitMessage || '';
                            },
                            validate: (answer) => {
                                return answer !== '';
                            },
                            when: (answers) => {
                                return answers.commitRelease;
                            },
                        },
                    ];

                    inquirer.prompt(publishQuestions).then((answers) => {
                        log('verbose', `Publishing with settings:`, verbose);
                        log('dump', answers, verbose);

                        publishAnswers = answers;
                        resolve();
                    });
                }
            });
        let askCommitQuestionsComplete = await askCommitQuestions;
    }

    if (runPrettier) {
        prettierOnFile();
    }

    // run build tasks
    if (runBuild) {
        log('title', `Running Build`);
        dasAnimate('rainbow', { key: 'KEY_B', color: '#c2ff07', title: 'Building' });

        const buildCleanAll                      = clean();
        let buildCleanComplete                   = await buildCleanAll;

        if (release && pkg.favicon.enabled && !fs.existsSync(paths.favicon.dist)) {
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
            if (pkg.postcss.length > 0) {
                const buildPostCss               = postCss();
                let buildPostCssComplete         = await buildPostCss;
            }
        }

        if (!runWatch) {
            const buildCleanComponents           = clean('components');
            const buildCleanStyleInventory       = clean('style_inventory');
            let buildCleanComponentsComplete     = await buildCleanComponents;
            let buildCleanStyleInventoryComplete = await buildCleanStyleInventory;
        }

        notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Build Complete' });
        dasRemove('KEY_B');
    }

    if (runCritCss) {
        const buildCritcss                       = critCss();
        let buildCritcssComplete                 = await buildCritcss;
    }

    if (runDeploy) {
        const deployCleanAll                     = clean();
        let deployCleanComplete                  = await deployCleanAll;
    }

    if (runPublish) {
        log('title', `Running Publish`);
        dasAnimate('rainbow', { key: 'KEY_P', color: '#c2ff07', title: 'Publishing' });

        if (fs.existsSync(paths.starter.release)) {
            const removeReleaseFiles = asyncFunction(
                `Removing Old Release Files`, `Old Release Files Removed`, (resolve) => {
                    const globFiles = [
                        `${ paths.starter.release }**/*`,
                        `!${ paths.starter.release }.git`,
                        `!${ paths.starter.release }.git/**/*`,
                    ];
                    glob(globFiles, { dot: false }, function (er, files) {
                        let count = files.length;
                        if (count > 0) {
                            files.forEach((item) => {
                                fs.removeSync(item);
                            });

                            resolve();
                        } else {
                            resolve();
                        }
                    });
                });
            let removeReleaseFilesComplete = await removeReleaseFiles;

            const copyNewReleaseFiles = asyncFunction(
                `Copying New Release Files`, `New Release Files Copied`, (resolve) => {
                    const globFiles = [
                        `${ paths.starter.development }**/*`,
                        `${ paths.starter.development }.gitignore`,
                        `!${ paths.starter.development }vendor`,
                        `!${ paths.starter.development }vendor/**/*`,
                        `!${ paths.starter.development }node_modules`,
                        `!${ paths.starter.development }node_modules/**/*`,
                    ];
                    glob(globFiles, function (er, files) {
                        let count = files.length;
                        if (count > 0) {
                            files.forEach((item) => {
                                fs.copySync(item, item.replace(paths.starter.development, paths.starter.release));
                            });

                            resolve();
                        } else {
                            resolve();
                        }
                    });
                });
            let copyNewReleaseFilesComplete = await copyNewReleaseFiles;
        }

        log('verbose', `Project moved to release directory.`, verbose);

        notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Project Published' });
        dasRemove('KEY_P');
    } else if (runCommit) {
        if (publishAnswers.commitRelease && publishAnswers.message) {
            log('title', `Adding and committing code to repo.`);
            verboseExec(`git add -A && git commit -m "${ publishAnswers.message }" && git push && git status`, verbose);
            log('verbose', `Code pushed with message: ${ publishAnswers.message }`, verbose);
        }
    } else if (runWatch) {
        log('title', `Running Watch`);

        if (pkg.browserSync.url === 'CHANGE_ME') {
            log('warn', 'Browsersync is not set up, yet. Add your local site URL to the Browsersync setting in package.json.')
        } else {
            dasAnimate('rainbow', { key: 'KEY_W', color: '#c2ff07', title: 'Watching' });

            browserSync.init({
                browser: pkg.browserSync.browser,
                proxy: pkg.browserSync.url,
                reloadThrottle: browsersyncInterval * 3,
                ignore: [paths.templates.src + '_css'],
                files: [
                    {
                        match: [paths.components.src + '**/*'],
                        fn: async (event, file) => {
                            log('title', `BrowserSync File: ${ path.extname(file) }`);
                            if (browsersyncReady.components && event === 'change') {
                                log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.components = false;
                                browsersyncComponentsMoving = true;
                                setTimeout(() => { browsersyncReady.components = true; }, (browsersyncInterval * 10));

                                prettierOnFile(file);

                                const watchUpdateComponents           = updateComponents();
                                let watchUpdateComponentsComplete     = await watchUpdateComponents;

                                const watchCompileCssTemplates        = compileCssTemplates();
                                let watchCompileCssTemplatesComplete  = await watchCompileCssTemplates;

                                const watchUpdateStyleInventory       = updateStyleInventory();
                                let watchUpdateStyleInventoryComplete = await watchUpdateStyleInventory;

                                const watchCompileCss                 = compileCss();
                                const watchCompileJs                  = compileJs();
                                let watchCompileCssComplete           = await watchCompileCss;
                                let watchCompileJsComplete            = await watchCompileJs;

                                const watchCompileTemplates           = compileTemplates();
                                let watchCompileTemplatesComplete     = await watchCompileTemplates;

                                browsersyncComponentsMoving = false;
                                if (path.extname(file) === '.scss') {
                                    browserSync.reload("*.css");
                                } else {
                                    browserSync.reload();
                                }
                                notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Components Updated' });
                            }
                        },
                    },
                    {
                        match: [paths.css.src + '**/*'],
                        fn: async (event, file) => {
                            if (!browsersyncComponentsMoving && browsersyncReady.css && event === 'change') {
                                log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.css = false;
                                setTimeout(() => { browsersyncReady.css = true; }, browsersyncInterval);

                                prettierOnFile(file);

                                const watchCompileCss       = compileCss();
                                let watchCompileCssComplete = await watchCompileCss;

                                browserSync.reload("*.css");
                                notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'CSS Updated' });
                            }
                        },
                    },
                    {
                        match: [paths.icon.src + '**/*'],
                        fn: async (event, file) => {
                            if (!browsersyncComponentsMoving && browsersyncReady.icon && event === 'change') {
                                log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.icon = false;
                                setTimeout(() => { browsersyncReady.icon = true; }, browsersyncInterval);

                                const watchCompileIcon       = compileIcon();
                                let watchCompileIconComplete = await watchCompileIcon;

                                browserSync.reload();
                                notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Icons Updated' });
                            }
                        },
                    },
                    {
                        match: [paths.img.src + '**/*'],
                        fn: async (event, file) => {
                            if (!browsersyncComponentsMoving && browsersyncReady.img && event === 'change') {
                                log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.img = false;
                                setTimeout(() => { browsersyncReady.img = true; }, browsersyncInterval);

                                const watchCompileImg       = compileImg();
                                let watchCompileImgComplete = await watchCompileImg;

                                browserSync.reload();
                                notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Images Updated' });
                            }
                        },
                    },
                    {
                        match: [paths.js.src + '**/*'],
                        fn: async (event, file) => {
                            if (!browsersyncComponentsMoving && browsersyncReady.js && event === 'change') {
                                log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.js = false;
                                setTimeout(() => { browsersyncReady.js = true; }, browsersyncInterval);

                                prettierOnFile(file);

                                const watchCompileJs       = compileJs();
                                let watchCompileJsComplete = await watchCompileJs;

                                browserSync.reload();
                                notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'JS Updated' });
                            }
                        },
                    },
                    {
                        match: [paths.templates.src + '**/*'],
                        fn: async (event, file) => {
                            if (!browsersyncComponentsMoving && browsersyncReady.templates && event === 'change') {
                                log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.templates = false;
                                setTimeout(() => { browsersyncReady.templates = true; }, browsersyncInterval);

                                prettierOnFile(file);

                                const watchCompileTemplates       = compileTemplates();
                                let watchCompileTemplatesComplete = await watchCompileTemplates;

                                browserSync.reload();
                                notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Templates Updated' });
                            }
                        },
                    },
                ]
            });
        }
    }


    // BYE
    if (!runWatch) {
        dasRemove('7,5'); // SPC
        log('app', `End`);
    }
}




async function bumpPackage() {
    log('title', `Increasing Version Number`);

    const p = await new Promise(resolve => {
        log('title', `Bumping version number`);
        version = getVersion(bumpVersion(pkg.version));
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
                            log('verbose', `Deleted: ${ item }, Pattern: ${ pattern }`, verbose);
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
    dasAnimate('highlight', { key: 'KEY_C', color: '#c2ff07', title: 'Compiling CSS' });

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
    dasRemove('KEY_C');
    return p;
}

async function compileFavicon() {
    log('title', `Generating Favicons`);
    dasAnimate('highlight', { key: 'KEY_F', color: '#c2ff07', title: 'Generating Favicons' });

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
    dasRemove('KEY_C');
    return p;
}

async function compileIcon() {
    log('title', `Compiling Icons`);
    dasAnimate('highlight', { key: 'KEY_S', color: '#c2ff07', title: 'Compiling Icons' });

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
    dasRemove('KEY_S');
    return p;
}

async function compileImg() {
    log('title', `Compiling Images`);
    dasAnimate('highlight', { key: 'KEY_I', color: '#c2ff07', title: 'Compiling Images' });

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
    dasRemove('KEY_I');
    return p;
}

async function compileJs() {
    log('title', `Compiling JS`);
    dasAnimate('highlight', { key: 'KEY_J', color: '#c2ff07', title: 'Compiling JS' });

    const p = await new Promise(resolve => {
        if (pkg.webpack.entries.js || false) {
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
                    chunkFilename: `[id]${ legacySuffix + filenameVersion('.') }.js`,
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
    dasRemove('KEY_J');
    return p;
}

async function dasAnimate(anim, options = { }) {
    if (localConfig.das || false) {
        if (localConfig.das.enabled || false) {
            options['verbose'] = verbose;
            log('verbose', `Running Das animation: ${ anim }`, verbose);
            das.animate(anim, options, verbose);
        }
    }
}
async function dasRemove(zone, options = { }) {
    if (localConfig.das || false) {
        if (localConfig.das.enabled || false) {
            options['verbose'] = verbose;
            log('verbose', `Removing Das Zone: ${ zone }`, verbose);
            das.remove(zone, options, verbose);
        }
    }
}
async function dasReset() {
    if (localConfig.das || false) {
        if (localConfig.das.enabled || false) {
            log('verbose', `Resetting Das`, verbose);
            dasRemove('KEY_W');
            dasRemove('7,5'); // SPC
        }
    }
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
                let postCssActions = [];

                if (item.autoprefixer || false) {
                    postCssActions.push(
                        autoprefixer({
                            overrideBrowserslist: pkg.browserlist.autoprefix
                        })
                    );
                }
                // if (item.purify || false) {
                //     postCssActions.push(
                //         purify([
                //             `${ paths.templates.dist }**/*.${ templateExtension }`,
                //             `${ paths.js.dist }**/*.js`,
                //             `${ paths.components.src }**/*.vue`,
                //         ],
                //         [css],
                //         { info: verbose })
                //     );
                // }

                if (postCssActions.length > 0) {
                    fs.readFile(paths.css.dist + item.filename + filenameVersion('.') + '.css', (err, css) => {
                        postcss(postCssActions)
                        .process(css)
                        .then(result => {
                            fs.outputFile(`${ paths.css.dist + item.filename + filenameVersion('.') }.css`, result.css, (err) => {
                                if (err) {
                                    log('warn', err, verbose);
                                }
                                log('verbose', `POST CSS ran: ${ item.filename }`, verbose);
                                count--;
                                if (count === 0) {
                                    resolve();
                                }
                            });
                        })
                    });
                }
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

function prettierOnFile(file = null) {
    if (runPrettier && pkg.prettier) {
        log('title', `Running Prettier`);

        let files = false;

        if (file) {
            if (glob.sync(pkg.prettier.files).includes(file)) {
                files = file;
            }
        } else {
            files = pkg.prettier.files;
        }

        if (files) {
            verboseExec(`prettier --config ./.prettierrc ${ pkg.prettier.options } "${ files }"`, verbose);
        }
        log('title', `Prettier Ran`);
    }
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
            Object.keys(pkg.styleInventory.pages).forEach((item) => {
                const vars = Object.assign({
                    page: item,
                }, ejsVars);

                ejs.renderFile(`${ paths.starter.styleInventory }_page.ejs`, vars, {}, function(err, str) {
                    if (err) {
                        log('warn', err);
                    }
                    fs.outputFile(`${ paths.templates.src }dev/inv/${ item }.${ templateExtension }`, str, (err) => {
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
    const newVersion = version || timestamp;
    return prefix + newVersion + suffix;
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
            components: process.cwd() + '/_starter/components/',
            development: process.cwd() + '/' + paths.base.dist,
            release: require('os').homedir() + paths.base.release,
            templates: process.cwd() + '/_starter/templates/',
            styleInventory: process.cwd() + '/_starter/style_inventory/',
        }
    }
}

// get version number based on build environment
function getVersion(version) {
    return pkg.overrideVersion ? pkg.overrideVersion : release ? version : null;
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