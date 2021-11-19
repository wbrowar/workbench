/*
 * Root directories used by build system paths.
 */
const roots = {
  publicPath: process.env.PUBLIC_PATH || `/`,
  sourcePath: process.cwd() + '/_source/',
  srcPath: process.cwd() + '/',
  workbenchPath: process.cwd() + '/_wb/',
  staticPath: process.cwd() + '/public/',
};

/*
 * Paths used by the build system.
 */
module.exports = {
  components: {
    src: `${roots.sourcePath}_components/`,
  },
  composables: {
    src: `${roots.srcPath}composables/`,
  },
  css: {
    src: `${roots.sourcePath}_css/`,
  },
  favicon: {
    src: `${roots.sourcePath}_favicon/`,
  },
  img: {
    src: `${roots.sourcePath}_img/`,
  },
  js: {
    src: `${roots.sourcePath}_js/`,
  },
  publicPath: roots.publicPath,
  wb: {
    components: `${roots.workbenchPath}components/`,
    source: roots.sourcePath,
    src: roots.srcPath,
    workbench: roots.workbenchPath,
    static: roots.staticPath,
    templates: `${roots.workbenchPath}templates/`,
  },
};
