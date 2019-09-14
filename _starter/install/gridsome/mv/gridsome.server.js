// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const path = require('path');

module.exports = function (api) {
  api.loadSource(({ addContentType }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api
  })

  api.createPages(async (api) => {
    // 1. Get the section handle for the Craft entries you want to build out
    // 2. Create a template file in src/templates with the filename that matches the section handle
    // 3. Uncomment the code below and replace 'helloWorld' with the section handle

    // await createPagesForCraftSection('helloWorld', api);
  });

  api.configureWebpack({
    resolve: {
      alias: {
        starter: path.resolve(__dirname, '_source/'),
      }
    }
  })
};

async function createPagesForCraftSection(section, { graphql, createPage }) {
  const { data } = await graphql(`
    query {
      craft {
        entries(limit: null, section: "${ section }") {
          slug
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
        slug: node.slug
      }
    })
  });
}