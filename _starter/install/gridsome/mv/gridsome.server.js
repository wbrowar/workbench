// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const glob = require('glob-all'),
      path = require('path'),
      wb = require(`./wb.config.js`);

module.exports = function (api) {
  api.loadSource((store) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api

    store.addMetadata('devMode', wb.devMode);
    store.addMetadata('devDocs', wb.enableDocs);
  });

  api.createPages(async (api) => {
    // 1. Get the section handle for the Craft entries you want to build out
    // 2. Create a template file in src/templates with the filename that matches the section handle
    // 3. Uncomment the code below and replace 'helloWorld' with the section handle

    // await createPagesForCraftSection('helloWorld', api);

    // Create style inventory pages
    if (wb.enableDocs) {
      // const componentDocPages = glob.sync(`./_source/_js/automated/dev/*.vue`);
      const componentDocPages = glob.sync(`${ wb.paths.components.src }**/demo.vue`);
      componentDocPages.forEach((item) => {
        const slug = path.dirname(item).split(path.sep).pop();
        api.createPage({
          path: `/dev/docs/${ slug }`,
          component: `${ wb.paths.js.src }automated/ComponentDocs.vue`,
          context: {
            slug: slug,
          }
        });
      });
    }
  });

  api.configureWebpack({
    resolve: {
      alias: {
        Components: path.resolve(wb.paths.components.src),
        CSS: path.resolve(wb.paths.css.src),
        JS: path.resolve(wb.paths.js.src),
        Source: path.resolve(wb.paths.starter.source),
        Starter: path.resolve(wb.paths.starter.starter),
      }
    }
  })
};

async function createPagesForCraftSection(section, { graphql, createPage }) {
  const { data } = await graphql(`
    query {
      craft {
        entries(limit: null, section: "${ section }") {
          uri
          ... on craft_EntryInterface {
            sectionHandle
          }
        }
      }
    }
  `);

  data.craft.entries.forEach((node) => {
    createPage({
      path: `/${ node.uri }`,
      component: `./src/templates/${ node.sectionHandle }.vue`,
      context: {
        uri: node.uri
      }
    })
  });
}