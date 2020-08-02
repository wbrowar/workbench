---
title: NPM Scripts
description: 'Scaffolding installer for front-end and back-end projects.'
position: 202
category: Front-end Projects
version: 6.1.0
fullscreen: false
---

NPM Scripts may be added depending on what type of project you are creating. Check the `package.json` file to see what scripts are available after installation is complete.

## Scripts

Run these scripts with this syntax:
```
npm run SCRIPT_NAME
```

| Script | Description |
| --- | --- |
| `cnvm` | Changes the version of node using [nvm](https://github.com/nvm-sh/nvm) based on the version in the `.nvmrc` file. |
| `ci:build` | The build script used in CI environment like Buddy and Netlify. |
| `component` | Adds or moves a component into your project‘s `_source/_components` directory. |
| `deploy` | Prepares code for commit to a repo that triggers CI deployment. |
| `dev` | Development build that processes templates and theme files and runs the project on a local server. |
| `favicon` | Generates favicon files from a PNG file in `_source/_favicon`. |
| `prebuild` | A set of tasks done before handing a build off to a third-party build process. |
| `prod` | Completes the build script in `production` mode for local testing. |
| `postbuild` | A set of tasks done after build is complete. |

<alert type="info">

Some node modules have arguments that can be passed into them. Scripts can be set up to pass arguments in based on the needs of the project.

</alert>


## When to Use What

### During Development
- Run `npm run dev` to process JS config files, templates in the `_starter` folder, and SVG icons. This will then start a local Webpack server and start hot module replacement.

### One-Off Processes
- Running `npm run component` will allow you to create a new Vue component, or move one of the existing components into your project. See [Components](/front-end-components) for more information.
- The script, `npm run favicon`, can be used to generate meta icons. It should be run only once, or whenever your favicon image changes.

### Staging and Testing
- If you would like to see what a production build looks like, run `npm run prod` locally. `npm run prod` includes extra tasks, such as Babel transpiling and PurgeCSS. While these may not be needed for better performance on a staging server, these tasks might slightly change the code enough to cause bugs to appear.

### Going Live
- If you are using CI to deploy your project, run `npm run deploy`—every time—before committing code to a staging server. This will do the same thing as running `npm run prod`, but it removes build files that will ultimately be built during deployment.


## Aliases
If you use an `.alias` file for command line aliases, here are shortcuts for the more commonly used scripts.

```bash
alias comp="nvm use && npm run component"
alias dep="nvm use && npm run deploy"
alias dev="nvm use && npm run dev"
alias prod="nvm use && npm run prod"
```