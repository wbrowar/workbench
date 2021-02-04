import { default as ejs } from 'ejs';
import { default as fs } from 'fs-extra';
import * as g from './functions.mjs';
import { default as paths } from '../wb.paths.js';
import { default as theme } from '../wb.theme.js';

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const verbose = typeof argv.options.verbose !== 'undefined' ? argv.options.verbose : false;

async function run() {
  if (g.fontSettingsExist(theme, verbose)) {
    g.log('verbose', `Generating @font-face CSS file.`, verbose);
    ejs.renderFile(`${paths.wb.templates}_css/_fonts.ejs`, { fonts: theme.fonts }, {}, function (err, str) {
      if (err) {
        g.log('warn', err);
      }
      fs.outputFile(paths.css.src + `automated/_fonts.css`, str, (err) => {
        if (!err) {
          g.log('verbose', `Generated CSS file: ${paths.css.src}_fonts.css`, verbose);
        }
      });
    });
  } else {
    g.log('warn', `There are no fonts to create from the given settings.`, verbose);
  }
}

// INIT
run();
