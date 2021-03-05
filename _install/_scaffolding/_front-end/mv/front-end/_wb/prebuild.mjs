import { default as ejs } from 'ejs';
import { default as fs } from 'fs-extra';
import { default as glob } from 'glob-all';
import { default as paths } from '../wb.paths.js';
import { default as scraper } from '../wb.scraper.js';
import { default as favicon } from '../wb.favicon.js';
import { default as settings } from '../wb.settings.js';
import * as g from './functions.mjs';

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const runCssIncludes = typeof argv.options['css-includes'] !== 'undefined' ? argv.options['css-includes'] : false;
const runScraper = typeof argv.options.scraper !== 'undefined' ? argv.options.scraper : false;
const verbose = typeof argv.options.verbose !== 'undefined' ? argv.options.verbose : false;

async function run() {
  const settingsToEsm = g.asyncFunction(`Scraping HTML Pages`, `Pages Scraped`, (resolve) => {
    _configToEsm(resolve, paths, settings, 'settings', verbose);
  });
  const settingsToEsmComplete = await settingsToEsm;

  const faviconSettingsToEsm = g.asyncFunction(`Scraping HTML Pages`, `Pages Scraped`, (resolve) => {
    _configToEsm(resolve, paths, favicon, 'favicon', verbose);
  });
  const faviconSettingsToEsmComplete = await faviconSettingsToEsm;

  if (runCssIncludes) {
    const cssIncludes = g.asyncFunction(`Combining PostCSS Files`, `PostCSS Files Combined`, (resolve) => {
      _cssIncludes(resolve, paths, verbose);
    });
    const cssIncludesComplete = await cssIncludes;
  }

  if (runScraper) {
    const execScraper = g.asyncFunction(`Scraping HTML Pages`, `Pages Scraped`, (resolve) => {
      _scraper(resolve, paths, scraper, verbose);
    });
    const execScraperComplete = await execScraper;
  }
}

/*
 * Creates a copy of the config file in JS/automated
 * @param callback
 */
function _configToEsm(callback, paths, config, outputFilename, verbose) {
  const options = {
    config,
  };

  ejs.renderFile(`${paths.wb.templates}_js/config.js`, options, {}, function(err, str) {
    if (err) {
      g.log('warn', err);
    }
    fs.outputFile(paths.js.src + `automated/${outputFilename}.js`, str, (err) => {
      if (!err) {
        g.log('verbose', `JS templates compiled: automated/${outputFilename}.js`, verbose);
        callback();
      }
    });
  });
}

/*
 * Scrape URLs and save as local file
 * @param callback
 */
function _cssIncludes(callback, paths, verbose) {
  glob(`${paths.components.src}**/*.css`, function(er, files) {
    g.log('verbose', `Compontent CSS Files:`, verbose);
    g.log('dump', files, verbose);
    let data = `/* CSS from _source/_components/ */
`;
    files.forEach((item) => {
      data += `@import "../../_components/${item.replace(paths.components.src, '')}";
`;
    });
    g.log('verbose', data, verbose);

    const cssIncludesPath = paths.css.src + 'automated/_components.css';
    fs.outputFile(cssIncludesPath, data, (err) => {
      if (!err) {
        g.log('verbose', `Writing combined PostCSS files to: ${cssIncludesPath}`, verbose);
        callback();
      }
    });
  });
}

/*
 * Scrape URLs and save as local file
 * @param callback
 */
function _scraper(callback, paths, options, verbose) {
  let count = options.pages.length;

  if (count > 0) {
    options.pages.forEach((page) => {
      if (page.dist && page.src) {
        g.log('verbose', `Scraping page: ${page.src}`, verbose);
        const request = requestSync('GET', page.src);
        if (request.statusCode === 200 || page.allow404) {
          // Output page to dist
          let pagBody = request.body;
          if (options.replacements) {
            Object.keys(options.replacements).forEach((key) => {
              pagBody = pagBody.replace(/${key}/g, options.replacements[key]);
            });
          }
          fs.outputFileSync(page.dist, pagBody);
          g.log('verbose', `Wrote file: ${page.dist}`, verbose);

          // Extract URLs form sitemap index and parse secondary pages
          if (page.type === 'sitemap') {
            g.log('verbose', `Extracting sitemap URLs from ${page.src}`, verbose);
            const removedDates = request.body.toString().replace(/(<lastmod>(.....)+<\/lastmod>)/gi, '');
            const removedTags = removedDates.replace(/(<([^>]+)>)/gi, ',');
            const replacedRoots = removedTags.replace(new RegExp(page.sitemapRootSrc, 'g'), page.sitemapRootDist);
            const subSitemaps = replacedRoots.split(',').filter((item) => item !== '');

            if (subSitemaps) {
              subSitemaps.forEach((subPage) => {
                const subPageRequest = requestSync('GET', subPage);

                if (subPageRequest.statusCode === 200) {
                  fs.outputFileSync(subPage.replace(page.sitemapRootDist, paths.wb.static), subPageRequest.body);
                }
              });
            }
            g.log('dump', subSitemaps, verbose);
          }
        }

        count--;
        if (count === 0) {
          callback();
        }
      }
    });
  } else {
    callback();
  }
}

run();
