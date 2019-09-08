// import node modules
const autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create(),
    critical = require('critical'),
    das = require('./das.js'),
    ejs = require('ejs'),
    favicons = require('favicons'),
    fs = require('fs-extra'),
    glob = require('glob-all'),
    inquirer = require('inquirer'),
    notifier = require('node-notifier'),
    os = require('os'),
    path = require('path'),
    postcss = require('postcss'),
    sass = require('node-sass'),
    sassGlobImporter = require('node-sass-glob-importer'),
    sharp = require('sharp'),
    webpack = require('webpack');

// import global functions
const g = require('./global.js');

// HELLO
g.log('app', `Beginning`);

// load package file
let pkg = require(`${ process.cwd() }/package.json`);

// set constants
const argv = g.parseArgv(),
    env = process.env.NODE_ENV || 'development',
    release = env === 'production',
    siteUrl = release ? pkg.paths.base.siteUrl.prod : pkg.paths.base.siteUrl.dev,
    timestamp = Math.floor(new Date().getTime() / 1000);

// use CLI arguments to set variables
const enableImg   = argv.options.noimg ? false : true,
      commitMessage = argv.options.commitmessage || false,
      runBuild      = argv.options.build || false,
      runBump       = argv.options.bump || false,
      runCommit     = argv.options.commit || false,
      runCritCss    = argv.options.critcss || false,
      runDeploy     = argv.options.deploy || false,
      runPrettier   = argv.options.prettier || false,
      runPublish    = argv.options.publish || false,
      runWatch      = argv.options.watch || false,
      verbose       = pkg.overrideVerbose || argv.options.verbose || false;

// set variables based on pkg options
let paths = g.getPaths(pkg.paths),
    version = g.getVersion(release, pkg.version);

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
    siteUrl: siteUrl,
    version: version,
}, pkg.ejs);

// other variables
let localConfig = false,
    publishAnswers = {};

