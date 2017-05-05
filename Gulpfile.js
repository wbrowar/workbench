'use strict';

// Package Variables
const fs = require('fs'),
    vars = JSON.parse(fs.readFileSync('./package.json'));

const name = vars.name,
    copyFirstCssFiles = vars.copyFirstCssFiles,
    copyFirstJsFiles = vars.copyFirstJsFiles,
    critCssTasks = [],
    release = (process.argv[2] && (process.argv[2] === 'release' || process.argv[2] === 'releasefeature' || process.argv[2] === 'releasemajor')) ? true : false;

// Paths
const bases = {
    source: './' + vars.source_path,
    build:  './' + vars.build_path,
    theme:  './' + vars.theme_path,
    html:   './' + vars.html_path,
    site:          vars.site_root,
};
const paths = {
    distCss:                bases.theme + 'css/',
    distImg:                bases.theme + 'img/',
    distJs:                 bases.theme + 'js/',
    distIcon:               bases.theme + 'icon/',
    srcCss:                 bases.source + '_sass/',
    srcImg:                 bases.source + '_img/',
    srcJs:                  bases.source + '_js/',
    srcUtil:                bases.source + '_util/',
    filesHtml:              [bases.source + '_html/**/*.{html,php,twig,ejs}', '!' + bases.source + '_html/ejs_includes/*.{html,php,twig,ejs}'],
    filesHtmlIncludes:      bases.source + '_html/ejs_includes/*.{html,php,twig,ejs}',
    filesHtmlStyleTemplate: vars.style_template !== '' ? bases.source + '_util/' + vars.style_template + '**/*.ejs' : '',
    filesImg:               bases.source + '_img/**/*.{png,jpg,gif}',
    filesJs:                [bases.source + '_js/**/*.js', '!' + bases.source + '_js/system-config.js', '!' + bases.source + '_js/_lib/**/*'],
    filesJsLib:             [bases.source + '_js/_lib/**/*', '!' + bases.source + '_js/_lib/**/*.min.js'],
    filesJsLibMin:          bases.source + '_js/_lib/**/*.min.js',
    filesScss:              bases.source + '_sass/**/*.scss',
    filesSvg:               bases.source + '_img/icons/**/*.{svg}',
    utilFonts:              bases.source + '_util/_fonts.ejs',
};

// Gulp Variables
const browserSync     = require('browser-sync').create(),
      critical        = require('critical'),
      glob            = require("glob"),
      gulp            = require('gulp'),
      gulpLoadPlugins = require('gulp-load-plugins'),
      notifier        = require('node-notifier'),
      semver          = require('semver'),
      $               = gulpLoadPlugins({
          rename: {
              'gulp-sass-glob':      'sassGlob',
              'gulp-svg-inline-css': 'svgInline',
              'gulp-util':           'gutil',
          }
      });

const ejsVars = {
    enable_font_events:  vars.enable_font_events,
    enable_system_js:    vars.enable_system_js,
    favicons:            '/favicon/favicons.html',
    fonts:               vars.fonts,
    loadcss:             '/js/uglify/_lib/loadCSS.min.js',
    release:             release,
    site_root:           bases.site,
    styleTemplateConfig: !['', 'n', 'no'].includes(vars.style_template.toLowerCase()) ? JSON.parse(fs.readFileSync(paths.srcUtil + vars.style_template + 'config.json')) : null,
    styleTemplatePrefix:   vars.style_template_url_prefix,
    styleTemplateSuffix:   vars.style_template_url_suffix,
    systemjs:            '/js/uglify/_lib/system.min.js',
    systemconfig:        '/js/uglify/system-config.min.js',
    version:             release ? vars.version : (new Date().getTime() / 1000),
};
const ejsOptions = {
    root:                bases.build,
}

//require('events').EventEmitter.prototype._maxListeners = 10000;



