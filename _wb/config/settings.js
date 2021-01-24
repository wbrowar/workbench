/*
 * Enables debug features and optimizes for build
 */
const devMode = process.env.VITE_DEV_MODE === 'true';

/*
 * Enables debug features and optimizes for build
 */
const enableDocs = process.env.VITE_ENABLE_DOCS === 'true';

/*
 * Enables debug features and optimizes for build
 */
const enableWebp = process.env.VITE_ENABLE_WEBP === 'true';

/*
 * Machine-readable name of the project, used internally only
 */
const name = 'wb-test';

/*
 * Project type chosen when installing this project
 */
const projectType = 'vue3';

/*
 * All settings combined
 */
const settings = {
  devMode,
  enableDocs,
  enableWebp,
  name,
  projectType,
};

module.exports = settings;
