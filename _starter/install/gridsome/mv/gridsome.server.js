// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const glob = require('glob-all'),
      path = require('path');

module.exports = function (api) {
  api.loadSource(({ addContentType }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api
  })

  api.createPages(async (api) => {
    // 1. Get the section handle for the Craft entries you want to build out
    // 2. Create a template file in src/templates with the filename that matches the section handle
    // 3. Uncomment the code below and replace 'helloWorld' with the section handle

    // await createPagesForCraftSection('helloWorld', api);

    // Create style inventory pages
    if (process.env.NODE_ENV !== 'production') {
      const componentDocPages = glob.sync(`./_source/_js/automated/dev/*.vue`);
      componentDocPages.forEach((item) => {
        api.createPage({
          path: `/dev/docs/${ path.basename(item, '.vue') }`,
          component: `./_source/_js/automated/dev/${ path.basename(item) }`,
          context: {
            slug: path.basename(item)
          }
        });
      });
    }
  });

  api.configureWebpack({
    resolve: {
      alias: {
        Components: path.resolve(__dirname, './_source/_components/'),
        CSS: path.resolve(__dirname, './_source/_css/'),
        JS: path.resolve(__dirname, './_source/_js/'),
        Starter: path.resolve(__dirname, './_starter/'),
        Source: path.resolve(__dirname, './_source/'),
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