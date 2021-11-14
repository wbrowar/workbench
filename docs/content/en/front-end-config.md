---
title: Config Files
description: 'Scaffolding installer for front-end and back-end projects.'
position: 203
category: Front-end Projects
version: 6.1.0
fullscreen: false
---

All front-end projects include a `wb.config.js` file and a `tailwind.config.cjs` file in the project root. Depending on the project type, other config files may also be found in the project root.

## Config Files

| Filename | Description |
| --- | --- |
| `.nvmrc` | Ensures the right version of node is used during developing. |
| `jest.config.js` | (Currently needs to be set up) The configuration file used to run Jest-based tests on front-end projects. |
| `nuxt.config.js` | Used in Nuxt.js projects to configure build steps, register modules and plugins, and configure Webpack. |
| `postcss.config.js` | Set options for PostCSS. Additional PostCSS plugins can be configured here. |
| `purgecss.config.js` | Configure PurgeCSS to reduce extra CSS created by Tailwind CSS. |
| `tailwind.config.cjs` | A shell for the default Tailwind CSS config. Tailwind utilities and plugins should be managed in the `wb.config.js` file. |
| `vue.config.js` | Used in Vue SPA projects to configure Webpack and set settings used by `vue-cli`. |
| `wb.config.js` | Creates the general config for Tailwind CSS, configures the node scripts in the `_starter` directory, and provides additional options that can be used in components and throughout the project. |


## `wb.config.js`

The `wb.config.js` file includes several options that can be used by config files. The `wb.config.js` is also cloned into the `_source/_js/automated/` directory so it can be used in front-end Javascript files and Vue Components.

| Filename | Description |
| --- | --- |
| `colors` | Configures color palettes for Tailwind CSS based on custom color schemes. _NOTE: a `default` scheme is required, where `dark` and other custom schemes can be added as applicable. |
| `fonts` | Configures fonts in Tailwind and creates `@font-face` declarations in the global CSS when custom fonts are used. |
| `mq` | Defines media query variations in Tailwind CSS and sets media query breakpoints in `vue-mq`. |
| `opacity` | Overrides the default Tailwind settings for `opacity` and is used to create opacity color variants (see `colorOptions` below). |
| `tailwind` | Merged into Tailwind config to override and add to Tailwind’s defaults. _NOTE: plugins should be defined in `tailwindPlugins` instead of `tailwind`). |
| `tailwindPlugins` | Define custom Tailwind plugins to be included along with those created by the build process. |
| `name` | The project handle that was set during the installation of the project. |
| `projectType` | Is used in config files, Javascript files, and components to change the behavior based on the installed project type. |
| `devMode` | Used in config files and components to change the build process from environment to environment. |
| `enableDocs` | Enables the build and routing to Component Docs pages. |
| `enableWebp` | Used in the image component to determine if `webp` variants should be loaded in `picture` elements. |
| `colorOptions` | Generates color variants for different properties used in Tailwind CSS. _NOTE: This exponentially grows the CSS as more options are enabled. When possible, only use the variants needed for the project._ |
| `ejs` | An object that is merged into the EJS options for processing templates during `prebuild` and `postbuild`. |
| `favicon` | Options used by `npm run favicon` to generate favicon files. |
| `paths` | Paths to directories  |
| `scraper` | Defines pages that can be scraped and added to a static directory during `prebuild` when `--scraper` is on. |