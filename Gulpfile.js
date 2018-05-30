'use strict';

// Get Local IP Address
const os = require('os');

const interfaces = os.networkInterfaces();
let addresses = [];
for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
        const address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

// get arguments from command line
const argv = _parseArgv();

// Package Variables
const fs = require('fs'),
    path = require('path'),
    varsJsonRaw = JSON.parse(fs.readFileSync('./package.json')),
    varsJsonString = JSON.stringify(varsJsonRaw).replace(/LOCAL_IP/g, addresses[0]),
    vars = JSON.parse(varsJsonString),
    webpackConfig = require('./webpack.config.js');

const name = argv.options.name || vars.name,
    critCssTasks = [],
    release = (process.argv[2] && (process.argv[2] === 'release' || process.argv[2] === 'release:feature' || process.argv[2] === 'release:major')) ? true : false;

// Paths
const bases = {
    source: vars.source_path,
    build:  vars.build_path,
    theme:  vars.theme_path,
    html:   vars.html_path,
    site:   vars.site_root,
};
const paths = {
    distCss:                bases.theme + 'css/',
    distImg:                bases.theme + 'img/',
    distJs:                 bases.theme + 'js/',
    distIcon:               bases.theme + 'icon/',
    srcCss:                 bases.source + '_scss/',
    srcHtml:                bases.source + '_html/',
    srcIcon:                bases.source + '_icon/',
    srcImg:                 bases.source + '_img/',
    srcJs:                  bases.source + '_js/',
    srcUtil:                bases.source + '_util/',
    filesHtml:              [bases.source + '_html/**/*.{html,php,twig,ejs}', '!' + bases.source + '_html/ejs_includes/**/*'],
    filesEjsIncludes:       bases.source + '_html/ejs_includes/**/*',
    filesImg:               bases.source + '_img/**/*.{png,jpg,gif}',
    filesJs:                bases.source + '_js/**/*.{js,vue}',
    filesScss:              bases.source + '_scss/**/*.scss',
    filesIcon:              bases.source + '_icon/**/*.svg',
    filesIconCss:           bases.source + '_icon/css/**/*.svg',
    utilFonts:              bases.source + '_util/_fonts.ejs',
};

// Gulp Variables
const browserSync     = require('browser-sync').create(),
    critical        = require('critical'),
    glob            = require('glob'),
    gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    inquirer        = require('inquirer'),
    notifier        = require('node-notifier'),
    semver          = require('semver'),
    webpack = require('webpack'),
    $               = gulpLoadPlugins({
        rename: {
            'gulp-json-modify':    'jsonModify',
            'gulp-sass-glob':      'sassGlob',
            'gulp-svg-inline-css': 'svgInline',
            'gulp-util':           'gutil',
        }
    });

const ejsVars = {
    enable_ssi:            vars.enable_ssi,
    favicons:              '/favicon/favicons.html',
    fonts:                 vars.fonts,
    release:               release,
    site_root:             bases.site,
    styleTemplateSections: vars.styleTemplateSections,
    styleTemplatePrefix:   vars.style_template_url_prefix,
    styleTemplateSuffix:   vars.style_template_url_suffix,
    templateDirectory:     vars.template_directory,
    version:               release ? vars.version : Math.floor(new Date().getTime() / 1000),
};
const ejsOptions = {
    root:                  bases.build,
};
let setupVars = {
    name:                  name,
    projectDir:            __dirname,
    options:               argv.options,
    securityKey:           _randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
};
const notifyIconPath = bases.source + '_favicon/favicon.png';






// COMMANDS
// [gulp]
gulp.task('default',function() {
    const text  = `\n\n${$.gutil.colors.inverse('        COMMANDS        ')}`
        + `\n––––––––––––––––––––––––\n`
        + `\n${$.gutil.colors.inverse(' gulp font ')}`
        + `\n${$.gutil.colors.bold('└─ Uses info in \`package.json\` to generate _source/_scss/automated/_fonts.scss')}\n`
        + `\n${$.gutil.colors.inverse(' gulp run ')}`
        + `\n${$.gutil.colors.bold('└─ Processes CSS, JS, and image files.')}\n`
        + `\n${$.gutil.colors.inverse(' gulp release ')}`
        + `\n${$.gutil.colors.bold('└─ Performs all tasks, including Critical CSS and processing HTML files.\n\n\`gulp release\` advances the version number in \`package.json\` by 0.0.1. Running \`gulp releasefeature\` will advance it by 0.1.0; and running \`gulp releasemajor\` will advance it by 1.0.0.')}\n`
        + `\n${$.gutil.colors.inverse(' gulp setup ')}`
        + `\n${$.gutil.colors.bold('└─ Moves files from _source/_util/ into _source/ based on answers you provide when prompted then runs [gulp font]. Before running this task, modify settings in \`package.json\` for you project. This task should only be run one time at the beginning of development and once it is run, it will put a lock in package.json so it cannot be accidentally run again.')}\n`
        + `\n${$.gutil.colors.inverse(' gulp watch ')}`
        + `\n${$.gutil.colors.bold('└─ Watches source folders and runs tasks based on the type of file changed.')}\n`;
    $.gutil.log(text);
    $.gutil.beep();
});


