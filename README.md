WB-Starter
==========

My personal framework for front-end development includes some SASS, HTML, and JS snippets that I use on a regular basis. This framework is built using Node and Webpack and it is meant to be pulled apart or modified for the project at hand. By changing settings in the `package.json` file, this can be used for one-page landing pages, as well as used in full-fledged CMS themes.

This is here for my own storage, but please [let me know if you have any feedback or suggestions](https://github.com/wbrowar/WB-Starter/issues).

## Requirements
- [Node.js](https://nodejs.org/en/) (requires v11+)
- [Composer](https://getcomposer.org) (for Craft-based projects)

## Installation
NOTE: these instructions are for macOS. Commands for Linux might be slightly different. I don‘t *think* Windows is supported.

1. Install [new-wb](https://www.npmjs.com/package/new-wb) by running `npm install -g new-wb`.
1. Run `new-wb` in the directory of your choice.
1. Enter in the required information requested by various sets of prompts.

**OR**

1. Create a new project folder and `cd` into it.
1. Clone this repo or download the [master.zip](https://github.com/wbrowar/WB-Starter/archive/master.zip) and unzip it.
1. Run `npm install`, `pnpm install`, or `yarn` to download Node modules.
1. Run `node ./_starter/install.js --handle='CHANGE_ME'` and change `CHANGE_ME` to the name of your directory.
1. Enter in the required information requested by various sets of prompts.

## NPM Scripts
NPM Scripts may be added depending on what type of project you are creating. Check the `package.json` file to see what scripts are available after installation is complete.

| Script | Description |
| --- | --- |
| `cnvm` | Changes the version of node using [nvm](https://github.com/nvm-sh/nvm) |
| `ci:build` | The build script used in CI environment like Buddy, GitLab, or GitHub Actions. |
| `component` | Add or move a component into your project‘s `_source/_components` directory. |
| `cssd` | Use Craft Scripts to pull down uploaded assets and the specified database. |
| `cssdb` | Pulls down only the database using Craft Scripts. |
| `deploy` | Prepares code for commit to a repo that triggers CI deployment. |
| `dev` | Development build that processes templates and theme files. |
| `prod` | Completes the build script in `production` mode. |
| `pub` | Completes the build script in `production` mode, then makes a copy in the `release` directory. |
| `start` | Does a `git pull`, updates NPM and Composer dependencies, then runs the `watch` script. |
| `update` | Updates Node and Composer dependencies. |
| `watch` | Completes the development build, then watches files in the `_source` folder for changes. |

If you use an `.alias` file for command line aliases, here are shortcuts for these scripts.

```bash
alias comp="npm run component"
alias cssd="npm run cssd"
alias cssdb="npm run cssdb"
alias dep="npm run deploy"
alias dev="npm run dev"
alias prod="npm run prod"
alias pub="npm run pub"
alias start="npm run start"
alias update="npm run update"
alias watch="npm run watch"
```

## Local Config
If you have some default values that you prefer to use for every project, you may create a local config file that will provide defaults to the questions asked during installation.

This file will be created during the first time `new-wb` is ran and it will be saved in your machine’s home folder as: `~/.wb-starter.config.json`.

Once it has been created, you may edit it with the following options:

| Option | Description |
| --- | --- |
| `cpTrigger` | For Craft projects, this replaces the path to Craft’s CP. |
| `cmsAdminEmail` | Default email address used for initial CMS admin account. |
| `cmsAdminUsername` | Default username used for initial CMS admin account. |
| `cmsAdminPassword` | Default password used for initial CMS admin account. |
| `dbHost` | Host where databases will be created. |
| `dbUser` | Database user. |
| `dbPort` | Port used to connect to your location database. |
| `gitUser` | Your GitHub username. |
| `gitOrg` | A GitHub organization name, if you plan to create sites for an organization. Leave this blank to create repos in your personal profile. |
| `gitPrivate` | Set this to `true` to create private GitHub repos. |
| `npmInstaller` | The package manager used to install npm modules. Accepts: `npm`, `pnpm`, or `yarn` |
| `releaseDir` | Prefixes the `release` directory when `npm run pub` is used. |

Remove any options you don’t want to create a preset for. You will still be able to overwrite any of these presets when setting up a new project. If you delete this file from your home directory you can re-create it during your next installation.

*NOTE: Passwords are not saved for security reasons.*

---
## When to Use What

### During Development
- At any given time, run `npm run dev` to reprocess JS, SCSS, templates, SVG icons, and image files.
- Every time you begin to write code, run `npm run watch` first. This will run `npm run dev`, then watch the `_source` folder and update theme files as you save them.

### Staging and Testing
- If you would like to see what a production build looks like, run `npm run prod` locally. `npm run prod` includes extra tasks, such as Babel transpiling and uglification of Javascript files. While these may not be needed for better performance on a staging server, these tasks might slightly change the code enough to cause bugs to appear.
- If you are using CI to deploy your project, run `npm run deploy`—every time—before deploying to a staging server. This will do the same thing as running `npm run prod`, but it removes build files that will ultimately be built during deployment.
- Running `npm run prod` or `npm run deploy` cleans out all CSS, JS, SVG, templates, and image files and replaces them with fresh builds.
- `npm run prod` and `npm run deploy` also creates favicons and adds Critical CSS.

### Going Live
- To push files to production, run the `npm run deploy` task on the appropriate branche (usually `master`). This will increase the version number in the `package.json` file, which will cause cache-busting to occur on static files that are loaded using version number parameters.

### Publishing a New Release
- For Craft plugins, use `npm run pub` to do a production build and then move a copy of your project from `development` to `release`. These values must be set in your `package.json` file before running `npm run pub`.

## Style Inventory
- The Style Inventory displays the code and an example of the components available in your project.
- To get to the Style Inventory, go to `/dev/inv/index.html` or `/dev/inv/` in a Craft 3 project.
- In Craft websites, the Style Inventory section is available based on a setting in your `.env` file. This allows you to turn it off in production environments.
- The Style Inventory is generated from settings in the `package.json`, `styleInventory.pages` object, and the `demo.ejs` files in component folders.
- Based on this code snippet:
    ```json
    {
      "globals": {
        "label": "Globals",
        "components": [
          "@colors",
          "header"
        ]
      }
    }
    ```
  - The URL for each page is generated using the key in the `styleInventory.pages` object. In the code above, the URL of this page would be `/dev/inv/globals.html`
  - In `components`, the item `@colors` will pull its code from WB Starter, from `_starter/style_inventory/defaults/colors.ejs`
    - Files in this directory shouldn‘t be edited, but they can serve as examples as to what can be done in `demo.ejs` files.
  - The `header` item will pull from the `_source/_components/header/demo.ejs` file.
    - This file can be changed as needed to fit your project.

---
## Source Structure
### Components
- During installation you will be asked to select which components you would like to use in your project. The components will appear in this directory.
- Components can include the following file:
  - *`.ejs`* - Used to include the component via [EJS](http://ejs.co)
  - *`.scss`* - Styles for the component
  - *`.twig`* - A twig version that can be included via Twig `{{ component.c('COMPONENT_HANDLE', config) }}`
  - *`.vue`* - A [Vue](https://vuejs.org) single file component file
  - *`demo.ejs`* - An EJS file used to demonstrate the component‘s styling and functionality in the project‘s Style Inventory
- All `.scss` and `.vue` files in `_source/_components/` will be processed with EJS during the build process.

#### Adding Components
- To move an existing component run `npm run component -- --mv` and select which component you would like to move from the list.
- To create a new component run `npm run component` and answer the questions when prompted.

#### Styling Components
- Component all have a wrapper element with a class that is prefixed with `c_`.
- When styling a component, use BEM-like modifiers to add styles within the component.
  - For example, `<div class="c_text c_text--red"></div>` could make the color of text red.
- When adding or overriding component styles for a page layout or another component, create a new class and place your styles in the appropriate `.scss` file.
  - For example, styles for `<div class="home__header c_text"></div>` would go in `_css/pages/home.scss`.
  - In this case the CSS selector should be `.home__header` and not `.home .c_text`.
- Styles for Vue components may go in either the `.vue` file or in the component‘s `.scss` file, depending on whether or not the CSS should be processed by SASS with the rest of the project‘s styles.

### SCSS
- In `_source/_css` there are a several files with underscores in front. These all get compiled into `app.css`, by default.
- Sass will compile all `.scss` files in the root of `_source/_css` that do not contain an underscore in front of the filename.
- Files are organized into folders:
  - *`automated`* – For files generated based on `package.json` settings. We can assume these will update on their own, so we wouldn’t edit these manually.
  - *`base`* – Global CSS that is used across all pages of the site. Animations, variables, mixins, and global styles are all organized here so they’re in one place.
  - *`layout`* – Layout areas and re-usable sections get styled here (as opposed to putting styles for these in the `base/_globals.scss`). Other layout elements can be added by just adding another .scss file here. It will automatically get compiled just by being in the folder.
  - *`lib`* – For any CSS that we receive from vendors (like our clients) can go here. These should not be edited by us, so it can be assumed than any file here can be updated at any time.
  - *`pages`* – Code specific to a particular page. If code is part of a re-usable component (like a “Meet the Team” layout that can be used on several pages), it should go in `layout`, but if it’s only used on one page (like code specific to the “Homepage”), it should go here.’
- CSS follows the [BEM naming convention](http://getbem.com/naming/) to reduce accidental mixing of styles.

#### PostCSS
- The following plugins are used in PostCSS:
  - *`purifycss`* – Removes all CSS that isn‘t used in in your template files
  - *`mqpacker`* – Combines media queries while keeping existing source order
  - *`automated`* – Adds browser prefixes when needed
  
To add a file for PostCSS processing, add its filename to the `postcss` array in `package.json`.

#### Using Colors in CSS
- Colors that are defined in `package.json`, in the `colors` object, will be generated as SASS variables.
  - For example, `"blue": "rgb(0, 0, 255)"` can be used in the following ways in SCSS files:
    - `$color_blue` will output `var(--color-blue)`
    - Using the `colora()` SASS function allows you to set an alpha value onto a color while maintaining keeping it's RGB value as a CSS Custom Property. For example, `colora(blue, .6)` will output `rgba(var(--color-blue-rgb), .6)`
    - Setting the color value using CSS Custom Properties can override a color for easier theming. For example:
```scss
  .parent {
    --color-blue: rgb(100, 100, 255);
    
    .child {
      color: $color_blue;
    }
  }
```

Will compute to the following in the browser:

```css
  .parent .child {
    color: rgb(100, 100, 255);
  }
```

#### Using Fonts in CSS
- A `font()` mixin is available to optimize the use of custom `@font-face` fonts, and to making changes to fonts and font stacks consistent in your CSS. Here are the advantages of using this mixin:
  - Only fonts that are used within your SCSS are given a `@font-face` declaration.
  - `@font-face` declarations are only made once, on the first time that `font()` appears in SCSS. This reduces the amount of CSS code.

In your `package.json`, in the `fonts` object, here are the options you can use. Options marked with ° are required:
  - °`fontFamily` – The font family used in CSS to refer to the font. If quotes are needed, use single quotes. For example: `"fontFamily": "'Avinir Next'",`
  - °`fallbackStack` – Fallbacks used in order in case the font is not loaded.
  - °`fontStyle` – CSS value for the `font-style` property. The output in CSS will be `font-style: normal;`, by default.
  - °`fontWeight` – CSS value for the `font-weight` property. The output in CSS will be `font-weight: normal;`, by default. You can use any CSS-valid value, such as `100` or `bold`.
  - `files` – Pairs up font file types and their locations. This is only applicable for fonts that need a `@font-face` declaration. In most situations, you'll want an `.eot` and a `.woff` file for cross-browser compatibility. A `.woff2` file can be included for better performance.

The key for each item is used to identify the font when using the `font()` mixin. For example, if the key is `avinir`, in your SCSS you would write `@include font('avinir');`.

#### Using SVGs in CSS
- All SVG files in the `_source/_icon` directory will be moved to the `icon` directory in your theme folder.
- To use an SVG as a background image in CSS, add the filename of the icon to `package.json`, in the `cssIcons` array.
- These icons can be used in two ways:
  - To add an SVG background image to an element, add `icon_` + the CSV name to the class attribute. For example, to add a `location` SVG to a `div`, use `<div class="icon_location"></div>`
  - To modify an SVG you can add CSS Custom Properties to `fill` and other attributes within the SVG, then use a custom mixin for each SVG.
    - Call `@include icon_location((MAP_KEY: MAP_VALUE))` and replace `MAP_KEY` and `MAP_VALUE` as desired.
    - In your SVG, use `map-get($map, MAP_KEY)` and change `MAP_KEY` to the key passed into the mixin.

---
### Javascript
- All of the JS is configured to be compiled using [Webpack](https://webpack.js.org/).
- JS will be compiled for both modern browsers and legacy browsers. The modern JS will be based around using ES6 Modules, whereas the legacy JS will include polyfills and JS transpiled for older browsers.

#### Using Webpack
For Javascript files, Webpack is used to uglify, transpile, and concatenate our files into bundles. It pulls directly from `_source/_js/` and `node_modules` and creates single Javascript files in `public/js/`.

Currently, there is one file, `app.js`, but if you need to split out code into additional bundles, you can configure Webpack's entries in the `package.json` file. To add another Javascript file, modify the `webpack.entries.js` object.

### lazy.js
Include `lazy.js` into a JS document and create a new instance using `window.lazy = new Lazy(config)`.

```javascript
import Lazy from 'lazy';

const config = {
    animationFunctions: {
        'fadePageBgColor': fadePageBgColor,
    },
    container: '#page',
};

window.lazy = new Lazy(config);
```

#### Lazy Loading
To use Lazy Loading for better loading performance, add the `data-lazy-load` attribute to an element. By itself, this will do nothing, but when combined with the optional attributes, below, different modifications will be made to the element.

| Attribute | Example Value | Description |
| --- | --- | --- |
| `data-src` | `/img/FPO.png` | Changes to the `src` attribute for `<video>`, `<audio>`, and `<img>` tags. |
| `data-srcset` | `/img/FPO.png 1x, /img/FPO@2x.png 2x` | Changes to the `srcset` tag uses in `<img>` tags. |
| `data-width` | `2048` | Setting both `data-width` and `data-height` on an element will add inline styles to the element that allow it to proportionately take up as much room as an image would in that space. This can be used for placeholder images styled in CSS. |
| `data-height` | `2048` |  |

#### Lazy Animations
When used with no value, `data-lazy-animate` simply adds the class `c_animate--animated` to an element. In your CSS, a transition or CSS animation can fire when `c_animate--animated` is added.

You can also configure a function that can be fired when the element is scrolled into the viewport by setting the value of `data-lazy-animate` to a JSON object. The JSON object uses animations defined in `_source/_js/animation.js`—which can be edited as needed. Greensock can be used to animate the object, however, any Javascript code added to `animations.js` can be fired and arbitrary arguments may be passed into your code.

Because Greensock is a decent sized library, `animation.js` is only loaded when it is needed, reducing overhead when it is not required.

See the "Lazy Animations" section in the `animate` component for a full list of accepted JSON arguments.

### scrollto.js
Include `scrollto.js` into a JS document and call the default, `scrollto()` function to init.

```javascript
import scrollto from 'scrollto';

function scrollToElement(el) {
    const elRect = el.getBoundingClientRect();
    const newY = elRect.top + document.body.scrollTop - 130;

    scrollto({ destination: newY });
}

const el = document.getElementById("section_1");
scrollToElement(el);
```

| Attribute | Default | Description |
| --- | --- | --- |
| `destination` | 0 | A `scrollTop` position, based on the top of the document. Leave this at `0` to go back to the top of the document. |
| `duration` | 500 | How long the animation shold take. |
| `easing` | 'easeOutQuad' | Easing function used to determine how the animation will look. Look into the `scroll.js` file to see what options are available. |
| `callback` | *undefined* | Pass in a callback function that should fire after animation is done. |

---
### Image Processing
- Root images
  - Images located in the root of the `_source/_img` directory will be minimized and moved into your theme's `img` folder.
  - A `.webp` variant of each image will be created and placed alongside the original.
- Resized Images
  - In `package.json`, in the `imageResize` object, you can define a set of widths to resize an image to. All images in the folder indicated will be resized to each size.
    - All resizes will be based on the image‘s aspect ratio.
    - A `.webp` variant of each resize will be created.
    - For example, to resize all of the images in `_source/_img/resized` to the widths, 500, 1024, and 2048, use the following configuration:
      ```json
      {
        "imageResize": {
          "resized": {
            "sizes": [
              500,
              1024,
              2048
            ]
          }
        }
       }
      ```

---
### Favicons
- Adding a 512x512 `.png` into the `_source/_favicons` folder, and running `npm run prod`, will result in a set of meta images placed in your theme‘s `favicon` folder. HTML for these images will be generated when `_source/_templates/_ejs/_head_meta.ejs` is compiled.
- Settings in `package.json`, in the `favicon` object, can be changed to set the background color and the theme color used for various favicons files.

---
### Templates
- Templates are processed using [EJS](http://ejs.co).
  - Using EJS allows you to include files, use conditionals, and replace strings—like IDs and classes.
  - The entire `package.json` file is passed into the files processed through EJS.
    - The `ejs` object in `package.json` gives you a convenient place to store EJS variables, however, any variable defined in `package.json` is accessible.
    - To use variables stored in `package.json`, use `pkg` then the variable name. For example, to print out the site URL path, use `<%- pkg.paths.base.siteUrl %>`

---
## Fixing CORS issues
To fix CORS errors that could come up in using Valet for local development, follow these instructions:

1. Create a new file at `/usr/local/etc/nginx/valet/` called `cors.conf` (the name can be set to anything)
1. Past the code below into the file within the main `server` block.
    ```
    add_header Access-Control-Allow-Credentials 'true';
    add_header Access-Control-Allow-Headers 'Content-Type,Authorization';
    ```
1. Restart Valet using `valet restart`

---
## Using Best Practices for Craft Plugin Project
By default, this workflow is capable of compiling assets for a Craft Plugin, however, some of the default naming conventions and compiling options do not follow plugin best practices. Here are some adjustments you can make:

*NOTE: anytime `HANDLE` is referenced, replace it with the plugin handle.*

- Rename `_source/_css/app.scss` to `HANDLE.scss`.
- In `_source/_css/HANDLE.scss`, comment or delete the line that includes `lib/_reset`.
- In the `_source/_components` folder, do a find and replace from `c_` to `HANDLE_`.
- Rename `_source/_js/app.js` to `HANDLE.js`.
- Namespace the `VueEvent` variable by find and replace within the `_source/` folder.
  - Do the find and replace again in `_starter/components`.
- Namespace the `jsDevMode` variable by find and replace within the `_source/` folder.
  - Do the find and replace again in `_starter/components`.
- In `_source/_js/HANDLE.js`, do the following:
  - Comment out the entire root Vue block.
    - In Craft‘s CP, you'll want to create several Vue instances.
- In `_source/_js/global.js`, do the following:
  - Remove the import for `lazy.js`.
  - Remove the `setupEnhancements()` function.
- Add this chunk to your main plugin class (combine if necessary), and replace `jsDevMode` with your namespaced version:
```php
if (Craft::$app->getView()->getTemplateMode() === View::TEMPLATE_MODE_CP) {
    Event::on(View::class, View::EVENT_BEFORE_RENDER_TEMPLATE, function() {
        Craft::$app->getView()->registerJs('window.jsDevMode = window.jsDevMode || ' . (Craft::$app->getConfig()->getGeneral()->devMode ? 'true' : 'false') . ';', 1);
    });
}
```


---
## Release Notes
#### 5.2.0
##### Components
- :rocket: Added a new `ColorSchemeToggle` Vue component
  - This allows you to set the site’s color scheme based on those set in the `package.json` file
- :wrench: Twig components now use Craft’s built in `attr()` function to set component attributes



#### 5.1.0

##### Build Process
- :rocket: Added `Craft 3 Plugin` as a project type and put setup steps into `README.md`
- :rocket: Added color effects for users with a DAS Q5 keyboard
  - To turn this on, add a `das` object to `.wb-starter.config.json` file (see example below)
- :rocket: Added support for `yarn` and `pnpm` package managers
  - Requires chosen package manager to be installed before using
- :wrench: Lots of minor improvements and bug fixes
- :fire: Removed MQ Packer
- :wrench: Changed HTML template to EJS in `component.js`
- :wrench: Fixed a few syntax bugs in `component.js`
  
To add DAS Q5 animation add this to your `.wb-starter.config.json` in your home folder
```json
  "das": {
    "enabled": true
  },
```

##### Package file
- :wrench: Added color schemes
  - This adds a layer to the `colors` object
  - A `default` scheme is used for all base site colors
  - Adding a `dark` or `light` scheme will automatically wrap color overrides in a `prefers-color-scheme` media query
- :wrench: Moved `postcss` object to an array of config objects so each CSS file processed can have separate postCSS actions applied
- :rocket: Favicon can be disabled by setting `favicon.enabled` to `false`
- :rocket: Added `paths.base.release` to indicate where plugins should be stored upon release

##### Webpack
- :wrench: Moved babel to `webpack.prod.js` to fix a situation where babel on watch would cause compile issues

##### CSS
- :rocket: Added color schemes to make it easy to automatically add a "Dark Mode" theme and to pave the way for a color scheme picker component
- :wrench: Split `_mixins` file out into new `_custom_properties`, `_functions`, and `_variables` files
  - Files split out to make it easier for importing into Vue components
  - `_custom_properties` is meant for all global CSS Custom Properties
  - `_variables` is where SASS variables should be placed
  - `_functions` is where SASS functions should be placed
  
##### JS
- :rocket: Added `adminbar.js` to make it easier to load Admin Bar on Craft 3 websites
- :wrench: Changed `introduceElement` method to `animate`
  - Added `background-color` and `custom` animations
  - Custom makes it easy to animate anything that GSAP can animate by putting GSAP properties into `args.properties` object
- :rocket: Added Vue-based class toggle to `app.js`
- :rocket: Added logging methods to `global.js`:
  - You may now import and use: `dir`, `error`, `log`, `warn`
- :rocket: Added `slugify` and `snake` functions to `global.js`
- :fire: Removed `setupEnhancements()` function and moved all setup to `app.js`
- :wrench: Refactored `lazy.js` so you can access all properties and methods from class instance

##### EJS
- :wrench: Changed CSS loading to use loadCSS

##### Craft/Twig
- :wrench: Moved back from `env.php` to `.env` for config
- :rocket: Added base Site Module module
- :rocket: Added project config settings
- :rocket: Added `FauxTwigExtension.php` to automatically load syphony autocomplete for Twig files
- :fire: Removed presets from `volumes.php`
  - Use project config to manage Volumes
- :fire: Removed links from Admin Bar config

#### 5.0.0
- :rocket: Complete rewrite from Gulp to Node!

## Credits
This project has been created with help and advice from @khalwat, @MarcHartwig13, @zsackett-dixonschwabl, @ds-mfoster, @muneath.

It‘s inspired by many project, including:
- [nystudio107/craft](https://github.com/nystudio107/craft)
- [Craft CMS 3](https://github.com/craftcms/craft)
- [Craft Scripts](https://github.com/nystudio107/craft-scripts)
- [Craft3-Multi-Environment](https://github.com/nystudio107/craft3-multi-environment)