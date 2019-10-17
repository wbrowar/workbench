WB-Starter
==========

My personal framework for front-end development includes some SASS, HTML, and JS snippets that I use on a regular basis. This framework is built using Node and Webpack and it is meant to be pulled apart or modified for the project at hand. By changing settings in the `package.json` file, this can be used for one-page landing pages, as well as used in full-fledged CMS themes.

This is here for my own storage, but please [let me know if you have any feedback or suggestions](https://github.com/wbrowar/WB-Starter/issues).

## Requirements
- [Node.js](https://nodejs.org/en/) (requires v11+)
- [Composer](https://getcomposer.org) (for Craft-based projects)

## Documentation

Documentation can be found in the [GitHub wiki](https://github.com/wbrowar/WB-Starter/wiki)


---
 Release Notes
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