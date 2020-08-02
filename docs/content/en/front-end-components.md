---
title: Components
description: 'Scaffolding installer for front-end and back-end projects.'
position: 204
category: Front-end Projects
version: 6.1.0
fullscreen: false
---

- During installation you will be asked to select which components you would like to use in your project. Project components will appear in the `_source/_components/` directory.
- Components can include the following file:
  - *`.scss`* - Styles for the component. These styles will be combined and included as global styles that are available throughout the project.
  - *`.vue`* - A [Vue](https://vuejs.org) single file component file that can be imported into other Vue components.
  - *`demo.vue`* - A file used to display documentation in Vue-based sites.
  
<alert type="info">

Some component directories will include just a `.scss` file or just a `.vue` file. While a primary Vue component is usually included, component directories can include multiple, related Vue components.

</alert>


## Adding Components
- To move an existing component run `npm run component -- --mv` and select which component you would like to move from the list.
  - The selected component will be moved from the `_starter/components/` directory into the `_source/_components/` directory. 
- To create a new component run `npm run component` and answer the questions when prompted.


## Styling Components
- Components should utilize the project’s Tailwind design system as much as possible.
- SCSS styles for Vue components may go in either the `.vue` file or in the component‘s `.scss` file, depending on whether or not the CSS should be processed by SASS with the rest of the project‘s styles.
- Component all have a wrapper element with a class that is prefixed with `c-`. This should be used when writing SCSS styles.


## Component Docs
The Docs for a Vue-based site live at `dev/docs/general/`. Every component in `_source/_components/` that contains a `demo.vue` will create a page in the docs.

Docs pages will always contain the navigation at the top. The rest of the content is created in Vue so the order and information shown is determined by the component maintainer.

There are some helper components that can be used to enhance the docs:

| Name | Description |
| --- | --- |
| `CodeExample` | Display the output of a component and show the code used. |
| `CssModifiers` | A table of CSS modifiers tied to the component’s root class. |
| `EventsTable` | A table of events emitted from the Vue component. |
| `ImportPath` | The path used to import the component into another Javascript file. Clicking on this component will copy the import statement to the clipboard. |
| `PropsTable` | A table of props that can be passed into the Vue component. |