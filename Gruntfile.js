module.exports = function(grunt) {
	require('time-grunt')(grunt);
	require('jit-grunt')(grunt, {
		bower: 'grunt-bower-task',
		replace: 'grunt-text-replace',
		htmlbuild: 'grunt-html-build'
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		autoprefixer: {
			all: {
				options: {
					browsers: ['last 2 versions']
				},
				src: '<%= pkg.build_path %>css/compiled/all.css',
				dest: '<%= pkg.build_path %>css/release/all.css'
			}
		},
		bower: {
			install: {
				options: {
					targetDir: '<%= pkg.source_path %>_js/lib/',
					bowerOptions: {
						"analytics": false
					},
				},
			},
		},
		clean: {
			css: [
				'<%= pkg.build_path %>css',
				'<%= pkg.theme_path %>css/*'
				],
			clean_critcss: [
				'<%= pkg.build_path %>critcss'
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
				'<%= pkg.build_path %>uglified',
				'<%= pkg.theme_path %>js/*'
				],
		},
		copy: {
			copy_bower: {
				files: [
					{
						src: 'fontfaceobserver.js',
						dest: '<%= pkg.source_path %>_js/_lib/'
					},
				],
			},
			copy_grunticon: {
				files: [
					{
						expand: true,
						cwd: '<%= pkg.build_path %>grunticon/',
						src: ['sprites.main.svg.css', 'sprites.main.png.css', 'icons.fallback.css'],
						dest: '<%= pkg.build_path %>css/release/'
					},
				],
			},
			copy_htmlbuild: {
				files: [
					// backup all HTML files (just in case)
					{
						expand: true,
						cwd: '<%= pkg.html_build_path %>',
						src: ['**/*.html', '!**/_source/**', '!**/_build/**', '!**/node_modules/**'],
						dest: '<%= pkg.build_path %>html_backup/'
					},
					{
						expand: true,
						cwd: '<%= pkg.source_path %>_html/',
						src: '**/*',
						dest: '<%= pkg.build_path %>html/'
					},
				],
			},
			copy_imagesbuild: {
				files: [
					{
						expand: true,
						cwd: '<%= pkg.source_path %>_img/',
						src: '**/*',
						dest: '<%= pkg.build_path %>img/'
					},
				],
			},
			copy_npm: {
				files: [
					{
						expand: true,
						cwd: 'node_modules/fontfaceobserver/',
						src: 'fontfaceobserver.js',
						dest: '<%= pkg.source_path %>_js/_lib/'
					},
				],
			},
			copy_scriptsbuild: {
				files: [
					{
						expand: true,
						cwd: '<%= pkg.source_path %>_js/',
						src: ['**/*.js', '!_lib/*'],
						dest: '<%= pkg.build_path %>js/'
					},
					{
						expand: true,
						flatten: true,
						cwd: '<%= pkg.source_path %>_js/',
						src: ['_lib/fontfaceobserver.js'],
						dest: '<%= pkg.build_path %>js/lib/'
					},
				],
			},
			copy_scriptsdist: {
				files: [
					{
						expand: true,
						cwd: '<%= pkg.build_path %>uglified/',
						src: '**/*.js',
						dest: '<%= pkg.theme_path %>js/'
					},
				],
			},
		},
		criticalcss: {
			index: {
				options: {
					url: "<%= pkg.local_url %>", // Change to live or dev URL
					width: 1200,
					height: 900,
					outputfile: "<%= pkg.build_path %>critcss/compiled/index.css",
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
			cssmin_styles: {
				files: [
					{
						expand: true,
						cwd: '<%= pkg.build_path %>css/release/',
						src: '**/*.css',
						dest: '<%= pkg.theme_path %>css/'
					}
				],
			},
			cssmin_critcss: {
				files: [
					{
						expand: true,
						cwd: '<%= pkg.build_path %>critcss/compiled/',
						src: '**/*.css',
						dest: '<%= pkg.build_path %>critcss/release/',
						rename: function(dest, src) {
							return dest + src.replace('.css','.min.css');
						}
					}
				],
			},
		},
		favicons: {
			options: {
				trueColor: true,
				precomposed: true,
				appleTouchBackgroundColor: "#ffffff",
				coast: true,
				windowsTile: true,
				tileBlackWhite: true,
				tileColor: "none",
				html: '<%= pkg.build_path %>html/meta.html',
				HTMLPrefix: "<%= pkg.html_theme_path %>img/meta/"
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
					cssprefix: '.icon_',
					enhanceSVG: true
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
				expand: true,
				cwd: '<%= pkg.source_path %>_html',
				src: '**/*.html',
				dest: '<%= pkg.html_build_path %>',
				options: {
					sections: {
						critcss: '<%= pkg.build_path %>critcss/replaced/index.min.css',
						grunticon: '<%= pkg.build_path %>grunticon/grunticon.loader.js',
						loadcss: '<%= pkg.build_path %>uglified/lib/loadcss/loadCSS.min.js',
						meta: '<%= pkg.build_path %>html/meta.html',
						requirejs: '<%= pkg.theme_path %>js/lib/requirejs/require.min.js',
						requireconfig: '<%= pkg.theme_path %>js/require-config.min.js'
					},
					data: {
						enable_font_events: '<%= pkg.enable_font_events %>',
						html_theme_path: '<%= pkg.html_theme_path %>',
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
				"dest" : "<%= pkg.build_path %>uglified/lib/modernizr-custom.min.js",
				"options" : [
					"html5shiv",
					"testAllProps",
					"testStyles",
				],
				"enableClasses" : true,
				"uglify" : true,
				"tests" : ['flexbox', 'flexboxlegacy', 'flexboxtweener'],
				"customTests" : [],
				"crawl" : true,
				"files" : {
					"src": ['<%= pkg.source_path %>_js/**/*.js', '!<%= pkg.source_path %>_js/lib', '<%= pkg.source_path %>_sass/**/*.scss']
				},
			}
		},
		notify: {
			watchcss: {
				options: {
					title: 'Grunt Watch Complete',
					message: 'CSS updated'
				}
			},
			watchhtml: {
				options: {
					title: 'Grunt Watch Complete',
					message: 'HTML processed'
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
			replace_critcss: {
				src: ['<%= pkg.build_path %>critcss/release/index.min.css'],
				dest: '<%= pkg.build_path %>critcss/replaced/index.min.css',
				replacements: [{
					from: '{#',
					to: '{ #'
				}]
			},
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
			styles: {
				options: {
					cacheLocation: '<%= pkg.build_path %>.sass-cache',
					precision: 10,
					style: 'compressed'
				},
				files: {
					'<%= pkg.build_path %>css/compiled/all.css': '<%= pkg.source_path %>_sass/all.scss'
				},
			},
		},
		uglify: {
			scripts: {
				files: [
					{
						expand: true,
						cwd: '<%= pkg.build_path %>js/',
						src: ['**/*.js', '!**/*.min.js'],
						dest: '<%= pkg.build_path %>uglified/',
						rename: function(dest, src) {
							return dest + src.replace('.js','.min.js');
						}
					}
				]
			}
		},
		watch: {
			watch_css: {
				files: ['<%= pkg.source_path %>_sass/**/*.scss'],
				tasks: ['watch_css'],
				options: {
					spawn: false,
					livereload: true
				},
			},
			watch_htmlbuild: {
				files: ['<%= pkg.source_path %>_html/**/*'],
				tasks: ['watch_html'],
				options: {
					spawn: false,
					livereload: true
				},
			},
			watch_images: {
				files: ['<%= pkg.source_path %>_img/**/*'],
				tasks: ['watch_images'],
				options: {
					spawn: false
				},
			},
			watch_scripts: {
				files: ['<%= pkg.source_path %>_js/**/*.js'],
				tasks: ['watch_scripts', 'watch_html'],
				options: {
					spawn: false,
					livereload: true
				},
			},
		}

	});
	
	// Grouped tasks to be used below
	grunt.registerTask('meta', ['favicons', 'newer:imagemin']);
	grunt.registerTask('critcss', ['criticalcss', 'cssmin:cssmin_critcss']);
	grunt.registerTask('htmlprocess', ['replace:replace_critcss', 'copy:copy_htmlbuild', 'htmlbuild']);
	
	// Main Grunt tasks
	grunt.registerTask('first', ['copy:copy_npm', 'copy:copy_bower', 'default']);
	grunt.registerTask('release', ['default', 'meta', 'critcss', 'htmlprocess', 'notify:release']);
	grunt.registerTask('default', ['clean', 'copy:copy_imagesbuild', 'responsive_images', 'grunticon', 'copy:copy_grunticon', 'imagemin', 'copy:copy_scriptsbuild', 'modernizr', 'uglify', 'copy:copy_scriptsdist', 'sass', 'autoprefixer', 'cssmin:cssmin_styles', 'notify:build']);
	
	// Watch tasks
	grunt.registerTask('watch_css', ['sass', 'newer:autoprefixer', 'newer:cssmin:cssmin_styles', 'notify:watchcss']);
	grunt.registerTask('watch_html', ['clean:clean_critcss', 'newer:copy:copy_htmlbuild', 'newer:htmlbuild', 'notify:watchhtml']);
	grunt.registerTask('watch_images', ['copy:copy_imagesbuild', 'newer:responsive_images', 'grunticon', 'copy:copy_grunticon', 'newer:imagemin', 'notify:watchimg']);
	grunt.registerTask('watch_scripts', ['jshint', 'newer:copy:copy_scriptsbuild', 'newer:uglify', 'newer:copy:copy_scriptsdist', 'notify:watchjs']);

};