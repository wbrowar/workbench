'use strict';

// Package Variables
const fs = require('fs'),
    vars = JSON.parse(fs.readFileSync('./package.json'));

const name = vars.name,
    copyFirstCssFiles = vars.copyFirstCssFiles,
    copyFirstJsFiles = vars.copyFirstJsFiles,
    critCssTasks = [],
    gulpiconCustomSelectors = vars.gulpiconCustomSelectors;

// Paths
const bases = {
  source: vars.source_path,
  build:  vars.build_path,
  theme:  vars.theme_path,
  html:   vars.html_path,
  site:   vars.site_root,
};
const paths = {
  distCss:    bases.theme + 'css/',
  distImg:    bases.theme + 'img/',
  distJs:     bases.theme + 'js/',
  srcCss:     bases.source + '_sass/',
  srcImg:     bases.source + '_img/',
  srcJs:      bases.source + '_js/',
  filesHtml:  [bases.source + '_html/**/*.html', bases.source + '_html/**/*.php', bases.source + '_html/**/*.twig'],
  filesImg:   bases.source + '_img/**/*.{png,jpg,gif}',
  filesJs:    [bases.source + '_js/**/*.js', '!' + bases.source + '_js/require-config.js', '!' + bases.source + '_js/_lib/**/*'],
  filesJsLib: [bases.source + '_js/_lib/**/*', '!' + bases.source + '_js/_lib/**/*.min.js'],
  filesScss:  bases.source + '_sass/**/*.scss',
  filesSvg:   bases.source + '_img/icons/**/*.{svg}',
};

// Gulp Variables
const critical        = require('critical'),
      notifier        = require('node-notifier'),
      glob            = require("glob"),
      gulp            = require('gulp'),
      gulpLoadPlugins = require('gulp-load-plugins'),
      $               = gulpLoadPlugins({
        rename: {
          'gulp-svg-inline-css': 'svgInline',
          'gulp-util':           'gutil',
        }
      });

const ejsVars = {
  root:               bases.build,
  enable_font_events: vars.enable_font_events,
  enable_require_js:  vars.enable_require_js,
  favicons:           '/favicon/favicons.html',
  site_root:          vars.site_root,
  loadcss:            '/js/uglify/_lib/loadCSS.min.js',
  requirejs:          '/js/uglify/_lib/require.min.js',
  requireconfig:      '/js/uglify/require-config.min.js',
  version:            vars.version,
};




// COMMANDS
// [gulp]
gulp.task('default',function() {
  var text  = `\n\n${$.gutil.colors.inverse('        COMMANDS        ')}`
      + `\n––––––––––––––––––––––––\n`
      + `\n${$.gutil.colors.inverse(' gulp first ')}`
      + `\n${$.gutil.colors.bold('└─ Moves all important files from npm and bower to _source/_js/_lib/')}\n`
      + `\n${$.gutil.colors.inverse(' gulp run ')}`
      + `\n${$.gutil.colors.bold('└─ Processes CSS, JS, and image files.')}\n`
      + `\n${$.gutil.colors.inverse(' gulp release ')}`
      + `\n${$.gutil.colors.bold('└─ Performs all tasks, including Critical CSS and processing HTML files.')}\n`
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
      + `\n${$.gutil.colors.inverse(' enable_babel ')}`
      + `\n${$.gutil.colors.bold('└─ When running the \`gulp release\` task, babel can be used to process ES6 Javascript into ES5 Javascript for older browsers.')}\n`
      + `\n${$.gutil.colors.inverse(' enable_font_events ')}`
      + `\n${$.gutil.colors.bold('└─ Turn on Font Events for fonts loaded from this server.')}\n`
      + `\n${$.gutil.colors.inverse(' enable_require_js ')}`
      + `\n${$.gutil.colors.bold('└─ Enable RequireJS for async loading of JS files.')}\n`
      + `\n${$.gutil.colors.inverse(' minify_html ')}`
      + `\n${$.gutil.colors.bold('└─ Enable minification of HTML in the \`gulp release\` task. Turn this off when theming with PHP and Twig files.')}\n`
      + `\n${$.gutil.colors.inverse(' critcss ')}`
      + `\n${$.gutil.colors.bold('└─ Settings used to run Crtitical CSS for muliple page templates. \`"critCssFilename"\` is used in the \`ejs\` task to include the CSS. For example, to include the Critical CSS for \`"home"\`, use this in your theme file: \`<%- include(critcsshome) %>\`')}\n`
      + `\n${$.gutil.colors.inverse(' copyFirstCssFiles ')}`
      + `\n${$.gutil.colors.bold('└─ Array of files to be pulled into \`_source/_sass\` when running \`gulp first\`. CSS files will be have \`_\` prepended so they will not compile when the \`sass\` task is run unless they are included into another \`.scss\` file.')}\n`
      + `\n${$.gutil.colors.inverse(' copyFirstJsFiles ')}`
      + `\n${$.gutil.colors.bold('└─ Array of files to be pulled into \`_source/_js/_lib\` when running \`gulp first\`.')}\n`
      + `\n${$.gutil.colors.inverse(' ejsVars ')}`
      + `\n${$.gutil.colors.bold('└─ Additional files and settings for use in the \`ejs\` task. All paths must start from the \`_build\` folder.')}\n`
      + `\n${$.gutil.colors.inverse(' gulpiconCustomSelectors ')}`
      + `\n${$.gutil.colors.bold('└─ Additional selector for use when running the \`gulpicon\` task. Look in the Grunticon documentation for usage exampes.')}\n`;
	$.gutil.log(text);
	$.gutil.beep();
});


