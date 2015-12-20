WB-Starter
==========

My personal framework for very simple sites includes a configuration from [Initilizr](http://www.initializr.com) and some SASS, HTML, and JS snippits that I use on a regular basis. This framework is built using Bower, NPM, and Grunt and it is meant to be pulled apart or modified for the project at hand.

This is here for my own storage, but please let me know if you have any feedback or suggestions.

## Installation
NOTE: these instructions are for a Mac. Commands for PC or Linux are slightly different.

### Setting Up for the First Time
1. Clone the repo into your site's root folder. You may move your `_source` and `_build` folders if needed
2. Install [Node](http://nodejs.org/)
3. Make sure Ruby is installed, then install [SASS](http://sass-lang.com/) by running the command `gem install sass`
4. Install ImageMagick, run this command: `brew install imagemagick`. If you don't have homebrew, you can install it using this command: `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
5. In terminal, go to your site's root folder and run the command: `npm install`
6. Run `npm install -g bower`
7. Run `npm install -g grunt-cli`.
8. Close the terminal window and open it up again. If you run `grunt first` and you get an error, "Unable to find local grunt", check to see if you have a `.bash_profile` file in your home folder. If you don't have a `.bash_profile` file setup, create it, then add the following line to it: `export PATH=/usr/local/lib/node_modules/grunt-cli:$PATH`

### Setting Up Each Project
1. In Terminal, `cd` to your project root
2. Run `npm install` (you may need to run `sudo npm install`)
3. Run `bower install`
4. Update the `package.json` file to fit your project's needs. See `package.json` below
5. Edit `Gruntfile.js` to work however you want
6. Run `grunt first` to perform the default task and to do an initial setup

## Commands
### `grunt`
- Grunt default task. Runs tasks to process images, javascript, and CSS files. The `grunt-html-build` task is left off of the `grunt` task since it may not be needed as often.

### `grunt first`
- Updates bower (based on your `bower.json` settings), then runs `grunt`.

### `grunt watch`
- Run this to automate tasks as files in the `_source` folder are modified. Use `control+C` or close the Terminal window to stop `grunt watch`.

### `grunt release`
- Running `grunt release` will run all of the tasks in the default `grunt` task, then it will run tasks to build your meta icons, generate Critical CSS, then process the files in your `_source/_html` folder. It's intended that `grunt release` be run before deploying your files to staging or prod servers.

## Settings
### package.json
- **name** Project name
- **version** Project version. Changing this number and running `grunt release` will perform cache busting in the generated HTML
- **theme_path** Path to your theme folder from the project root. This is where your final `css`, `js`, and `img` folders will be built
- **source_path** Path to your source folder from the project root. The name of the folder can be different but the contents should stay the same
- **build_path** Location of your build folder. This can be moved and renamed if needed
- **html_build_path** If you run `grunt release`, files in your `_source/_html` folder will be processed and built at this path, using [grunt-html-build](https://www.npmjs.com/package/grunt-html-build). This path will become a root for your processed files and directory trees will be built out
- **html_theme_path** A string that is appended when linking the `css`, `js`, and `img` files. Examples: `../`, `/`, `/sites/all/theme/`
- **devDependencies** Finding [Grunt packages](http://gruntjs.com/plugins) and installing them through Terminal—using `--save-dev`—will update this section. Update version numbers if needed

*NOTE: for path variables above, a trailing slash should be used in most cases*

### bower.json
- **name** Can be renamed to your project name. Not used otherwise
- **dependencies** Add or remove components needed for your project. You can search [available packages here](http://bower.io/search/)

---
## Theme Components
### SCSS Framework
- In `_source/sass` there are a few files with underscores in front. These all get compiled into `all.css`. A lot of this is pulled right out of HTML5 Boilerplate. Custom styles should go in `_style.scss`.

---
### Javascript
- All of the JS is configured to be loaded using RequireJS
- The `require-config.js` file sets up options for RequireJS. As part of the HTML Builder, it will be added inline to the `<head>` tag and will be run every page
- The `home.js` file is set up to be a default place to store scripts

---
### Image Processing
- **_img** Images will be processed differently depending on where they are located in the `_source/_img` folder:
  - **2x** Putting 2x-resolution images in the `2x` folder will result in both a 2x image and a 1x image being placed into your `img` directory. Directory trees will be built out
  - **icons** All .svg and .png images into the `icons` folder will be processed through [grunt-grunticon](https://www.npmjs.com/package/grunt-grunticon)
  - Images located directly in the `_source/_img`, or folders not listed above will not be processed
- **_favicons** Adding a 512x512 .png into the `_source/_favicons` folder, and running `grunt release`, will result in a set of meta images placed in `img/meta`. HTML for these images will be generated in `_build/html/meta.html`. This code will be included as part of the HTML build process
- All images are run through [grunt-contrib-imagemin](https://www.npmjs.com/package/grunt-contrib-imagemin)

---
### Grunt HTML Builder
- Uses [grunt-html-build](https://www.npmjs.com/package/grunt-html-build) to process HTML files when the `grunt release` task is run
- If you want, change the **html_build_path** to overwrite .html files in your project (this can be helpful for processing theme files). You can, instead, change the **html_build_path** folder to your build folder—or elsewhere—and you can copy and past the generated code as needed
- By default it looks for .html files in `_source/_html`, but any file type can be built by updating the task in `Gruntfile.js`
- NOTE: The [grunt-contrib-clean](https://www.npmjs.com/package/grunt-contrib-clean) task will clear out all files backed up in `_build/html_backup`, but it will not remove any files from the **html_build_path**

**Why is Grunt HTML Builder so slow?**

It's not the grunt module that's slow. Before overwriting files in your **html_build_path**, a backup of all .html files is made—just in case. If you haven't updated the **html_build_path** in your `package.json` file, the [grunt-contrib-copy](https://www.npmjs.com/package/grunt-contrib-copy) task that does the backup will be globbing through big directories, such as `note_modules` and `bower_components`. You can stop this by moving the **html_build_path** directory. If you can't move it, and you don't want the backup, you can also turn it off by removing the `copy:htmlbuild` task in `grunt.registerTask('htmlprocess', ['copy:htmlbuild', 'htmlbuild']);`

Backed up files will be copied to `_build/html_backup`. Each time a `clean` task is run, the backups will be emptied.

---
## Resources
- [Grunt for People Who Think Things Like Grunt are Weird and Hard](http://24ways.org/2013/grunt-is-not-weird-and-hard/) - Setup tutorial by Chris Coyier
- [Automating Your Web Workflow with Grunt.js](http://techneblog.com/article/automating-your-web-workflow-gruntjs)
- [Responsible Responsive Design](http://www.abookapart.com/products/responsible-responsive-design) - A lot of good organization and optimization tips
