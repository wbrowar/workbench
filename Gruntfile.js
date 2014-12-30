module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    autoprefixer: {
      all: {
        options: {
          browsers: ['last 2 versions']
        },
        src: '_build/css/all_compiled.css',
        dest: '_build/css/all_prefixed.css'
      },
      ie9: {
        options: {
          browsers: ['ie 9']
        },
        src: '_build/css/ie9_compiled.css',
        dest: '_build/css/ie9_prefixed.css'
      }
    },
    clean: {
      css: [
        '_build/css',
        'css/*',
        ],
      scripts: [
        '_build/js',
        'js/*',
        ],
    },
    concat: {
      head: {
        src: [
          '_source/_js/_lib/modernizr.custom.js',
          '_source/_js/head.js',
          ],
        dest: '_build/js/head.js',
      },
      main: {
        src: [
          '_source/bower_components/jquery/dist/jquery.js',
          '_source/_js/main.js',
          '_source/bower_components/picturefill/dist/picturefill.js',
        ],
        dest: '_build/js/main.js',
      },
    },
    copy: {
      main: {
        files: [
          // move css
          {
            expand: true,
            flatten: true,
            src: ['_build/css/*.css.map'],
            dest: 'css/',
            filter: 'isFile',
            rename: function(dest, src) {
              return dest + src.replace('_compiled','');
            }
          },
        ],
      },
    },
    csslint: {
      dist: {
        src: '_build/css/*.css'
      },
    },
    cssmin: {
      dist: {
        files: [
          { src: ['_build/css/all_prefixed.css'], dest: 'css/all.css'},
          { src: ['_build/css/ie9_prefixed.css'], dest: 'css/ie9.css'},
        ],
      },
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      dist: {
        src: '_source/_js/*.js'
      }
    },
    sass: {
      dist: {
        options: {
          cacheLocation: '_build/.sass-cache',
          precision: 10,
          style: 'nested',
        },
        files: {
          '_build/css/all_compiled.css': '_source/_sass/all.scss',
          '_build/css/ie9_compiled.css': '_source/_sass/ie9.scss'
        },
      },
    },
    uglify: {
      head: {
        src: '_build/js/head.js',
        dest: 'js/head.min.js'
      },
      main: {
        src: '_build/js/main.js',
        dest: 'js/main.min.js'
      }
    },
    watch: {
      css: {
        files: ['_source/_sass/*.scss'],
        tasks: ['clean:css', 'sass', 'autoprefixer', 'cssmin'],
        options: {
          spawn: false,
        },
      },
      scripts: {
        files: ['_source/_js/*.js'],
        tasks: ['clean:scripts', 'concat', 'uglify'],
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
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('cleanall', ['clean']);
  grunt.registerTask('check', ['jshint', 'csslint']);
  grunt.registerTask('default', ['clean', 'jshint', 'concat', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'copy:main']);

};