/* Package Variables
   • source_path – path to your `_source` folder from the root
   • build_path – path where `_build` folder should be placed
   • theme_path – the folder where `css`, `js` folders are placed
   • html_path – the folder where html, twig, and php files are placed
   • site_root – appended to asset URLs sourced in your template files
   • enable_font_events – enables Font Face Observer (requires edits to `require-config.js`, `index_gulp.html`
*/

// [gulp first]
gulp.task('first', ['copyFirstCss', 'copyFirstJs']);

// [gulp run]
gulp.task('run', ['css:cleaned', 'img:cleaned', 'js:cleaned'], function() {
  return notifier.notify({ 'title': name, 'message': 'Run Complete' });
});

// [gulp release]
gulp.task('release', ['critCss', 'img:cleaned', 'js:babel', 'ejs:full'], function() {
  return notifier.notify({ 'title': name, 'message': 'Release Complete' });
});

// [gulp watch]
gulp.task('watch', function() {
  $.livereload.listen();
  var watchHtml = gulp.watch(paths.filesHtml, ['ejs:quick']),
      watchJs   = gulp.watch(paths.filesJs, ['js']),
      watchImg  = gulp.watch(paths.filesImg, ['img']),
      watchCss  = gulp.watch(paths.filesScss, ['css']),
      watchCss  = gulp.watch(paths.filesSvg, ['css:cleaned']);

  watchCss.on('change', function(event) {
    notifier.notify({ 'title': name, 'message': 'CSS Updated' });
    $.livereload();
  });
  watchHtml.on('change', function(event) {
    notifier.notify({ 'title': name, 'message': 'HTML Updated' });
    $.livereload();
  });
  watchImg.on('change', function(event) {
    notifier.notify({ 'title': name, 'message': 'Images Updated' });
    $.livereload();
  });
  watchJs.on('change', function(event) {
    notifier.notify({ 'title': name, 'message': 'JS Updated' });
    $.livereload();
  });
});




// TASKS
// Removes `css`, `js` folders from theme folder
gulp.task('cleanBuild', function() {
  return gulp.src(bases.build, {read: false})
  .pipe($.clean());
});
gulp.task('cleanCritCss', function() {
  return gulp.src(bases.build + 'critcss/', {read: false})
  .pipe($.clean());
});
gulp.task('cleanCss', function() {
  return gulp.src([paths.distCss, bases.build + 'css'], {read: false})
  .pipe($.clean());
});
gulp.task('cleanFavicon', function() {
  return gulp.src([paths.distImg + 'meta/', bases.build + 'favicon'], {read: false})
  .pipe($.clean());
});
gulp.task('cleanImg', function() {
  return gulp.src([paths.distImg, bases.build + 'img'], {read: false})
  .pipe($.clean());
});
gulp.task('cleanJs', function() {
  return gulp.src([paths.distJs, bases.build + 'js'], {read: false})
  .pipe($.clean());
});

// Copy files from `node_modules` and `bower_components` folders
gulp.task('copyFirstCss', function() {
  return gulp.src(copyFirstCssFiles)
  .pipe($.rename({ extname: '.scss', prefix: '_' }))
  .pipe(gulp.dest(paths.srcCss));
});
gulp.task('copyFirstJs', function() {
  return gulp.src(copyFirstJsFiles)
  .pipe(gulp.dest(paths.srcJs + '_lib/'));
});

