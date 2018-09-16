WB-Starter
==========

My personal framework for front-end development includes some SASS, HTML, and JS snippets that I use on a regular basis. This framework is built using Node and Webpack and it is meant to be pulled apart or modified for the project at hand. By changing settings in the `package.json` file, this can be used for one-page landing pages, as well as used in full-fledged CMS themes.

This is here for my own storage, but please [let me know if you have any feedback or suggestions](https://github.com/wbrowar/WB-Starter/issues).

## Requirements
- [Node.js](https://nodejs.org/en/) (requires v10+)
- [Composer](https://getcomposer.org)

## Installation
NOTE: these instructions are for macOS. Commands for Linux might be slightly different. I don‘t *think* Windows OS is supported.

1. Install [new-wb](https://www.npmjs.com/package/new-wb) by running `npm install -g new-wb`.
1. Run `new-wb` in the directory of your choice.
1. Enter in the required information requested by various sets of prompts.

**OR**

1. Create a new project folder and `cd` into it.
1. Clone this repo or download the [master.zip](https://github.com/wbrowar/WB-Starter/archive/master.zip) and unzip it.
1. Run `npm install` or `yarn` to download Node modules.
1. Run `node ./_starter/install.js --handle='CHANGE_ME'` and change `CHANGE_ME` to the name of your directory.
1. Enter in the required information requested by various sets of prompts.

## NPM Scripts
NPM Scripts may be added depending on what type of project you are creating. Check the `package.json` file to see what scripts are available after installation is complete.

| Script | Description |
| --- | --- |
| `component` | Add or move a component into your project‘s `_source/_components` directory. |
| `cssd` | Use Craft Scripts to pull down uploaded assets and the specified database. |
| `cssdb` | Pulls down only the database using Craft Scripts. |
| `dev` | Development build that processes templates and theme files. |
| `prod` | Completes the build script in `production` mode. |
| `pub` | Completes the build script in `production` mode, then does a GIT commit and push. |
| `pubd` | Does the same as `pub` but merges files from `dev` to `master` and does the commit from `master`. |
| `start` | Does a `git pull`, updates NPM and Composer dependencies, then runs the `watch` script. |
| `update` | Updates NPM and Composer dependencies. |
| `watch` | Completes the development build, then watches files in the `_source` folder for changes. |

If you use an `.alias` file for command line aliases, here are shortcuts for these scripts.

```bash
alias comp="npm run component"
alias cssd="npm run cssd"
alias cssdb="npm run cssdb"
alias dev="npm run dev"
alias prod="npm run prod"
alias pub="npm run pub"
alias pubd="npm run pubd"
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
| `dbHost` | Host where databases will be created. |
| `dbUser` | Database user. |
| `dbPort` | Port used to connect to your location database. |
| `gitUser` | Your GitHub username. |
| `gitOrg` | A GitHub organization name, if you plan to create sites for an organization. Leave this blank to create repos in your personal profile. |
| `gitPrivate` | Set this to `true` to create private GitHub repos. |

Remove any options you don’t want to create a preset for. You will still be able to overwrite any of these presets when setting up a new project. If you delete this file from your home directory you can re-create it during your next installation.

*NOTE: Passwords are not saved for security reasons.*

---
## When to Use What

### During Development
- At any given time, run `npm run dev` to reprocess JS, SCSS, templates, SVG icons, and image files.
- Every time you begin to write code, run `npm run watch` first. This will run `npm run dev`, then watch the `_source` folder and update theme files as you save them.

### Staging and Testing
- When staging files for review or testing, run `npm run prod`—every time—before deploying to a staging server. `npm run prod` includes extra tasks, such as Babel transpiling and uglification of Javascript files. While these may not be needed for better performance on a staging server, these tasks might slightly change the code enough to cause bugs to appear.

### Going Live
- When preparing to go live, run the `npm run prod` task. This will increase the version number in the `package.json` file, which will cause cache-busting to occur on static files that are loaded using version number parameters.
- Running `npm run prod` cleans out all CSS, JS, SVG, templates, and image files and replaces them with fresh builds.
- `npm run prod` also creates favicons and adds Critical CSS.

### Publishing a New Release
- Use `npm run pub` to commit a new release via that command line. This will run `npm run prod` first, then push your changes to GitHub.
- If you would like to tag your commit for release you can add it through the command line prompts.

## Style Inventory
- The Style Inventory displays the code and an example of the components available in your project.
- To get to the Style Inventory, go to `/dev/inv/index.html` or `/dev/inv/` in a Craft 3 project.
- In Craft websites, the Style Inventory section is available in `dev`, and `staging` environments and will redirect you to the home page in a `live` environment.
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
  - *`.html`* - Used to include the component via [EJS](http://ejs.co)
  - *`.scss`* - Styles for the component
  - *`.twig`* - A twig version that can be included via Twig `{{ component.c('COMPONENT_HANDLE', config) }}`
  - *`.vue`* - A [Vue](https://vuejs.org) single file component file
  - *`demo.ejs`* - An EJS file used to demonstrate the component‘s styling and functionality in the project‘s Style Inventory
- All files in `_source/_components/` will be processed with EJS during the build process. Even SCSS and JS files will be processed with EJS.

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

### SCSS Framework
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
  - *`purgecss`* – Removes all CSS that isn‘t used in in your template files
  - *`mqpacker`* – Combines media queries while keeping existing source order
  - *`automated`* – Adds browser prefixes when needed
  
To add a file for PostCSS processing, add its filename to the `postcss` array in `package.json`.

#### Using Colors in CSS
- Colors that are defined in `package.json`, in the `colors` object, will be generated as SCSS variables.
  - For example, `"blue": "rgb(0, 0, 255)"` can be used in the following ways in SCSS files:
    - `$color_blue` will output `var(--color-blue)`
    - Suffixing `_raw`, as in `$color_blue_raw`, will allow you to use SASS‘s color functions. For example, `transparentize($color_blue_raw, .4)` will output `rgba(0, 0, 255, .6)`
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

#### On-scroll Animations
When used with no value, `data-lazy-animate` simply adds the class `animated` to an element. In your CSS, a transition or CSS animation can fire when `animated` is added. You can also register a function that can be fired by setting the name of the function to the value of `data-lazy-animate`.

| Attribute | Example Value | Description |
| --- | --- | --- |
| `data-lazy-animate` | **NONE** or `myFunction` | When the user scrolls to the element, a function registered in `config.animationFunctions` (see example above), will be fired. |
| `data-lazy-animate-args` | `{ "id": 23, "option": "value" }` | Arguments that will be passed into the function registered in `data-lazy-animate` as an object. |
| `data-lazy-animate-delay` | `500` | Uses `setTimeOut()` to delay the firing of a function set in `data-lazy-animate`. |
| `data-lazy-animate-reset` | **NONE** | Add this attribute to allow a JS animation to continue firing as the element re-enters the viewport. |

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
## Release Notes
#### 5.0.0
- :rocket: Complete rewrite from Gulp to Node!

## Credits
This project has been created with help and advice from @khalwat, @MarcHartwig13, @zsackett-dixonschwabl, @ds-mfoster, @muneath.

It‘s inspired by many project, including:
- [nystudio107/craft](https://github.com/nystudio107/craft)
- [Craft CMS 3](https://github.com/craftcms/craft)
- [Craft Scripts](https://github.com/nystudio107/craft-scripts)
- [Craft3-Multi-Environment](https://github.com/nystudio107/craft3-multi-environment)