// COMMANDS
// [gulp]
gulp.task('default',function() {
    var text  = `\n\n${$.gutil.colors.inverse('        COMMANDS        ')}`
        + `\n––––––––––––––––––––––––\n`
        + `\n${$.gutil.colors.inverse(' gulp first ')}`
        + `\n${$.gutil.colors.bold('└─ Moves all important files from npm to _source/_js/_lib/')}\n`
        + `\n${$.gutil.colors.inverse(' gulp template ')}`
        + `\n${$.gutil.colors.bold('└─ Moves files from _source/_util/ into _source/ based on the folder set for "style_template" in \`package.json\`. Before running this task, modify settings in the template\'s config.json. This task should only be run one time at the beginning of development.')}\n`
        + `\n${$.gutil.colors.inverse(' gulp font ')}`
        + `\n${$.gutil.colors.bold('└─ Uses info in \`package.json\` to generate _source/_sass/automated/_fonts.scss')}\n`
        + `\n${$.gutil.colors.inverse(' gulp run ')}`
        + `\n${$.gutil.colors.bold('└─ Processes CSS, JS, and image files.')}\n`
        + `\n${$.gutil.colors.inverse(' gulp release ')}`
        + `\n${$.gutil.colors.bold('└─ Performs all tasks, including Critical CSS and processing HTML files.\n\n\`gulp release\` advances the version number in \`package.json\` by 0.0.1. Running \`gulp releasefeature\` will advance it by 0.1.0; and running \`gulp releasemajor\` will advance it by 1.0.0.')}\n`
        + `\n${$.gutil.colors.inverse(' gulp vars ')}`
        + `\n${$.gutil.colors.bold('└─ Descriptions of variables found in \`package.json\`.')}\n`
        + `\n${$.gutil.colors.inverse(' gulp watch ')}`
        + `\n${$.gutil.colors.bold('└─ Watches source folders and runs tasks based on the type of file changed.')}\n`;
    $.gutil.log(text);
    $.gutil.beep();
});

// [gulp vars]
gulp.task('vars',function() {
    var text  = `\n\n${$.gutil.colors.inverse('        VARIABLES        ')}`
        + `\n–––––––––––––––––––––––––`
        + `\n${$.gutil.colors.italic('NOTE: all paths start from the root folder and should not include a leading slash. Example: "source_path": "_source/"')}\n`
        + `\n${$.gutil.colors.inverse(' version ')}`
        + `\n${$.gutil.colors.bold('└─ Project version number in SEMVER format: 1.1.1 = Major.Feature.Fixes')}\n`
        + `\n${$.gutil.colors.inverse(' source_path ')}`
        + `\n${$.gutil.colors.bold('└─ Path to the \`_source\` folder. Edit all theme files in the \`_source\` folder.')}\n`
        + `\n${$.gutil.colors.inverse(' build_path ')}`
        + `\n${$.gutil.colors.bold('└─ Location of \`_build\` folder. When commands fail, look in the \`_build\` folder to see what went wrong.')}\n`
        + `\n${$.gutil.colors.inverse(' theme_path ')}`
        + `\n${$.gutil.colors.bold('└─ Path to where the \`css\`, \`js\`, and \`img\` theme folders will be placed.')}\n`
        + `\n${$.gutil.colors.inverse(' html_path ')}`
        + `\n${$.gutil.colors.bold('└─ Path to where HTML, PHP, or Twig template files will be placed.')}\n`
        + `\n${$.gutil.colors.inverse(' site_root ')}`
        + `\n${$.gutil.colors.bold('└─ A string prepended to paths when linking to \`.css\` and \`.js\` files in the template.')}\n`
        + `\n${$.gutil.colors.inverse(' style_template_url_prefix ')}`
        + `\n${$.gutil.colors.bold('└─ Prepends this string to navigation links used in the style inventory.')}\n`
        + `\n${$.gutil.colors.inverse(' style_template_url_suffix ')}`
        + `\n${$.gutil.colors.bold('└─ Appends a file extension or another string if needed to link to style inventory pages.')}\n`
        + `\n${$.gutil.colors.inverse(' style_template ')}`
        + `\n${$.gutil.colors.bold('└─ Select the folder to pull template overrides from when running \`gulp template\`.')}\n`
        + `\n${$.gutil.colors.inverse(' enable_babel ')}`
        + `\n${$.gutil.colors.bold('└─ When running the \`gulp release\` task, babel can be used to process ES6 Javascript into ES5 Javascript for older browsers.')}\n`
        + `\n${$.gutil.colors.inverse(' enable_font_events ')}`
        + `\n${$.gutil.colors.bold('└─ Turn on Font Events for fonts loaded from this server.')}\n`
        + `\n${$.gutil.colors.inverse(' enable_system_js ')}`
        + `\n${$.gutil.colors.bold('└─ Enable SystemJS for async loading of JS files.')}\n`
        + `\n${$.gutil.colors.inverse(' minify_html ')}`
        + `\n${$.gutil.colors.bold('└─ Enable minification of HTML in the \`gulp release\` task. Turn this off when theming with PHP and Twig files.')}\n`
        + `\n${$.gutil.colors.inverse(' browserSync ')}`
        + `\n${$.gutil.colors.bold('└─ Configure BrowserSync to reload your website as \`watch\` tasks are run. Change \`url\` to the page on your site that you want to start on when \`gulp watch\` is run.')}\n`
        + `\n${$.gutil.colors.inverse(' critcss ')}`
        + `\n${$.gutil.colors.bold('└─ Settings used to run Crtitical CSS for muliple page templates. \`"critCssFilename"\` is used in the \`ejs\` task to include the CSS. For example, to include the Critical CSS for \`"home"\`, use this in your theme file: \`<%- include(critcsshome) %>\`')}\n`
        + `\n${$.gutil.colors.inverse(' copyFirstCssFiles ')}`
        + `\n${$.gutil.colors.bold('└─ Array of files to be pulled into \`_source/_sass\` when running \`gulp first\`. CSS files will be have \`_\` prepended so they will not compile when the \`sass\` task is run unless they are included into another \`.scss\` file.')}\n`
        + `\n${$.gutil.colors.inverse(' copyFirstJsFiles ')}`
        + `\n${$.gutil.colors.bold('└─ Array of files to be pulled into \`_source/_js/_lib\` when running \`gulp first\`.')}\n`
        + `\n${$.gutil.colors.inverse(' ejsVars ')}`
        + `\n${$.gutil.colors.bold('└─ Additional files and settings for use in the \`ejs\` task. All paths must start from the \`_build\` folder.')}\n`
        + `\n${$.gutil.colors.inverse(' fonts ')}`
        + `\n${$.gutil.colors.bold('└─ Configuration options used to generate font() SASS mixin. See README for more details.')}\n`
    $.gutil.log(text);
    $.gutil.beep();
});