// Run Critical CSS and place in build folder
for (let i=0; i<vars.critcss.length; i++) {
  ejsVars['critcss' + vars.critcss[i].critCssFilename] = '/critcss/' + vars.critcss[i].critCssFilename + '.css';
  critCssTasks.push('critcss:' + vars.critcss[i].critCssFilename);
  gulp.task('critcss:' + vars.critcss[i].critCssFilename, ['css:cleaned'], function() {
    return critical.generate({
      src: vars.critcss[i].src,
      css: [paths.distCss + vars.critcss[i].cssFilename + '.css'],
      width: 1280,
      height: 960,
      dest: bases.build + 'critcss/' + vars.critcss[i].critCssFilename + '.css',
      minify: true,
      extract: false
    });
  });
}
gulp.task('critCss', critCssTasks);
//for (let i=0; i<vars.critcss.length; i++) {
//  ejsVars['critcss' + vars.critcss[i].critCssFilename] = '/critcss/' + vars.critcss[i].critCssFilename + '.css';
//  var func = function() {
//    critical.generate({
//      src: vars.critcss[i].src,
//      css: [paths.distCss + vars.critcss[i].cssFilename + '.css'],
//      width: 1280,
//      height: 960,
//      dest: bases.build + 'critcss/' + vars.critcss[i].critCssFilename + '.css',
//      minify: true,
//      extract: false
//    });
//  }
//  critCssTasks.push(func);
//}
//gulp.task('critCss', ['css:cleaned'], function() {
//  for (let i=0; i<critCssTasks.length; i++) {
//    critCssTasks[i]();
//  }
//});

// Compile SCSS files (all `.scss` files that don't start with `_`)
// Adds autoprefixing
// Compresses CSS
function cssHandler() {
  return gulp.src(paths.filesScss)
  .pipe($.changed(paths.distCss))
  .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
  .pipe(gulp.dest(bases.build + 'css/sass'))
  .pipe($.autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
  .pipe(gulp.dest(bases.build + 'css/autoprefixer'))
  .pipe(gulp.dest(paths.distCss));
}
gulp.task('css:cleaned', ['cleanCss', 'svg'], function(cb) {
  return cssHandler();
});
gulp.task('css', function() {
  return cssHandler();
});

// Resize 2x images
// Run Grunticon
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
  .pipe(gulp.dest(paths.distImg + 'icons/'))
  .pipe($.svgInline({ className: '.icon_%s' }))
  .pipe($.concat('_icons.scss'))
  .pipe(gulp.dest(paths.srcCss));
});

// Uglify JS
function jsHandler(useBabel = false, useUglify = false) {
  var babelOptions = {
    presets: ['es2015'],
  }

  return gulp.src(paths.filesJs)
  .pipe($.changed(paths.distJs, {extension: '.min.js'}))
  .pipe(useBabel == true && vars.enable_babel === "true" ? $.babel(babelOptions) : $.gutil.noop())
  .pipe(useUglify ? $.uglify() : $.gutil.noop())
  .pipe($.rename({ extname: '.min.js' }))
  .pipe(gulp.dest(bases.build + 'js/uglify'))
  .pipe(gulp.dest(paths.distJs));
};
function jsLibHandler(useUglify = false) {
  return gulp.src(paths.filesJsLib)
  .pipe($.changed(paths.distJs + '_lib/', {extension: '.min.js'}))
  .pipe(useUglify ? $.uglify() : $.gutil.noop())
  .pipe($.rename({ extname: '.min.js' }))
  .pipe(gulp.dest(bases.build + 'js/uglify/_lib/'))
  .pipe(gulp.dest(paths.distJs + '_lib/'));
};
function jsRequireConfigHandler(useUglify = false) {
  return gulp.src(paths.srcJs + 'require-config.js')
  .pipe($.changed(paths.distJs, {extension: '.min.js'}))
  .pipe(useUglify ? $.uglify() : $.gutil.noop())
  .pipe($.rename({ extname: '.min.js' }))
  .pipe(gulp.dest(bases.build + 'js/uglify/'))
  .pipe(gulp.dest(paths.distJs));
};
gulp.task('js:babel', ['cleanJs'], function() {
  jsHandler(true, true);
  jsLibHandler(true);
  jsRequireConfigHandler(true);
});
gulp.task('js:cleaned', ['cleanJs'], function() {
  jsHandler();
  jsLibHandler();
  jsRequireConfigHandler();
});
gulp.task('js', function() {
  jsHandler();
  jsLibHandler();
});

// Compile HTML, TWIG, and PHP files
for (var val in vars.ejsVars) {
  ejsVars[val] = vars.ejsVars[val];
}
gulp.task('ejs:full', ['critCss', 'favicons'], function() {
  ejsVars.critCssEnabled = true;
  var minOptions = {
    collapseWhitespace: true,
  }

  return gulp.src(paths.filesHtml)
  .pipe($.ejs(ejsVars))
  .pipe(gulp.dest(bases.build + 'html/ejs'))
  .pipe(vars.minify_html === "true" ? $.htmlmin(minOptions) : $.gutil.noop())
  .pipe(gulp.dest(bases.html));
});
gulp.task('ejs:quick', function() {
  ejsVars.critCssEnabled = false;

  return gulp.src(paths.filesHtml)
  .pipe($.changed(bases.html))
  .pipe($.ejs(ejsVars))
  .pipe(gulp.dest(bases.html));
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