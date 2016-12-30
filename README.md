WB-Starter
==========

My personal framework for front-end development includes some SASS, HTML, and JS snippits that I use on a regular basis. This framework is built using NPM and Gulp and it is meant to be pulled apart or modified for the project at hand. By changing settings in the `package.json` file, this can be used for one-page landing pages, as well as used in full-fledged CMS themes.

This is here for my own storage, but please let me know if you have any feedback or suggestions.

## Installation
NOTE: these instructions are for a Mac. Commands for PC or Linux might be slightly different.

### Setting Up for the First Time
1. Clone the repo into your site's root folder. You may move your `_source` and `_build` folders if needed
2. Install [Node](http://nodejs.org/) (requires v6+)
3. Make sure Ruby is installed, then install [SASS](http://sass-lang.com/) by running the command `gem install sass`
4. If you don't have Homebrew, you can install it using this command: `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
5. Install ImageMagick, run this command: `brew install imagemagick`
6. Run `npm install -g gulp-cli`.
7. Go to your site's root folder and run the command: `yarn`. This will do the same thing as `npm install`, but faster. If you don't have yarn installed, globally, run `npm install --global yarn`

### Setting Up Each Project
1. In Terminal, `cd` to your project root
2. Run `yarn`
3. Update the `package.json` file to fit your project's needs. See `package.json` below
4. Run `gulp first` to perform the default task and to do an initial setup

---
## When to Use What
### Beginning a project
- When starting a project, run the helper task, `gulp`, to see what commands are available.
- When editing the `package.json` file, run `gulp vars` for a description of each variable.
- `gulp first` only needs to be run once at the beginning of the project to move the default npm files out of the `node_modules` folder. In order to keep files up-to-date, and to make working with git easier, edit the `package.json` file to include all other libraries and re-run `gulp first` to update front-end libraries.
- To make sure everything is working right, finish setting up your theme files and your `package.json` settings and run the `gulp run` task. This will give you a good idea of any errors you might run into right off the bat. Even better, run `gulp release` for a more thorough check.

### During Development
- Every time you begin to write code, run `gulp watch` first. This will watch the `_source` folder and update theme files as you save them.
- If you're running `gulp watch`, you can update your browser by using the [Live Reload browser extension](http://livereload.com/extensions/).
- At any given time, run `gulp run` to reprocess basic theme assets (JS, CSS, and images). This is not as good as running `gulp release` but it will clean out old JS, CSS, and image files and replace them with up-to-date versions.

### Staging and Testing
- When staging files for review or testing, run `gulp release`—every time—before deploying to a staging server. `gulp release` includes extra tasks, such as Babel compiling and uglification of Javascript files. While these may not be needed for better performance on a staging server, these tasks might slightly change the code enough to cause bugs to appear.

### Going Live and Releasing
- When preparing to go live, run the `gulp release` task. This will increase the version number in the `package.json` file, which will cause cache-busting to occur on static files that are loaded using version number parameters.
- For feature releases (when you're adding new sections and features), run `gulp releasefeature`. This bumps the version number up by one SEMVER minor version.
- Running `gulp release` cleans out all CSS, JS, SVG, and image files and replaces them with fresh builds.
- `gulp release` also creates favicons, adds Critical CSS, processes SVG icons and processes HTML theme files.

---
## Theme Components
### SCSS Framework
- In `_source/sass` there are a few files with underscores in front. These all get compiled into `all.css`, by default.
- Sass will compile all `.scss` files that do note contain an underscore in front of the filename.

---
### Javascript
- All of the JS is configured to be loaded using [SystemJS](https://github.com/systemjs/systemjs), unless disabled in the `package.json` file.
- The `system-config.js` file sets up options for SystemJS. As part of the `ejs` task, it will be added inline to the `<head>` tag and will be run every page.

---
### Image Processing
- **_img** Images will be processed differently depending on where they are located in the `_source/_img` folder:
  - **2x** Putting 2x-resolution images in the `2x` folder will result in both a 2x image and a 1x image being placed into your `img` directory. The 2x image will be suffixed with `@2x`.
  - **icons** All .svg images in the `icons` folder will be base64-encoded and added using `background-image` to a file in the `_source/sass/` folder, called `_icons.scss`. This will be compiled when the `sass` task is run. A file, named `logo.svg` will access using the class, `.icon_logo`.
  - Images located directly in the `_source/_img`, or folders not listed above will only be minimized and moved into your theme's `img` folder.
- **_favicons** Adding a 512x512 .png into the `_source/_favicons` folder, and running `gulp release`, will result in a set of meta images placed in `img/meta`. HTML for these images will be generated in `_build/html/meta.html`. This code will be included as part of the HTML build process.

---
### Grunt HTML Builder
- Uses [ejs](http://ejs.co) to process HTML files when the `gulp release` task is run.
- Using `ejs` allows you to include files, use conditionals, and replace strings—like IDs and classes.
- There are default replacements included in the Gulpfile, and additional replacements can be added to the `ejsVars` setting in `package.json`. If the replacement is for an include, the file must be included based on the root of the `_build` folder.