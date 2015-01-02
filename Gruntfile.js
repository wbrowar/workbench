module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    autoprefixer: {
      all: {
        options: {
          browsers: ['last 2 versions']
        },
        src: '<%= pkg.build_path %>css/all_compiled.css',
        dest: '<%= pkg.build_path %>css/all_prefixed.css'
      },
      ie9: {
        options: {
          browsers: ['ie 9']
        },
        src: '<%= pkg.build_path %>css/ie9_compiled.css',
        dest: '<%= pkg.build_path %>css/ie9_prefixed.css'
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
        '<%= pkg.html_build_path %>'
        ],
      images: [
        '<%= pkg.build_path %>img',
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
          '<%= pkg.source_path %>_js/head.js',
          ],
        dest: '<%= pkg.build_path %>js/head.js',
      },
      scriptsmain: {
        options: {
          //sourceMap: true
        },
        src: [
          '<%= pkg.source_path %>bower_components/jquery/dist/jquery.js',
          '<%= pkg.source_path %>_js/main.js',
          '<%= pkg.source_path %>bower_components/picturefill/dist/picturefill.js',
        ],
        dest: '<%= pkg.build_path %>js/main.js',
      },
      sprites: {
        files: {
          '<%= pkg.build_path %>css/all_sprites.css': ['_build/css/sprites/sprites.main.svg.css', '_build/css/sprites/sprites_main.png.css', '_build/css/all_prefixed.css'],
          '<%= pkg.build_path %>css/ie9_sprites.css': ['_build/css/sprites/sprites.main.svg.css', '_build/css/sprites/sprites_main.png.css', '_build/css/ie9_prefixed.css'],
        },
        dest: '<%= pkg.build_path %>js/main.js',
      },
    },
    copy: {
      main: {
        files: [
          // move css
          {
            expand: true,
            flatten: true,
            src: ['<%= pkg.build_path %>css/*.css.map'],
            dest: '<%= pkg.theme_path %>css/',
            filter: 'isFile',
            rename: function(dest, src) {
              return dest + src.replace('_compiled','');
            }
          },
        ],
      },
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
      htmlbuild: {
        files: [
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
    },
    criticalcss: {
      home: {
        options: {
          url: "http://wbrowar.com", // Change to live or dev URL
          width: 1200,
          height: 900,
          outputfile: "<%= pkg.build_path %>critcss/home.css",
          filename: "<%= pkg.theme_path %>css/all.css"
        }
      }
    },
    csslint: {
      dist: {
        src: '<%= pkg.build_path %>css/*.css'
      },
    },
    cssmin: {
      styles: {
        files: [
          //{ src: ['<%= pkg.build_path %>css/all_sprites.css'], dest: 'css/all.css'},
          //{ src: ['<%= pkg.build_path %>css/ie9_sprites.css'], dest: 'css/ie9.css'}
          { src: ['<%= pkg.build_path %>css/all_prefixed.css'], dest: 'css/all.css'},
          { src: ['<%= pkg.build_path %>css/ie9_prefixed.css'], dest: 'css/ie9.css'}
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
        dest: '<%= pkg.theme_path %>img/meta/'
      }
    },
    grunticon: {
      main: {
        options: {
          datasvgcss: '<%= pkg.build_path %>css/sprites/sprites.main.svg.css',
          datapngcss: '<%= pkg.build_path %>css/sprites/sprites.main.png.css',
          pngfolder: '<%= pkg.build_path %>img/',
          pngpath: '<%= pkg.theme_path %>img/'
        },
        files: [{
          expand: true,
          cwd: '<%= pkg.build_path %>img/sprites_main',
          src: ['*.svg', '*.png'],
          dest: "<%= pkg.build_path %>img/huh/"
        }]
      }
    },
    htmlbuild: {
      layout: {
        src: '<%= pkg.source_path %>_html/*.html',
        dest: '<%= pkg.html_build_path %>',
        options: {
          styles: {
            critcss: '<%= pkg.build_path %>critcss/home.min.css'
          },
          sections: {
            meta: '<%= pkg.build_path %>html/meta.html'
          },
          data: {
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
          src: ['**/*.{png,jpg,gif}', '!2x/*', '!sprites_main/*'],
          dest: '<%= pkg.theme_path %>img/'
        }]
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
      watch: {
        options: {
          title: 'Task Complete',
          message: 'Grunt watch complete',
        }
      },
      dist: {
        options: {
          message: 'Grunt task complete'
        }
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
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      dist: {
        src: '<%= pkg.source_path %>_js/*.js'
      }
    },
    sass: {
      dist: {
        options: {
          cacheLocation: '<%= pkg.build_path %>.sass-cache',
          precision: 10,
          style: 'nested',
        },
        files: {
          '<%= pkg.build_path %>css/all_compiled.css': '_build/css/all.scss',
          '<%= pkg.build_path %>css/ie9_compiled.css': '_build/css/ie9.scss'
        },
      },
    },
    uglify: {
      head: {
        src: '<%= pkg.build_path %>js/head.js',
        dest: '<%= pkg.theme_path %>js/head.min.js'
      },
      main: {
        src: '<%= pkg.build_path %>js/main.js',
        dest: '<%= pkg.theme_path %>js/main.min.js'
      }
    },
    watch: {
      css: {
        files: ['<%= pkg.source_path %>_sass/**/*.scss'],
        tasks: ['clean:css', 'copy:imagesbuild', 'sass', 'autoprefixer', 'cssmin:styles', 'notify:watch'],
        options: {
          spawn: false,
        },
      },
      images: {
        files: ['<%= pkg.source_path %>_img/**/*'],
        tasks: ['newer:copy:imagesbuild', 'newer:responsive_images', 'newer:imagemin', 'notify:watch'],
        options: {
          spawn: false,
        },
      },
      scripts: {
        files: ['<%= pkg.source_path %>_js/**/*.js'],
        tasks: ['clean:scripts', 'jshint', 'modernizr', 'concat:scriptshead', 'concat:scriptsmain', 'uglify', 'notify:watch'],
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  
  
  grunt.registerTask('cleanall', ['clean']);
  grunt.registerTask('check', ['jshint', 'csslint']);
  grunt.registerTask('meta', ['copy:htmlbuild', 'favicons', 'imagemin']);
  grunt.registerTask('critcss', ['criticalcss', 'cssmin:critcss']);
  grunt.registerTask('htmlprocess', ['copy:htmlbuild', 'meta', 'critcss', 'htmlbuild']);
  grunt.registerTask('default', ['clean', 'copy:imagesbuild', 'responsive_images', 'imagemin', 'jshint', 'modernizr', 'concat:scriptshead', 'concat:scriptsmain', 'uglify', 'copy:cssbuild', 'sass', 'autoprefixer', 'cssmin:styles', 'copy:main', 'notify:dist']);

};