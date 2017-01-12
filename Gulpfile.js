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
      distIcon:   bases.theme + 'icon/',
      srcCss:     bases.source + '_sass/',
      srcImg:     bases.source + '_img/',
      srcJs:      bases.source + '_js/',
      filesHtml:  [bases.source + '_html/**/*.html', bases.source + '_html/**/*.php', bases.source + '_html/**/*.twig'],
      filesImg:   bases.source + '_img/**/*.{png,jpg,gif}',
      filesJs:    [bases.source + '_js/**/*.js', '!' + bases.source + '_js/system-config.js', '!' + bases.source + '_js/_lib/**/*'],
      filesJsLib: [bases.source + '_js/_lib/**/*', '!' + bases.source + '_js/_lib/**/*.min.js'],
      filesScss:  bases.source + '_sass/**/*.scss',
      filesSvg:   bases.source + '_img/icons/**/*.{svg}',
};

// Gulp Variables
const browserSync = require('browser-sync').create(),
      critical        = require('critical'),
      glob            = require("glob"),
      gulp            = require('gulp'),
      gulpLoadPlugins = require('gulp-load-plugins'),
      notifier        = require('node-notifier'),
      semver          = require('semver'),
      webshot         = require('webshot'),
      $               = gulpLoadPlugins({
        rename: {
          'gulp-svg-inline-css':    'svgInline',
          'gulp-util':              'gutil',
        }
      });

const ejsVars = {
      root:               bases.build,
      enable_font_events: vars.enable_font_events,
      enable_system_js:   vars.enable_system_js,
      favicons:           '/favicon/favicons.html',
      site_root:          vars.site_root,
      loadcss:            '/js/uglify/_lib/loadCSS.min.js',
      systemjs:           '/js/uglify/_lib/system.min.js',
      systemconfig:       '/js/uglify/system-config.min.js',
      version:            vars.version,
};

require('events').EventEmitter.prototype._maxListeners = 10000;




// COMMANDS
// [gulp]
gulp.task('default',function() {
  var text  = `\n\n${$.gutil.colors.inverse('        COMMANDS        ')}`
      + `\n––––––––––––––––––––––––\n`
      + `\n${$.gutil.colors.inverse(' gulp first ')}`
      + `\n${$.gutil.colors.bold('└─ Moves all important files from npm to _source/_js/_lib/')}\n`
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
      + `\n${$.gutil.colors.inverse(' enable_babel ')}`
      + `\n${$.gutil.colors.bold('└─ When running the \`gulp release\` task, babel can be used to process ES6 Javascript into ES5 Javascript for older browsers.')}\n`
      + `\n${$.gutil.colors.inverse(' enable_font_events ')}`
      + `\n${$.gutil.colors.bold('└─ Turn on Font Events for fonts loaded from this server.')}\n`
      + `\n${$.gutil.colors.inverse(' enable_system_js ')}`
      + `\n${$.gutil.colors.bold('└─ Enable SystemJS for async loading of JS files.')}\n`
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
      + `\n${$.gutil.colors.bold('└─ Additional selector for use when running the \`gulpicon\` task. Look in the Grunticon documentation for usage exampes.')}\n`
      + `\n${$.gutil.colors.inverse(' webshotScreenshots ')}`
      + `\n${$.gutil.colors.bold('└─ Array of pages to take screenshots of when running \`gulp release\`.')}\n`;
	$.gutil.log(text);
	$.gutil.beep();
});


/* Package Variables
   • source_path – path to your `_source` folder from the root
   • build_path – path where `_build` folder should be placed
   • theme_path – the folder where `css`, `js` folders are placed
   • html_path – the folder where html, twig, and php files are placed
   • site_root – appended to asset URLs sourced in your template files
   • enable_font_events – enables Font Face Observer (requires edits to `system-config.js`, `index_gulp.html`
*/

// [gulp first]
gulp.task('first', ['copyFirstCss', 'copyFirstJs']);

// [gulp run]
gulp.task('run', ['css:cleaned', 'img:cleaned', 'js:cleaned'], function() {
  return notifier.notify({ 'title': name, 'message': 'Run Complete' });
});

// [gulp release]
gulp.task('release', ['bump:patch', 'release:tasks']);
gulp.task('releasefeature', ['bump:minor', 'release:tasks']);
gulp.task('releasemajor', ['bump:major', 'release:tasks']);
gulp.task('release:tasks', ['critCss', 'img:cleaned', 'js:babel', 'ejs:full'], function() {
  webshotHandler();
  return notifier.notify({ 'title': name, 'message': 'Release Complete' });
});

