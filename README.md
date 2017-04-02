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
5. If you want to use a style inventory, follow the steps in [Beginning a project](https://github.com/wbrowar/WB-Starter#beginning-a-project), below.

---
## When to Use What
### Beginning a project
- When starting a project, run the helper task, `gulp`, to see what commands are available.
- When editing the `package.json` file, run `gulp vars` for a description of each variable.
- If you would like to use a style inventory, point the `style_template` setting in `package.json` to a style template folder in `_source/_util/`. In that folder, change the configuration in `config.json` to enable or disable the features you want to use in your style inventory. Once you are all set, running `gulp template` will move all of the files in the style template's `templates` folder to replace those files in the `_source` folder. *NOTE: Every time `gulp template` is run, the files in `_source` will be overwritten by the style template files. Once you begin development, `gulp template` should no longer be run.*
- `gulp first` only needs to be run once at the beginning of the project to move the default npm files out of the `node_modules` folder. In order to keep files up-to-date, and to make working with git easier, edit the `package.json` file to include all other libraries and re-run `gulp first` to update front-end libraries.
- `gulp font` also only needs to be run once, but you can run it anytime you'd like when you need to add fonts to your project. See Using Fonts in CSS, below for configuration options.
- To make sure everything is working right, finish setting up your theme files and your `package.json` settings and run the `gulp run` task. This will give you a good idea of any errors you might run into right off the bat. Even better, run `gulp release` for a more thorough check.

### During Development
- Every time you begin to write code, run `gulp watch` first. This will watch the `_source` folder and update theme files as you save them.
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
- In `_source/sass` there are a several files with underscores in front. These all get compiled into `all.css`, by default.
- Sass will compile all `.scss` files that do note contain an underscore in front of the filename.
- Files are organized into folders:
  - `automated` – For files generated by Gulp. We can assume these will update on their own, so we wouldn’t edit these manually.
  - `base` – Global CSS that is used across all pages of the site. Animations, variables, mixins, and @font-face declarations are all organized here so they’re in one place.
  - `layout` – Global components and re-usable sections get styled here (as opposed to putting styles for these in the `base/_globals.scss`). Other layout elements can be added by just adding another .scss file here. It will automatically get compiled just by being in the folder.
  - `lib` – For code pulled in using `gulp first` (as set in `package.json`). Also, any other CSS that we receive from vendors (like Frontier) can go here.
  - `modules` – base CSS for HTML elements, such as forms, buttons, tables, images, etc… These should be basic and modular so these elements can be dropped anywhere in the site and still look the same.
  - `pages` – Code specific to a particular page. If code is part of a re-usable component (like a “Meet the Team” layout that can be used on several pages), it should go in `layout`, but if it’s only used on one page (like code specific to the “Homepage”), it should go here.’

#### Using Fonts in CSS
- A `font()` mixin is available to optimize the use of custom `@font-face` fonts, and to making changes to fonts and font stacks consistent in your CSS. Here are the advantages of using this mixin:
  - Only fonts that are used within your SCSS are given a `@font-face` declaration.
  - `@font-face` declarations are only made once, on the first time that `font()` appears in SCSS. This reduces the amount of CSS code.
  - If you are loading fonts from the server, Font Events can be used to remove FOIT. This requires you to enable `enable_font_events` in `package.json`.

In your `package.json`, here are the options you can use. Options marked with ° are required:
  - °`name` – Used to identify the font when using the `font()` mixin. For example, in your SCSS you could write `@include font('avinir');`.
  - °`source` – Determines whether or not a font needs a `@font-face` declaration. Options are `system` or `fontface`.
  - °`fontFamily` – The font family used in CSS to refer to the font. If quotes are needed, use single quotes. For example: `"fontFamily": "'Avinir Next'",`
  - °`fallbackStack` – Fallbacks used in order in case the font is not loaded. This is especially important when using `enable_font_events`.
  - °`fontStyle` – CSS value for the `font-style` property. The output in CSS will be `font-style: normal;`, by default.
  - °`fontWeight` – CSS value for the `font-weight` property. The output in CSS will be `font-weight: normal;`, by default. You can use any CSS-valid value, such as `100` or `bold`.
  - `files` – Pairs up font file types and their locations. This is only applicable for fonts that need a `@font-face` declaration. In most situations, you'll want an `.eot` and a `.woff` file for cross-browser compatibility. A `.woff2` file can be included for better performance.
  - °`fontEventCheck` – If you are using `enable_font_events`, set this option to `true` if you know that this font will appear on every page on your site. This modifies the code in `index_gulp.html` and it requires that one font has this set to `true` when `enable_font_events` is set to true, otherwise you'll get a Javascript error.



---
### Javascript
- All of the JS is configured to be loaded using [SystemJS](https://github.com/systemjs/systemjs), unless disabled in the `package.json` file.
- The `system-config.js` file sets up options for SystemJS. As part of the `ejs` task, it will be added inline to the `<head>` tag and will be run every page.

#### Using SystemJS
SystemJS is a module loader, just like RequireJS. Where require uses AMD modules, SystemJS supports AMD, but also supports the ES6 module loading spec. Since ES6 is not yet supported, SystemJS—along with code that's transpiled through Babel in this Gulp process—allows you to follow the spec for loading modules and to set your javascript code up for how you would want to load it in the future. The idea is that when the ES6 spec is more supported, we could remove SystemJS and there would be very little work required to load our javascript the native way.

To load a Javascript file, first start by adding the key and the path of the file into `_source/_js/system-config.js`. The key must be unique and it should point to path, relative to the `public/js` directory.

If a script is an external library, you may need to add dependencies into the `meta` object. For example, the FitVids jQuery plugin depends on jQuery, so in order to make sure the dependency is loaded first, add it to the `meta` object:

```
meta: {
  'fitvids': {
    deps: ['jquery'],
  },
},
```

You can now use `SystemJS.import('fitvids');` to load both FitVids and jQuery.

Take a look at [this overview in the SystemJS docs](https://github.com/systemjs/systemjs/blob/master/docs/es6-modules-overview.md) to learn more about module loading.

---
### Image Processing
- **_img** Images will be processed differently depending on where they are located in the `_source/_img` folder:
  - **2x** Putting 2x-resolution images in the `2x` folder will result in both a 2x image and a 1x image being placed into your `img` directory. The 2x image will be suffixed with `@2x`.
  - **icons** All .svg images in the `icons` folder will be base64-encoded and added using `background-image` to a file in the `_source/sass/` folder, called `_icons.scss`. This will be compiled when the `sass` task is run. A file, named `logo.svg` will access using the class, `.icon_logo`.
  - Images located directly in the `_source/_img`, or folders not listed above will only be minimized and moved into your theme's `img` folder.
- **_favicons** Adding a 512x512 .png into the `_source/_favicons` folder, and running `gulp release`, will result in a set of meta images placed in `img/meta`. HTML for these images will be generated in `_build/html/meta.html`. This code will be included as part of the HTML build process.

---
### Gulp HTML Builder
- Uses [ejs](http://ejs.co) to process HTML files when the `gulp release` task is run.
- Using `ejs` allows you to include files, use conditionals, and replace strings—like IDs and classes.
- There are default replacements included in the Gulpfile, and additional replacements can be added to the `ejsVars` setting in `package.json`. If the replacement is for an include, the file must be included based on the root of the `_build` folder.

---
## Release Notes
#### 4.5.0
- :wrench: Replaced `emergence` with `scrollMonitor` for lazy loading
- :rocket: Added `_source/_js/lazy.js` to handle lazy loading
  - `lazy.js` relies on `data` attributes. See comments in the code for required attributes and data types
  - Check `lazy.js` comments for more information
- :fire: Removed webshot from `Gulpfile.js`
  
#### 4.4.0
- :rocket: Added font configuration settings to `package.json`
- :rocket: Added `gulp font` task to automate `@font-face` declarations and performance enhancements in `_source/automated/_fonts.scss`
  - Configure font settings in `package.json` and run `gulp font` anytime you update fonts you want available in the `font()` mixin
- :rocket: Added style template settings to `package.json`
- :rocket: Added files to create default style inventory sections
  - To add a style inventory section to a page, use `<%- include(styletemplate____) %>` and replace blank with name of the section. For example, to embed the icons section, use `<%- include(styletemplateicons) %>`

#### 4.3.0
- :rocket: Added `browserSync` settings to `package.json`
- :rocket: Added Browsersync support
  - Run `gulp watch` and Browsersync will open a new tab at the URL you set
  - When you save any HTML or Javascript file that is watched, Browsersync will reload the page
  - Saving a SCSS file will automatically update the CSS on the page without reloading

#### 4.2.0
- :wrench: Replaced `RequireJS` with `SystemJS` for Javascript module loading

#### 4.1.0
- :wrench: Removed bower to use npm for front-end libraries