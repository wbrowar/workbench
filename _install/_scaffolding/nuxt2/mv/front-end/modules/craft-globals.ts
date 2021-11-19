import path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { Module } from '@nuxt/types';
import { NuxtOptionsGenerateRoute } from '@nuxt/types/config/generate';
import { globalsGql } from '../gql/globalsGql';
import { getPayloadForSection } from './nuxtGenerateRoutes';

const craftGlobalsModule: Module = function() {
  let publicFiles: Record<string, string>[];

  this.nuxt.hook('ready', async () => {
    const query = globalsGql;
    this.options.generate.routes = await routes();
    return await axios
      .post(
        process.env.CRAFT_API_URL || '',
        {
          query,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.CRAFT_AUTH_TOKEN}`,
          },
        }
      )
      .then((res) => {
        if (res.data?.data) {
          this.addPlugin({
            src: path.resolve(__dirname, 'plugins/craft-globals-inject.ts'),
            options: {
              data: JSON.stringify({
                // exampleFromGlobalQuery: res.data.data.exampleFromGlobalQuery,
              }),
            },
          });

          if (res.data.data.publicFiles?.frontendTemplateContainer) {
            publicFiles = JSON.parse(res.data.data.publicFiles.frontendTemplateContainer);
          }
          if (
            res.data.data.sitemapFiles?.sitemapIndexes?.[0]?.contents &&
            res.data.data.sitemapFiles?.sitemapStyles?.contents &&
            res.data.data.sitemapFiles?.sitemaps
          ) {
            const sitemapIndexes = res.data.data.sitemapFiles.sitemapIndexes[0].contents;
            if (sitemapIndexes) {
              publicFiles.push({ 'sitemap.xml': sitemapIndexes });
            }

            const sitemapStyles = res.data.data.sitemapFiles.sitemapStyles.contents;
            if (sitemapStyles) {
              publicFiles.push({ 'sitemap.xsl': sitemapStyles });
            }

            const sitemaps = res.data.data.sitemapFiles.sitemaps.map((file: Record<string, any>) => {
              const obj: Record<string, any> = {};
              obj[file.filename] = file.contents;
              return obj;
            });
            if (sitemaps.length) {
              publicFiles.push(...sitemaps);
            }
          }
          console.log(publicFiles);
        } else {
          console.log(res.data);
          console.log(res.data.errors[0].locations);
        }
      });
  });

  this.nuxt.hook('generate:done', () => {
    if (publicFiles?.length) {
      const files: Record<string, string> = {
        ads: 'ads.txt',
        humans: 'humans.txt',
        robots: 'robots.txt',
        security: 'security.txt',
      };

      publicFiles.forEach((file) => {
        Object.keys(file).forEach((name) => {
          const filename = files[name] ?? name;
          try {
            fs.writeFileSync(`./dist/${filename}`, file[name]);
          } catch (err) {
            if (err) return console.log(err);
          }
          console.log(`Wrote ./dist/${filename}`);
        });
      });
    }
  });
};

async function routes(): Promise<NuxtOptionsGenerateRoute[]> {
  const routes: NuxtOptionsGenerateRoute[] = [];
  if (process.env.CRAFT_API_URL !== '' && process.env.CRAFT_AUTH_TOKEN !== '') {
    // Basic pages
    // const basicPage = await getPayloadForSection('basicPage');
    // routes.push(...basicPage);
  }
  return routes;
}

export default craftGlobalsModule;
