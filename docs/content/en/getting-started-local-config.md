---
title: Local Config
description: 'Scaffolding installer for front-end and back-end projects.'
position: 102
category: Getting started
version: 6.1.0
fullscreen: false
---

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
| `npmInstaller` | The package manager used to install npm modules. Accepts: `npm` or `yarn` |
| `releaseDir` | Prefixes the `release` directory when `npm run pub` is used. |

Remove any options you don’t want to create a preset for. You will still be able to overwrite any of these presets when setting up a new project. If you delete this file from your home directory you can re-create it during your next installation.