/* Package Variables
 • source_path – path to your `_source` folder from the root
 • build_path – path where `_build` folder should be placed
 • theme_path – the folder where `css`, `js` folders are placed
 • html_path – the folder where html, twig, and php files are placed
 • site_root – appended to asset URLs sourced in your template files
 • enable_font_events – enables Font Face Observer (requires edits to `system-config.js`, `index.html`
 */

// [gulp first]
gulp.task('first', ['copyFirstCss', 'copyFirstJs']);

// [gulp template]
gulp.task('template:backup', function() {
    return gulp.src(bases.source + '**/*')
        .pipe(gulp.dest(bases.build + '_source_backup/'));
});
gulp.task('template', ['template:backup'], function() {
    return gulp.src(paths.srcUtil + vars.style_template + '/templates/**/*')
        .pipe($.ejs(ejsVars, ejsOptions))
        .pipe(gulp.dest(bases.source));
});

// [gulp run]
gulp.task('run', ['css:cleaned', 'img:cleaned', 'js:cleaned'], function() {
    return notifier.notify({ 'title': name, 'message': 'Run Complete' });
});

// [gulp release]
gulp.task('release', ['bump:patch', 'release:tasks']);
gulp.task('releasefeature', ['bump:minor', 'release:tasks']);
gulp.task('releasemajor', ['bump:major', 'release:tasks']);
gulp.task('release:tasks', ['critCss', 'img:cleaned', 'js:babel', 'ejs:release'], function() {
    return notifier.notify({ 'title': name, 'message': 'Release Complete' });
});

// [gulp watch]
gulp.task('watch', function() {
    //$.livereload.listen(35729);
    var watchCss          = gulp.watch(paths.filesScss, ['css']),
        watchHtml         = gulp.watch(paths.filesHtml, ['ejs:quick']),
        watchHtmlIncludes = gulp.watch([paths.filesHtmlIncludes, paths.filesHtmlStyleTemplate], ['ejs:quick:full']),
        watchImg          = gulp.watch(paths.filesImg, ['img']),
        watchJs           = gulp.watch(paths.filesJs, ['js']),
        watchSvg          = gulp.watch(paths.filesSvg, ['css:cleaned']);

    if (vars.browserSync.url === 'https://starter.wbrowar.com/') {
        $.gutil.log($.gutil.colors.inverse(' Browsersync is not set up, yet. Add your local site URL to the Browsersync setting in package.json. '));
    } else {
        browserSync.init({
            browser: vars.browserSync.browser,
            proxy: vars.browserSync.url,
        });
    }

    watchCss.on('change', function(event) {
        notifier.notify({ 'title': name, 'message': 'CSS Updated' });
    });
    watchHtml.on('change', function(event) {
        notifier.notify({ 'title': name, 'message': 'HTML Updated' });
    });
    watchHtmlIncludes.on('change', function(event) {
        notifier.notify({ 'title': name, 'message': 'HTML Updated' });
    });
    watchImg.on('change', function(event) {
        notifier.notify({ 'title': name, 'message': 'Images Updated' });
        browserSync.reload();
    });
    watchJs.on('change', function(event) {
        notifier.notify({ 'title': name, 'message': 'JS Updated' });
        browserSync.reload();
    });
    watchSvg.on('change', function(event) {
        notifier.notify({ 'title': name, 'message': 'SVG and CSS Updated' });
        browserSync.reload();
    });
});