// get local config file
g.log('verbose', `Looking for local configuration file in home directory: .wb-starter.config.json`, verbose);
if (fs.existsSync(`${ os.homedir() }/.wb-starter.config.json`)) {
    g.log('verbose', `wb-starter configuration file found`, verbose);

    localConfig = require(`${ os.homedir() }/.wb-starter.config.json`);
} else {
    g.log('verbose', `wb-starter configuration file not found`, verbose);
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
        const askCommitQuestions = g.asyncFunction(
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
                        g.log('verbose', `Publishing with settings:`, verbose);
                        g.log('dump', answers, verbose);

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
        g.log('title', `Running Build`);
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
        g.log('title', `Running Publish`);
        dasAnimate('rainbow', { key: 'KEY_P', color: '#c2ff07', title: 'Publishing' });

        if (fs.existsSync(paths.starter.release)) {
            const removeReleaseFiles = g.asyncFunction(
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

            const copyNewReleaseFiles = g.asyncFunction(
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

        g.log('verbose', `Project moved to release directory.`, verbose);

        notifier.notify({ 'title': notify.name, 'icon': notify.icon, 'message': 'Project Published' });
        dasRemove('KEY_P');
    } else if (runCommit) {
        if (publishAnswers.commitRelease && publishAnswers.message) {
            g.log('title', `Adding and committing code to repo.`);
            g.verboseExec(`git add -A && git commit -m "${ publishAnswers.message }" && git push && git status`, verbose);
            g.log('verbose', `Code pushed with message: ${ publishAnswers.message }`, verbose);
        }
    } else if (runWatch) {
        g.log('title', `Running Watch`);

        if (pkg.browserSync.url === 'CHANGE_ME') {
            g.log('warn', 'Browsersync is not set up, yet. Add your local site URL to the Browsersync setting in package.json.')
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
                            g.log('title', `BrowserSync File: ${ path.extname(file) }`);
                            if (browsersyncReady.components && event === 'change') {
                                g.log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.components = false;
                                browsersyncComponentsMoving = true;
                                setTimeout(() => { browsersyncReady.components = true; }, (browsersyncInterval * 10));

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
                                g.log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.css = false;
                                setTimeout(() => { browsersyncReady.css = true; }, browsersyncInterval);

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
                                g.log('verbose', `BrowserSync Event: ${ event }`, verbose);
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
                                g.log('verbose', `BrowserSync Event: ${ event }`, verbose);
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
                                g.log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.js = false;
                                setTimeout(() => { browsersyncReady.js = true; }, browsersyncInterval);

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
                                g.log('verbose', `BrowserSync Event: ${ event }`, verbose);
                                browsersyncReady.templates = false;
                                setTimeout(() => { browsersyncReady.templates = true; }, browsersyncInterval);

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
        g.log('app', `End`);
    }
}




async function bumpPackage() {
    g.log('title', `Increasing Version Number`);

    const p = await new Promise(resolve => {
        g.log('title', `Bumping version number`);
        g.log('verbose', `Current version number: ${ version }`, verbose);
        version = g.getVersion(release, g.bumpVersion(pkg.version));
        pkg.version = version;
        ejsVars.pkg = pkg;
        ejsVars.filenameVersion = filenameVersion('.');

        // backup package file then overwrite the version number
        fs.copy(`${ process.cwd() }/package.json`, `${ paths.starter.backups }package.json`, (err) => {
            if (err) {
                g.log('warn', err, verbose);
            }
            g.log('verbose', `Package File Backed Up`, verbose);
            fs.outputFile(`${ process.cwd() }/package.json`, JSON.stringify(pkg, null, 2), function (err) {
                if (err) {
                    g.log('warn', err, verbose);
                }
                g.log('verbose', `Version changed to: ${ version }`, verbose);
                resolve();
            });
        });
    }).then(()=>'');
    g.log('title', `Version Number Set to "${ version }"`);
    return p;
}

async function clean(type = 'all') {
    g.log('title', `Cleaning "${ type }"`);

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
                            g.log('verbose', `Deleted: ${ item }, Pattern: ${ pattern }`, verbose);
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
    g.log('title', `"${ type }" Cleaned`);
    return p;
}

async function critCss() {
    g.log('title', `Starting Critical CSS`);

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
                            g.log('warn', err);
                        }
                        g.log('verbose', `Critical CSS compiled: ${ item }`, verbose);
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
    g.log('title', `Critical CSS Generated`);
    return p;
}

async function compileCssTemplates() {
    g.log('title', `Moving CSS Components`);

    const p = await new Promise(resolve => {
        g.prebuildCssTemplates(resolve, paths, ejsVars, verbose);
    }).then(() => '');
    g.log('title', `CSS Components Moved`);
    return p;
}

async function compileCss() {
    g.log('title', `Compiling CSS`);
    dasAnimate('highlight', { key: 'KEY_C', color: '#c2ff07', title: 'Compiling CSS' });

    const p = await new Promise(resolve => {
        glob(`${ paths.css.src }/*.scss`, function (er, files) {
            let count = files.length;
            files.forEach((item) => {
                g.log('verbose', `CSS: compiling ${ item }`, verbose);

                sass.render({
                    file: item,
                    importer: sassGlobImporter(),
                    outputStyle: release ? 'compressed' : 'expanded',
                }, function(error, result) { // node-style callback from v3.0.0 onwards
                    if (error) {
                        g.log('warn', `SASS Error: ${ error.file }`);
                        g.log('warn', `Line: ${ error.line }`);
                        g.log('warn', `Column: ${ error.column }`);
                        g.log('warn', `Error: ${ error.message }`);
                    }
                    else {
                        const outputFilename = `${ path.basename(item, path.extname(item)) }${ filenameVersion('.') }.css`;
                        fs.outputFile(paths.css.dist + outputFilename, result.css, (err) => {
                            if(!err) {
                                fs.outputFile(`${ paths.templates.src }_css/${ outputFilename }`, result.css, (err) => {
                                    if(!err) {
                                        g.log('verbose', `SASS compiled: ${ item } → ${ outputFilename }`, verbose);
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
    g.log('title', `CSS Compiled`);
    dasRemove('KEY_C');
    return p;
}

async function compileFavicon() {
    g.log('title', `Generating Favicons`);
    dasAnimate('highlight', { key: 'KEY_F', color: '#c2ff07', title: 'Generating Favicons' });

    const p = await new Promise(resolve => {
        favicons(`${ paths.favicon.src }favicon.png`, {
            path: `${ siteUrl }favicon/`,
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
                    g.log('verbose', `Favicon icon moved: ${ item.name }`, verbose);
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
                    g.log('verbose', `Favicon file moved: ${ item.name }`, verbose);
                    countFiles--;
                    if (countFiles === 0) {
                        removeTaskIndex();
                    }
                });
            });
        });
    }).then(()=>'');
    g.log('title', `Favicons Generated`);
    dasRemove('KEY_C');
    return p;
}

async function compileIcon() {
    g.log('title', `Compiling Icons`);
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
    g.log('title', `Icons Compiled`);
    dasRemove('KEY_S');
    return p;
}

async function compileImg() {
    g.log('title', `Compiling Images`);
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
            g.log('verbose', `Resizing: ${ image }`, verbose);
            const resize = size => {
                const resizedImage = sharp(image).resize(size);
                resizedImage.toFile(`${ paths.img.dist + path.basename(image, path.extname(image)) }-${ size + path.extname(image) }`);
                resizedImage.toFormat(sharp.format.webp).toFile(`${ paths.img.dist + path.basename(image, path.extname(image)) }-${ size }.webp`);
            };

            Promise.all(options.sizes.map(resize))
                .then(() => {
                    g.log('verbose', `IMG resized: ${ image }`, verbose);
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
                    g.log('verbose', `IMG moved: ${ item }`, verbose);
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
    g.log('title', `Images Compiled`);
    dasRemove('KEY_I');
    return p;
}

async function compileJs() {
    g.log('title', `Compiling JS`);
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
                    publicPath: `${ siteUrl }js/`,
                };
            });

            g.log('verbose', `JS Webpack config:`, verbose);
            g.log('dump', webpackConfig, verbose);

            webpack(webpackConfig, function (err, stats) {
                if (err) {
                    // throw new Error(err);
                    g.log('warn', err);
                }

                g.log('verbose', `JS compiled: ${ stats.toString({
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
    g.log('title', `JS Compiled`);
    dasRemove('KEY_J');
    return p;
}

async function dasAnimate(anim, options = { }) {
    if (localConfig.das || false) {
        if (localConfig.das.enabled || false) {
            options['verbose'] = verbose;
            g.log('verbose', `Running Das animation: ${ anim }`, verbose);
            das.animate(anim, options, verbose);
        }
    }
}
async function dasRemove(zone, options = { }) {
    if (localConfig.das || false) {
        if (localConfig.das.enabled || false) {
            options['verbose'] = verbose;
            g.log('verbose', `Removing Das Zone: ${ zone }`, verbose);
            das.remove(zone, options, verbose);
        }
    }
}
async function dasReset() {
    if (localConfig.das || false) {
        if (localConfig.das.enabled || false) {
            g.log('verbose', `Resetting Das`, verbose);
            dasRemove('KEY_W');
            dasRemove('7,5'); // SPC
        }
    }
}

async function compileTemplates() {
    g.log('title', `Compiling Templates`);

    const p = await new Promise(resolve => {
        glob(`${ paths.templates.src }**/*.{${ pkg.templateExtensions }}`, function (er, files) {
            let count = files.length;

            if (count > 0) {
                files.forEach((item) => {
                    ejs.renderFile(item, ejsVars, {}, function(err, str) {
                        if (err) {
                            g.log('warn', err);
                        }
                        fs.outputFile(item.replace(paths.templates.src, paths.templates.dist), str, (err) => {
                            if(!err) {
                                g.log('verbose', `EJS compiled: ${ item }`, verbose);
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
    g.log('title', `Templates Compiled`);
    return p;
}

async function postCss() {
    g.log('title', `Post CSS Started`);

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
                                        g.log('warn', err, verbose);
                                    }
                                    g.log('verbose', `POST CSS ran: ${ item.filename }`, verbose);
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
    g.log('title', `Post CSS Complete`);
    return p;
}

function prettierOnFile(file = null) {
    if (runPrettier && pkg.prettier) {
        g.log('title', `Running Prettier`);

        let files = false;

        if (file) {
            if (glob.sync(pkg.prettier.files).includes(file)) {
                files = file;
            }
        } else {
            files = pkg.prettier.files;
        }

        if (files) {
            g.verboseExec(`prettier --config ./.prettierrc ${ pkg.prettier.options } "${ files }"`, verbose);
        }
        g.log('title', `Prettier Ran`);
    }
}

async function updateComponents() {
    g.log('title', `Updating Components`);

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
                        g.log('verbose', `Component template updated: ${ item }`, verbose);
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
                            g.log('warn', err);
                        }
                        fs.outputFile(`${ paths.css.src }components/${ path.basename(item) }`, str, (err) => {
                            if(!err) {
                                g.log('verbose', `Component style updated: ${ item }`, verbose);
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
                            g.log('warn', err);
                        }
                        fs.outputFile(`${ paths.js.src }components/${ path.basename(item) }`, str, (err) => {
                            if(!err) {
                                g.log('verbose', `Component script updated: ${ item }`, verbose);
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
    g.log('title', `Components Updated`);
    return p;
}

async function updateStyleInventory() {
    if (pkg.styleInventory.enabled) {
        g.log('title', `Generating Style Inventory`);

        const p = await new Promise(resolve => {
            let count = Object.keys(pkg.styleInventory.pages).length;
            Object.keys(pkg.styleInventory.pages).forEach((item) => {
                const vars = Object.assign({
                    page: item,
                }, ejsVars);

                ejs.renderFile(`${ paths.starter.styleInventory }_page.ejs`, vars, {}, function(err, str) {
                    if (err) {
                        g.log('warn', err);
                    }
                    fs.outputFile(`${ paths.templates.src }dev/inv/${ item }.${ templateExtension }`, str, (err) => {
                        if(!err) {
                            g.log('verbose', `Style Inventory Page: ${ item }`, verbose);
                            count--;
                            if (count === 0) {
                                resolve();
                            }
                        }
                    });
                });
            });
        }).then(()=>'');
        g.log('title', `Style Inventory Generated`);
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

// INIT
run();