// [gulp template]
gulp.task('source:backup', function() {
    return gulp.src(bases.source + '**/*')
        .pipe(gulp.dest(bases.build + '_source_backup/'));
});

// [gulp setup]
gulp.task('setup:move:default', ['source:backup'], function(cb) {
    if (!vars.template_is_set_up) {
        const defaultsPath = paths.srcUtil + '_default/';
        const defaultsTemplates = defaultsPath + 'templates/**/*';

        gulp.src(defaultsTemplates)
            .pipe(gulp.dest(bases.source));

        $.gutil.log('Moved default source files');
    }

    cb();
});
gulp.task('setup', ['setup:move:default'], function(cb) {
    if (!vars.template_is_set_up) {
        const questions = [{
            type: 'list',
            name: 'templateType',
            message: 'What kind of project are you developing?',
            when: (answers) => {
                return argv.options.template === undefined;
            },
            choices: [
                { name: 'HTML', value: '_html_1' },
                { name: 'Craft 3 Website', value: '_craft3_1' },
                { name: 'Craft 2 Website', value: '_craft2_1' }
            ]
        }];
        inquirer.prompt(questions).then(function (answers) {
            const projectTemplate = argv.options.template || answers['templateType'];
            const projectTemplatePath = paths.srcUtil + projectTemplate + '/';
            let projectTemplateTemplates = [projectTemplatePath + 'templates/**/*'];
            let projectTemplateSetup = [projectTemplatePath + 'setup/**/*'];
            let packageThemePath = 'public/',
                packageHtmlPath = 'public/',
                packageStyleTemplateUrlPrefix = 'dev/inv/',
                packageStyleTemplateUrlSuffix = '.html',
                packageEnableSsi = false,
                packageMinifyHtml = true;

            let templateQuestions = [];

            switch (projectTemplate) {
                case '_html_1':
                    // templateQuestions = [{
                    //     type: 'confirm',
                    //     name: 'animations',
                    //     message: 'Include Animations?',
                    //     default: true
                    // },{
                    //     type: 'confirm',
                    //     name: 'vueComponents',
                    //     message: 'Include Vue Components?',
                    //     default: true
                    // }];
                    break;
                case '_craft3_1':
                    break;
                case '_craft2_1':
                    break;
            }

            inquirer.prompt(templateQuestions).then(function (templateAnswers) {
                switch (projectTemplate) {
                    case '_html_1':
                        // if (!templateAnswers['animations']) {
                        //     projectTemplateTemplates.push('!' + projectTemplatePath + 'templates/_scss/base/_animations.scss');
                        // }
                        // if (!templateAnswers['vueComponents']) {
                        //     projectTemplateTemplates.push('!' + projectTemplatePath + 'templates/_scss/components/_vue.scss');
                        // }
                        break;
                    case '_craft3_1':
                        packageThemePath = 'web/';
                        packageHtmlPath = 'templates/';
                        packageStyleTemplateUrlPrefix = 'dev/inv/';
                        packageStyleTemplateUrlSuffix = '';
                        packageMinifyHtml = false;
                        break;
                    case '_craft2_1':
                        break;
                }

                // move template files from selected template
                gulp.src(projectTemplateTemplates)
                    .pipe(gulp.dest(bases.source));

                $.gutil.log('Moved template files');

                // move files from setup folder in seleted directory
                gulp.src(projectTemplateSetup)
                    .pipe($.ejs(setupVars))
                    .pipe(gulp.dest('./'));

                $.gutil.log('Moved setup files');

                gulp.start('font');

                gulp.src('./package.json')
                    .pipe(gulp.dest(bases.build + 'package'))
                    .pipe($.jsonModify({ key: 'name', value: name }))
                    .pipe($.jsonModify({ key: 'theme_path', value: packageThemePath }))
                    .pipe($.jsonModify({ key: 'html_path', value: packageHtmlPath }))
                    .pipe($.jsonModify({ key: 'style_template_url_prefix', value: packageStyleTemplateUrlPrefix }))
                    .pipe($.jsonModify({ key: 'style_template_url_suffix', value: packageStyleTemplateUrlSuffix }))
                    .pipe($.jsonModify({ key: 'enable_ssi', value: packageEnableSsi }))
                    .pipe($.jsonModify({ key: 'minify_html', value: packageMinifyHtml }))
                    .pipe($.jsonModify({ key: 'template_is_set_up', value: true }))
                    .pipe($.jsonModify({ key: 'template_directory', value: projectTemplate }))
                    .pipe(gulp.dest('./'));

                cb();
            });
        });
    } else {
        $.gutil.log($.gutil.colors.inverse(' [gulp setup] has already been run and is now disabled. If you need to run [gulp setup] again, open `package.json` and change "template_is_set_up" to false. '));
    }
});