// TASKS
// Bumps up the version number of the package file
function bumpVersionNumber(level) {
    var version = semver.inc(vars.version, level);

    ejsVars.version = version;

    return version;
}
gulp.task('bump:major', function() {
    var version = bumpVersionNumber('major');

    gulp.src('./package.json')
        .pipe(gulp.dest(bases.build + 'package'))
        .pipe($.bump({version: version}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump:minor', function() {
    var version = bumpVersionNumber('minor');

    gulp.src('./package.json')
        .pipe(gulp.dest(bases.build + 'package'))
        .pipe($.bump({version: version}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump:patch', function() {
    var version = bumpVersionNumber('patch');

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
    return gulp.src(bases.build + 'critcss/', {read: false})
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
gulp.task('cleanImg', function() {
    return gulp.src([paths.distImg, bases.build + 'img', '!' + paths.distImg + 'icons/'], {read: false})
        .pipe($.clean({force: true}));
});
gulp.task('cleanJs', function() {
    return gulp.src([paths.distJs, bases.build + 'js'], {read: false})
        .pipe($.clean({force: true}));
});

// Copy files from `node_modules` folder
gulp.task('copyFirstCss', function() {
    return gulp.src(copyFirstCssFiles)
        .pipe($.rename({ extname: '.scss', prefix: '_' }))
        .pipe(gulp.dest(paths.srcCss + 'lib/'));
});
gulp.task('copyFirstJs', function() {
    return gulp.src(copyFirstJsFiles)
        .pipe(gulp.dest(paths.srcJs + '_lib/'));
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
                .pipe(gulp.dest(bases.build + 'critcss/'));
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
        .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
        .pipe(gulp.dest(bases.build + 'css/sass'))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(bases.build + 'css/autoprefixer'))
        .pipe($.replace('{#', '{ #'))
        .pipe(gulp.dest(bases.build + 'css/replaced/'))
        .pipe(gulp.dest(paths.distCss))
        .pipe(browserSync.stream());
}
gulp.task('css:cleaned', ['cleanCss', 'svg'], function(cb) {
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

// Resize 2x images
// Turn SVGs into CSS sprite
// Losslessly compress images
function imgMoveHandler() {
    return gulp.src([paths.srcImg + '**/*.{png,jpg,gif,svg}', '!' + paths.srcImg + '2x/**/*', '!' + paths.srcImg + 'icons/**/*'])
        .pipe($.changed(paths.distImg))
        .pipe(gulp.dest(bases.build + 'img/moved'))
        .pipe($.imagemin())
        .pipe(gulp.dest(paths.distImg));
}
function imgResizeHandler() {
    return gulp.src(paths.srcImg + '2x/**/*.{png,jpg,gif}')
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
};
gulp.task('img:cleaned', ['cleanImg'], function() {
    imgMoveHandler();
    imgResizeHandler();
});
gulp.task('img', function() {
    imgMoveHandler();
    imgResizeHandler();
});
gulp.task('svg', function() {
    return gulp.src(paths.srcImg + 'icons/**/*.svg')
        .pipe($.imagemin())
        .pipe(gulp.dest(bases.build + 'icons/minimized'))
        .pipe(gulp.dest(paths.distIcon))
        .pipe($.svgInline({ className: '.icon_%s' }))
        .pipe($.replace('background-image', 'background-position: center center; background-repeat: no-repeat; background-size: contain; background-image'))
        .pipe($.concat('_icon_sprite.scss'))
        .pipe(gulp.dest(paths.srcCss + 'automated/'));
});

// Uglify JS
function jsHandler(useUglify = false) {
    var babelOptions = {
        presets: ['es2015'],
    }

    return gulp.src(paths.filesJs)
        .pipe($.changed(paths.distJs, {extension: '.min.js'}))
        .pipe(vars.enable_babel === "true" ? $.babel(babelOptions) : $.gutil.noop())
        .pipe(useUglify ? $.uglify() : $.gutil.noop())
        .pipe($.rename({ extname: '.min.js' }))
        .pipe(gulp.dest(bases.build + 'js/uglify'))
        .pipe(gulp.dest(paths.distJs));
};
function jsLibHandler(useUglify = false) {
    gulp.src(paths.filesJsLibMin)
        .pipe($.changed(paths.distJs + '_lib/'))
        .pipe(gulp.dest(bases.build + 'js/uglify/_lib/'))
        .pipe(gulp.dest(paths.distJs + '_lib/'));

    return gulp.src(paths.filesJsLib)
        .pipe($.changed(paths.distJs + '_lib/', {extension: '.min.js'}))
        .pipe(useUglify ? $.uglify() : $.gutil.noop())
        .pipe($.rename({ extname: '.min.js' }))
        .pipe(gulp.dest(bases.build + 'js/uglify/_lib/'))
        .pipe(gulp.dest(paths.distJs + '_lib/'));
};
function jsSystemConfigHandler(useUglify = false) {
    return gulp.src(paths.srcJs + 'system-config.js')
        .pipe($.changed(paths.distJs, {extension: '.min.js'}))
        .pipe(useUglify ? $.uglify() : $.gutil.noop())
        .pipe($.rename({ extname: '.min.js' }))
        .pipe(gulp.dest(bases.build + 'js/uglify/'))
        .pipe(gulp.dest(paths.distJs));
};
gulp.task('js:babel', ['cleanJs'], function() {
    jsHandler(true);
    jsLibHandler(true);
    jsSystemConfigHandler(true);
});
gulp.task('js:cleaned', ['cleanJs'], function() {
    jsHandler();
    jsLibHandler();
    jsSystemConfigHandler();
});
gulp.task('js', function() {
    jsHandler(false);
    jsLibHandler();
});

// Compile HTML, TWIG, and PHP files
for (var val in vars.ejsVars) {
    ejsVars[val] = vars.ejsVars[val];
}
if (ejsVars.styleTemplateConfig !== null) {
    for (var val in ejsVars.styleTemplateConfig.sections) {
        if (ejsVars.styleTemplateConfig.sections[val].enabled) {
            ejsVars['styletemplate'+val] = '/html/templates/modules/_' + val + '.ejs';
        }
    }
}
gulp.task('ejs:includes', function() {
    ejsVars.critCssEnabled = false;

    return gulp.src(paths.filesHtmlIncludes)
        .pipe($.changed(bases.html))
        .pipe($.ejs(ejsVars, ejsOptions))
        .pipe(gulp.dest(bases.build + 'html/ejs/ejs_includes'));
});
gulp.task('ejs:templates', function() {
    return gulp.src(paths.filesHtmlStyleTemplate)
        .pipe(gulp.dest(bases.build + 'html/templates/'));
});
gulp.task('ejs', ['favicons', 'ejs:includes', 'ejs:templates'], function() {
    ejsVars.critCssEnabled = false;

    return gulp.src(paths.filesHtml)
        .pipe($.changed(bases.html))
        .pipe($.ejs(ejsVars, ejsOptions))
        .pipe(gulp.dest(bases.html));
});
gulp.task('ejs:release', ['critCss', 'favicons', 'ejs:includes', 'ejs:templates'], function() {
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
gulp.task('ejs:quick:full', ['ejs:includes', 'ejs:templates'], function(cb) {
    ejsVars.critCssEnabled = false;

    gulp.src(paths.filesHtml)
        .pipe($.ejs(ejsVars, ejsOptions))
        .pipe(gulp.dest(bases.html));

    browserSync.reload();

    cb();
});
gulp.task('ejs:quick', ['ejs:includes', 'ejs:templates'], function(cb) {
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
    return gulp.src(bases.source + '_favicon/favicon.png')
        .pipe($.favicons({
            html: bases.build + 'favicon/favicons.html',
            path: bases.site + 'img/meta',
        }))
        .pipe(gulp.dest(bases.build + 'favicon'));
});