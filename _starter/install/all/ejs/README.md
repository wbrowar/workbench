# Overview
This project was built using [WB-Starter](#wb-starter) for building and optimizing CSS, JS, SVG, Image, and template files.

Source files are stored in the `<%- pkg.paths.base.src %>` directory. Using [NPM Scripts](#npm-scripts), these files are processed based on settings stored in the `package.json` file.<% if (pkg.projectType === 'craft3') { %>

This project is built using [Craft CMS 3](https://craftcms.com) and the control panel can be accessed by visiting: <%- pkg.paths.base.siteUrl + install.cpTrigger %>

This project utilizes [Craft Scripts](https://github.com/nystudio107/craft-scripts) to make development easier. These scripts automate pulling down the master database and user uploaded assets from staging or production.

Based on [Craft3-Multi-Environment](https://github.com/nystudio107/craft3-multi-environment), this project uses a `.env.php` file instead of a `.env` file for environment-specific config.<% } %>

# Development
To begin programming, start by cloning this repo into a local Apache or NGINX server environment and follow these steps:
1. Run `npm install` to download node modules.<% if (pkg.projectType === 'craft3') { %>
1. Make a copy of `example.env.php`, save it as `.env.php`, and configure it for your local environment.
1. Make a copy of `scripts/craft3-example.env.sh`, save it as `scritps/.env.sh`, and configure it for your local machine and the staging or production server that you will sync from.
1. Run `composer install` to download Craft and the project‘s plugins.<% } %>
1. Run `npm run dev` to build out the theme files from the source directory.

# Deloyment
The `master` branch is automatically deployed to the production server upon `git push`.

<% if (pkg.projectType === 'craft3') { %>
# Updating Craft CMS
Craft's auto-updating feature has been turned off on the `staging` and `live` environments because auto-updating makes changes to the `composer.json` files (affecting git deployment).

To update Craft and Craft plugins, you may use composer or Craft‘s CP auto-update in your `local` environment, then commit and push your changes to git.
<% } %>

# Third-Party Integrations
> Talk about third-party code used on the site and link to documentation

<% if (pkg.projectType === 'craft3') { %>
# Custom Modules
> Talk about custom modules or plugins created for this site
<% } %>


# WB-Starter Documentation
<%- include(`${ process.cwd() }/README.md`) %>