// [gulp watch]
gulp.task('watch', function() {
  //$.livereload.listen(35729);
  var watchCss  = gulp.watch(paths.filesScss, ['css']),
      watchHtml = gulp.watch(paths.filesHtml, ['ejs:quick']),
      watchImg  = gulp.watch(paths.filesImg, ['img']),
      watchJs   = gulp.watch(paths.filesJs, ['js']),
      watchSvg  = gulp.watch(paths.filesSvg, ['css:cleaned']);

  if (vars.browserSync.url === 'http://google.com/') {
    $.gutil.log($.gutil.colors.inverse(' Browsersync is not set up, yet. Add your local site URL to the Browsersync setting in package.json. '));
  } else {
    browserSync.init({
      browser: vars.browserSync.browser,
      proxy: vars.browserSync.url,
    });
  }

  watchCss.on('change', function(event) {
    notifier.notify({ 'title': name, 'message': 'CSS Updated' });
    //browserSync.stream();
  });
  watchHtml.on('change', function(event) {
    notifier.notify({ 'title': name, 'message': 'HTML Updated' });
    browserSync.reload();
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
  gulp.task('critcss:' + vars.critcss[i].critCssFilename, ['css:cleaned'], function(cb) {
    if (vars.critcss[i].src === 'http://google.com/') {
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
  .pipe(gulp.dest(paths.distIcon))
  .pipe($.svgInline({ className: '.icon_%s' }))
  .pipe($.replace('background-image', 'background-position: center center; background-repeat: no-repeat; background-size: contain; background-image'))
  .pipe($.concat('_icons.scss'))
  .pipe(gulp.dest(paths.srcCss));
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
gulp.task('ejs', ['favicons'], function() {
  ejsVars.critCssEnabled = false;

  return gulp.src(paths.filesHtml)
  .pipe($.changed(bases.html))
  .pipe($.ejs(ejsVars))
  .pipe(gulp.dest(bases.html));
});
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

// Take screenshots of webpage, using Webshot
const webshot320 = {
  renderDelay: 10000,
  screenSize: {
    width: 320,
    height: 480
  },
  shotSize: {
    width: 'window',
    height: 'all'
  },
}, webshot768 = {
  renderDelay: 10000,
  screenSize: {
    width: 768,
    height: 2014
  },
  shotSize: {
    width: 'window',
    height: 'all'
  },
}, webshot1440 = {
  renderDelay: 10000,
  screenSize: {
    width: 1440,
    height: 900
  },
  shotSize: {
    width: 'window',
    height: 'all'
  },
}, webshot2560 = {
  renderDelay: 10000,
  screenSize: {
    width: 2560,
    height: 1440
  },
  shotSize: {
    width: 'window',
    height: 'all'
  },
}
function webshotHandler() {
  var date = new Date();
  var timestamp = date.getFullYear() + '-' + (date.getMonth()<10?'0':'') + date.getMonth() + '-' + (date.getDate()<10?'0':'') + date.getDate() + '-' + (date.getHours()<10?'0':'') + date.getHours() + ';' + (date.getMinutes()<10?'0':'') + date.getMinutes() + ';' + (date.getSeconds()<10?'0':'') + date.getSeconds();
  
  $.gutil.log('Taking screenshots');
  for (let i=0; i<vars.webshotScreenshots.length; i++) {
    if (vars.webshotScreenshots[i].url !== 'http://google.com/') {
      webshot(vars.webshotScreenshots[i].url, bases.source + '/screenshots/' + timestamp + '-' + vars.webshotScreenshots[i].name + '-320.png', webshot320, function() {});
      webshot(vars.webshotScreenshots[i].url, bases.source + '/screenshots/' + timestamp + '-' + vars.webshotScreenshots[i].name + '-768.png', webshot768, function() {});
      webshot(vars.webshotScreenshots[i].url, bases.source + '/screenshots/' + timestamp + '-' + vars.webshotScreenshots[i].name + '-1440.png', webshot1440, function() {});
      webshot(vars.webshotScreenshots[i].url, bases.source + '/screenshots/' + timestamp + '-' + vars.webshotScreenshots[i].name + '-2560.png', webshot2560, function() {});
    }
  }
}