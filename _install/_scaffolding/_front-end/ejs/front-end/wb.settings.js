const dotenv = require('dotenv');
dotenv.config();

/*
 * Enables link to cms URL (do not use in production)
 */
const cmsUrl = process.env.CMS_URL || null;

/*
 * Enables debug features and optimizes for build.
 */
const devMode = process.env.DEV_MODE === 'true';

/*
 * Enables link to docs URL (do not use in production)
 */
const docsUrl = process.env.DOCS_URL || null;

/*
 * Add variables that can be processed with EJS in Workbench template files.
 */
const ejs = {};

/*
 * Enables debug features and optimizes for build.
 */
const enableWebp = process.env.ENABLE_WEBP === 'true';

/*
 * Machine-readable name of the project, used internally only.
 */
const name = '<%- install.handle %>';

/*
 * Project type chosen when installing this project.
 */
const projectType = '<%- install.frontEndFramework %>';

/*
 * All settings combined.
 */
module.exports = {
  cmsUrl,
  devMode,
  docsUrl,
  ejs,
  enableWebp,
  name,
  projectType,
};
