module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    autoprefixer: {
      all: {
        options: {
          browsers: ['last 2 versions']
        },
        src: '<%= pkg.build_path %>css/compiled/all.css',
        dest: '<%= pkg.build_path %>css/release/all.css'
      },
      ie9: {
        options: {
          browsers: ['ie 9']
        },
        src: '<%= pkg.build_path %>css/compiled/ie9.css',
        dest: '<%= pkg.build_path %>css/release/ie9.css'
      }
    },
    clean: {
      css: [
        '<%= pkg.build_path %>css',
        '<%= pkg.build_path %>critcss',
        '<%= pkg.theme_path %>css/*'
        ],
      html: [
        '<%= pkg.build_path %>html',
        '<%= pkg.build_path %>html_backup/'
        ],
      images: [
        '<%= pkg.build_path %>img',
        '<%= pkg.build_path %>grunticon',
        '<%= pkg.theme_path %>img/*'
        ],
      scripts: [
        '<%= pkg.build_path %>js',
        '<%= pkg.theme_path %>js/*'
        ],
    },
    concat: {
      scriptshead: {
        options: {
          //sourceMap: true
        },
        src: [
          '<%= pkg.build_path %>js/modernizr-custom.js',
          '<%= pkg.source_path %>bower_components/loadcss/loadCSS.js',
          '<%= pkg.source_path %>_js/head.js'
          ],
        dest: '<%= pkg.build_path %>js/release/head.js',
      },
      scriptsmain: {
        options: {
          //sourceMap: true
        },
        src: [
          '<%= pkg.source_path %>bower_components/jquery/dist/jquery.js',
          '<%= pkg.source_path %>_js/main.js',
          '<%= pkg.source_path %>bower_components/picturefill/dist/picturefill.js'
        ],
        dest: '<%= pkg.build_path %>js/release/main.js',
      },
    },
    copy: {
      cssbuild: {
        files: [
          // move scss files to build folder
          {
            expand: true,
            cwd: '<%= pkg.source_path %>_sass/',
            src: '**/*',
            dest: '<%= pkg.build_path %>css/'
          },
        ],
      },
      grunticon: {
        files: [
          // move images to build folder
          {
            expand: true,
            cwd: '<%= pkg.build_path %>grunticon/',
            src: ['sprites.main.svg.css', 'sprites.main.png.css', 'icons.fallback.css'],
            dest: '<%= pkg.build_path %>css/release/'
          },
        ],
      },
      htmlbuild: {
        files: [
          // backup all HTML files (just in case)
          {
            expand: true,
            cwd: '<%= pkg.html_build_path %>',
            src: ['**/*.html', '!**/_source/**', '!**/_build/**', '!**/node_modules/**'],
            dest: '<%= pkg.build_path %>html_backup/'
          },
          // move images to build folder
          {
            expand: true,
            cwd: '<%= pkg.source_path %>_html/',
            src: '**/*',
            dest: '<%= pkg.build_path %>html/'
          },
        ],
      },
      imagesbuild: {
        files: [
          // move images to build folder
          {
            expand: true,
            cwd: '<%= pkg.source_path %>_img/',
            src: '**/*',
            dest: '<%= pkg.build_path %>img/'
          },
        ],
      },
      sourcemaps: {
        files: [
          // move css
          {
            expand: true,
            cwd: '<%= pkg.build_path %>css/compiled/',
            src: '**/*.css.map',
            dest: '<%= pkg.theme_path %>css/',
            filter: 'isFile'
          },
        ],
      },
    },
    criticalcss: {
      home: {
        options: {
          url: "index.html", // Change to live or dev URL
          width: 1200,
          height: 900,
          outputfile: "<%= pkg.build_path %>critcss/home.css",
          filename: "<%= pkg.theme_path %>css/all.css"
        }
      }
    },
    csslint: {
      options: {
        'adjoining-classes': false
      },
      dist: {
        src: '<%= pkg.build_path %>css/*_prefixed.css'
      },
    },
    cssmin: {
      styles: {
        files: [
          {
            expand: true,
            cwd: '<%= pkg.build_path %>css/release/',
            src: '**/*.css',
            dest: 'css/'
          }
        ],
      },
      critcss: {
        files: [
          { src: ['<%= pkg.build_path %>critcss/home.css'], dest: '_build/critcss/home.min.css'}
        ],
      },
    },
    favicons: {
      options: {
        trueColor: true,
        precomposed: true,
        appleTouchBackgroundColor: "#d2e5fc",
        coast: true,
        windowsTile: true,
        tileBlackWhite: true,
        tileColor: "none",
        html: '<%= pkg.build_path %>html/meta.html',
        HTMLPrefix: "/img/meta/"
      },
      icons: {
        src: '<%= pkg.source_path %>_favicon/favicon.png',
        dest: '<%= pkg.build_path %>img/meta/'
      }
    },
    grunticon: {
      main: {
        options: {
          datasvgcss: 'sprites.main.svg.css',
          datapngcss: 'sprites.main.png.css',
          pngfolder: '../img/icon_fallback/',
          pngpath: '../img/icon_fallback/',
          cssprefix: ".icon_"
        },
        files: [{
          expand: true,
          cwd: '<%= pkg.build_path %>img/icons',
          src: ['*.svg', '*.png'],
          dest: "<%= pkg.build_path %>/grunticon"
        }]
      }
    },
    htmlbuild: {
      layout: {
        src: '<%= pkg.source_path %>_html/*.html',
        dest: '<%= pkg.html_build_path %>',
        options: {
          scripts: {
            grunticon: '<%= pkg.build_path %>grunticon/grunticon.loader.js'
          },
          styles: {
            critcss: '<%= pkg.build_path %>critcss/home.min.css'
          },
          sections: {
            meta: '<%= pkg.build_path %>html/meta.html'
          },
          data: {
            theme_path: '<%= pkg.theme_path %>',
            version: '<%= pkg.version %>'
          }
        },
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= pkg.build_path %>img',
          src: ['**/*.{png,jpg,gif}', '!2x/*', '!icons/*'],
          dest: '<%= pkg.theme_path %>img/'
        }]
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      dist: {
        src: '<%= pkg.source_path %>_js/*.js'
      }
    },
    modernizr: {
      dist: {
        "devFile" : "<%= pkg.source_path %>_js/_lib/modernizr.custom.js",
        "outputFile" : "<%= pkg.build_path %>js/modernizr-custom.js",
        "extra" : {
            "shiv" : true,
            "printshiv" : false,
            "load" : true,
            "mq" : false,
            "cssclasses" : true
        },
        "extensibility" : {
            "addtest" : false,
            "prefixed" : false,
            "teststyles" : false,
            "testprops" : false,
            "testallprops" : false,
            "hasevents" : false,
            "prefixes" : false,
            "domprefixes" : false,
            "cssclassprefix": ""
        },
        "uglify" : false,
        "tests" : [],
        "parseFiles" : true,
        "matchCommunityTests" : false,
        "customTests" : []
      }
    },
    notify: {
      watchcss: {
        options: {
          title: 'Grunt Watch Complete',
          message: 'CSS updated'
        }
      },
      watchimg: {
        options: {
          title: 'Grunt Watch Complete',
          message: 'Images processed'
        }
      },
      watchjs: {
        options: {
          title: 'Grunt Watch Complete',
          message: 'Scripts updated'
        }
      },
      build: {
        options: {
          message: 'Grunt build complete'
        }
      },
      release: {
        options: {
          message: 'Grunt release complete'
        }
      }
    },
    replace: {
      csssourcemaps: {
        src: ['<%= pkg.build_path %>css/compiled/*.map'],
        dest: '<%= pkg.theme_path %>css/',
        replacements: [{
          from: '../',
          to: '/<%= pkg.source_path %>_sass/'
        }]
      },
      cssaddsourcemaps: {
        src: ['<%= pkg.theme_path %>css/*.css'],
        overwrite: true,
        replacements: [{
          from: '/*!',
          to: '/*#'
        }]
      }
    },
    responsive_images: {
      retina: {
        options: {
          engine: 'im',
          sizes: [
            {
              rename: false,
              width: '100%',
              quality: 40,
              suffix: '@2x'
            },
            {
              rename: false,
              width: '50%',
              suffix: ''
            }
          ]
        },
        files: [{
          expand: true,
          cwd: '<%= pkg.build_path %>img/2x/',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= pkg.build_path %>img/'
        }]
      }
    },
    sass: {
      dist: {
        options: {
          cacheLocation: '<%= pkg.build_path %>.sass-cache',
          precision: 10,
          style: 'nested'
        },
        files: {
          '<%= pkg.build_path %>css/compiled/all.css': '_build/css/all.scss',
          '<%= pkg.build_path %>css/compiled/ie9.css': '_build/css/ie9.scss'
        },
      },
    },
    uglify: {
      scripts: {
        files: [
          {
            expand: true,
            cwd: '<%= pkg.build_path %>js/release/',
            src: '**/*.js',
            dest: 'js/',
            rename: function(dest, src) {
              return dest + src.replace('.js','.min.js');
            }
          }
        ],
      }
    },
    watch: {
      css: {
        files: ['<%= pkg.source_path %>_sass/**/*.scss'],
        tasks: ['clean:css', 'copy:cssbuild', 'sass', 'autoprefixer', 'csslint', 'cssmin:styles', 'replace:csssourcemaps', 'notify:watchcss'],
        options: {
          spawn: false,
        },
      },
      images: {
        files: ['<%= pkg.source_path %>_img/**/*'],
        tasks: ['newer:copy:imagesbuild', 'newer:responsive_images', 'newer:grunticon', 'newer:copy:grunticon', 'newer:imagemin', 'notify:watchimg'],
        options: {
          spawn: false,
        },
      },
      scripts: {
        files: ['<%= pkg.source_path %>_js/**/*.js'],
        tasks: ['clean:scripts', 'jshint', 'modernizr', 'concat:scriptshead', 'concat:scriptsmain', 'uglify', 'notify:watchjs'],
        options: {
          spawn: false,
        },
      },
    }

  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat-sourcemaps');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-criticalcss');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-favicons');
  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-modernizr");
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  
  // Grouped tasks to be used below
  grunt.registerTask('meta', ['copy:htmlbuild', 'favicons', 'newer:imagemin']);
  grunt.registerTask('critcss', ['criticalcss', 'cssmin:critcss']);
  grunt.registerTask('htmlprocess', ['copy:htmlbuild', 'htmlbuild']);
  
  // Main Grunt tasks
  grunt.registerTask('release', ['default', 'meta', 'critcss', 'htmlprocess', 'notify:release']);
  grunt.registerTask('default', ['clean', 'copy:imagesbuild', 'responsive_images', 'grunticon', 'copy:grunticon', 'imagemin', 'modernizr', 'concat:scriptshead', 'concat:scriptsmain', 'uglify', 'copy:cssbuild', 'sass', 'autoprefixer', 'cssmin:styles', 'replace:csssourcemaps', 'replace:cssaddsourcemaps', 'notify:build']);

};