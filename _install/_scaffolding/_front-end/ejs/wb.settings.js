const dotenv = require('dotenv');
dotenv.config();

/*
 * Enables debug features and optimizes for build.
 */
const devMode = process.env.DEV_MODE === 'true';

/*
 * Add variables that can be processed with EJS in Workbench template files.
 */
const ejs = {};

/*
 * Enables debug features and optimizes for build.
 */
const enableDocs = process.env.ENABLE_DOCS === 'true';

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
const projectType = '<%- install.projectType %>';

/*
 * All settings combined.
 */
module.exports = {
  devMode,
  ejs,
  enableDocs,
  enableWebp,
  name,
  projectType,
};