// [gulp run]
gulp.task('run', ['css:cleaned', 'img:cleaned', 'webpack'], function() {
    return notifier.notify({ 'title': name, 'icon': notifyIconPath, 'message': 'Run Complete' });
});

// [gulp release]
gulp.task('release', ['bump:patch', 'release:tasks']);
gulp.task('release:feature', ['bump:minor', 'release:tasks']);
gulp.task('release:major', ['bump:major', 'release:tasks']);
gulp.task('release:tasks', ['critCss', 'img:cleaned', 'ejs:release', 'webpack'], function() {
    return notifier.notify({ 'title': name, 'icon': notifyIconPath, 'message': 'Release Complete' });
});

// [gulp watch]
gulp.task('watch', ['ejs:quick:full'], function() {
    const watchCss          = gulp.watch(paths.filesScss, ['css']),
        watchEjsIncludes  = gulp.watch(paths.filesEjsIncludes, ['ejs:quick:full']),
        watchHtml         = gulp.watch(paths.filesHtml, ['ejs:quick']),
        watchImg          = gulp.watch(paths.filesImg, ['img']),
        watchJs           = gulp.watch(paths.filesJs, ['webpack']),
        watchIcon         = gulp.watch(paths.filesIcon, ['icon']),
        watchIconCss      = gulp.watch(paths.filesIconCss, ['css:cleaned']);

    if (vars.browserSync.url === 'https://starter.wbrowar.com/') {
        $.gutil.log($.gutil.colors.inverse(' Browsersync is not set up, yet. Add your local site URL to the Browsersync setting in package.json. '));
    } else {
        browserSync.init({
            browser: vars.browserSync.browser,
            proxy: vars.browserSync.url,
        });
    }

    watchCss.on('change', function(event) {
        notifier.notify({ 'title': name, 'icon': notifyIconPath, 'message': 'CSS Updated' });
    });
    watchEjsIncludes.on('change', function(event) {
        notifier.notify({ 'title': name, 'icon': notifyIconPath, 'message': 'HTML Updated' });
    });
    watchHtml.on('change', function(event) {
        notifier.notify({ 'title': name, 'icon': notifyIconPath, 'message': 'HTML Updated' });
    });
    watchImg.on('change', function(event) {
        notifier.notify({ 'title': name, 'icon': notifyIconPath, 'message': 'Images Updated' });
        browserSync.reload();
    });
    watchJs.on('change', function(event) {
        notifier.notify({ 'title': name, 'icon': notifyIconPath, 'message': 'JS Updated' });
    });
    watchIcon.on('change', function(event) {
        notifier.notify({ 'title': name, 'icon': notifyIconPath, 'message': 'SVGs Updated' });
        browserSync.reload();
    });
    watchIconCss.on('change', function(event) {
        notifier.notify({ 'title': name, 'icon': notifyIconPath, 'message': 'SVG and CSS Updated' });
        browserSync.reload();
    });
});




// TASKS
// Bumps up the version number of the package file
function bumpVersionNumber(level) {
    const version = semver.inc(vars.version, level);

    ejsVars.version = version;

    return version;
}
gulp.task('bump:major', function() {
    const version = bumpVersionNumber('major');

    gulp.src('./package.json')
        .pipe(gulp.dest(bases.build + 'package'))
        .pipe($.bump({version: version}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump:minor', function() {
    const version = bumpVersionNumber('minor');

    gulp.src('./package.json')
        .pipe(gulp.dest(bases.build + 'package'))
        .pipe($.bump({version: version}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump:patch', function() {
    const version = bumpVersionNumber('patch');

    gulp.src('./package.json')
        .pipe(gulp.dest(bases.build + 'package'))
        .pipe($.bump({version: version}))
        .pipe(gulp.dest('./'));
});

// Removes `css`, `js` folders from theme folder
gulp.task('cleanBuild', function() {
    return gulp.src(bases.build, {read: false})
        .pipe($.clean({force: true}));
});
gulp.task('cleanCritCss', function() {
    return gulp.src([bases.build + 'critcss/', bases.html + '_critcss/'], {read: false})
        .pipe($.clean({force: true}));
});
gulp.task('cleanCss', function() {
    return gulp.src([paths.distCss, bases.build + 'css'], {read: false})
        .pipe($.clean({force: true}));
});
gulp.task('cleanFavicon', function() {
    return gulp.src([paths.distImg + 'meta/', bases.build + 'favicon'], {read: false})
        .pipe($.clean({force: true}));
});
gulp.task('cleanIcon', function() {
    return gulp.src([paths.distIcon, bases.build + 'icon'], {read: false})
        .pipe($.clean({force: true}));
});
gulp.task('cleanImg', function() {
    return gulp.src([paths.distImg, bases.build + 'img'], {read: false})
        .pipe($.clean({force: true}));
});

// Run Critical CSS and place in build folder
for (let i=0; i<vars.critcss.length; i++) {
    ejsVars['critcss' + vars.critcss[i].critCssFilename] = '/critcss/' + vars.critcss[i].critCssFilename + '.css';
    critCssTasks.push('critcss:' + vars.critcss[i].critCssFilename);
    gulp.task('critcss:' + vars.critcss[i].critCssFilename, ['css:cleaned'], function(cb) {
        if (vars.critcss[i].src === 'https://starter.wbrowar.com/critcss/') {
            $.gutil.log($.gutil.colors.inverse(' Critical CSS is not set up, yet. Change your settings in package.json to use Critical CSS. '));
        }
        critical.generate({
            src: vars.critcss[i].src,
            css: [paths.distCss + vars.critcss[i].cssFilename + '.css'],
            width: vars.critcss[i].width ? vars.critcss[i].width : 1280,
            height: vars.critcss[i].height ? vars.critcss[i].height : 960,
            dest: bases.build + 'critcss/' + vars.critcss[i].critCssFilename + '.css',
            minify: true,
            extract: false,
        }, function (err, output) {
            gulp.src(bases.build + 'critcss/' + vars.critcss[i].critCssFilename + '.css')
                .pipe($.replace('{#', '{ #'))
                .pipe(gulp.dest(bases.build + 'critcss/'))
                .pipe(gulp.dest(bases.html + '_critcss/'));
            cb();
        });
    });
}
gulp.task('critCss', critCssTasks);

// Compile SCSS files (all `.scss` files that don't start with `_`)
// Adds autoprefixing
// Compresses CSS
function cssHandler() {
    return gulp.src(paths.filesScss)
        .pipe($.changed(paths.distCss))
        .pipe($.sassGlob())
        .pipe($.sass({outputStyle: (release ? 'compressed' : 'expanded')}).on('error', $.sass.logError))
        .pipe(gulp.dest(bases.build + 'css/sass'))
        .pipe($.autoprefixer({
            browsers: vars.browserlist,
            cascade: false
        }))
        .pipe(gulp.dest(bases.build + 'css/autoprefixer'))
        .pipe($.replace('{#', '{ #'))
        .pipe(gulp.dest(bases.build + 'css/replaced/'))
        .pipe(gulp.dest(paths.distCss))
        .pipe(browserSync.stream());
}
gulp.task('css:cleaned', ['cleanCss', 'icon', 'icon:css'], function(cb) {
    return cssHandler();
});
gulp.task('css', function() {
    return cssHandler();
});

// Create _fonts.scss file from package.json settings
gulp.task('font', function() {
    return gulp.src(paths.utilFonts)
        .pipe($.ejs(ejsVars, ejsOptions))
        .pipe($.rename({ extname: '.scss' }))
        .pipe(gulp.dest(paths.srcCss + 'automated/'));
});

// Move icons
gulp.task('icon', ['cleanIcon'], function() {
    return gulp.src([paths.filesIcon])
        .pipe(gulp.dest(function(file) {
            // if icon is in the css directory move it out to the root, but leave other directory structures intact
            const pathDir = path.dirname(file.path);

            if (pathDir.substr(pathDir.length - 4) == '/css') {
                file.path = file.base + path.basename(file.path);
            }

            return paths.distIcon;
        }));
});
gulp.task('icon:css', function() {
    return gulp.src(paths.filesIconCss)
        .pipe($.imagemin())
        .pipe($.svgInline({ className: '.icon_%s' }))
        .pipe($.replace('background-image', 'background-position: center center; background-repeat: no-repeat; background-size: contain; background-image'))
        .pipe($.concat('_icon_sprite.scss'))
        .pipe(gulp.dest(paths.srcCss + 'automated/'));
});

// Resize 2x images
// Turn SVGs into CSS sprite
// Losslessly compress images
function imgMoveHandler(cb = null) {
    gulp.src([paths.srcImg + '**/*.{png,jpg,gif,svg}', '!' + paths.srcImg + '2x/**/*'])
        .pipe($.changed(paths.distImg))
        .pipe(gulp.dest(bases.build + 'img/moved'))
        .pipe($.imagemin())
        .pipe(gulp.dest(paths.distImg));

    if (cb !== null) {
        cb();
    }
}
function imgResizeHandler(cb = null) {
    gulp.src(paths.srcImg + '2x/**/*.{png,jpg,gif}')
        .pipe($.changed(paths.distImg))
        .pipe($.responsive({
            '*': [{
                width: '50%'
            },{
                rename: { suffix: '@2x' }
            }]
        }))
        .pipe(gulp.dest(bases.build + 'img/resized'))
        .pipe($.imagemin())
        .pipe(gulp.dest(paths.distImg));

    if (cb !== null) {
        cb();
    }
};
gulp.task('img:cleaned', ['cleanImg'], function(cb) {
    imgMoveHandler();
    imgResizeHandler(cb);
});
gulp.task('img', function(cb) {
    imgMoveHandler();
    imgResizeHandler(cb);
});

// Compile HTML, TWIG, and PHP files
for (var val in vars.ejsVars) {
    ejsVars[val] = vars.ejsVars[val];
}
gulp.task('ejs', ['favicons'], function() {
    ejsVars.critCssEnabled = false;

    return gulp.src(paths.filesHtml)
        .pipe($.changed(bases.html))
        .pipe($.ejs(ejsVars, ejsOptions))
        .pipe(gulp.dest(bases.html));
});
gulp.task('ejs:release', ['critCss', 'favicons'], function() {
    ejsVars.critCssEnabled = true;
    var minOptions = {
        collapseWhitespace: true,
    }

    return gulp.src(paths.filesHtml)
        .pipe($.ejs(ejsVars, ejsOptions))
        .pipe(gulp.dest(bases.build + 'html/ejs'))
        .pipe(vars.minify_html === "true" ? $.htmlmin(minOptions) : $.gutil.noop())
        .pipe(gulp.dest(bases.html));
});
gulp.task('ejs:quick:full', function(cb) {
    ejsVars.critCssEnabled = false;

    gulp.src(paths.filesHtml)
        .pipe($.ejs(ejsVars, ejsOptions))
        .pipe(gulp.dest(bases.html));

    browserSync.reload();

    cb();
});
gulp.task('ejs:quick', function(cb) {
    ejsVars.critCssEnabled = false;

    gulp.src(paths.filesHtml)
        .pipe($.changed(bases.html))
        .pipe($.ejs(ejsVars, ejsOptions))
        .pipe(gulp.dest(bases.html));

    browserSync.reload();

    cb();
});

// Generate favicons
gulp.task('favicons', ['favicons:generate'], function() {
    return gulp.src(bases.build + 'favicon/**/*')
        .pipe(gulp.dest(paths.distImg + 'meta/'));
});
gulp.task('favicons:generate', ['cleanFavicon'], function() {
    return gulp.src(notifyIconPath)
        .pipe($.favicons({
            html: bases.build + 'favicon/favicons.html',
            path: bases.site + 'img/meta',
        }))
        .pipe(gulp.dest(bases.build + 'favicon'));
});

// Run webpack
gulp.task('webpack', function(cb) {
    webpack(webpackConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack:build', err);
        }

        $.gutil.log('[webpack:build] Completed\n' + stats.toString({
            assets: true,
            chunks: false,
            chunkModules: false,
            colors: true,
            hash: false,
            timings: false,
            version: false
        }));

        cb();

        browserSync.reload();
    });
});


// UTILITY FUNCTIONS
function _parseArgv() {

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
function _randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}