import { default as fs } from 'fs-extra';
import { default as inquirer } from 'inquirer';
import * as g from './functions.mjs';
import { default as paths } from '../wb.paths.js';
import { default as settings } from '../wb.settings.js';
import { default as theme } from '../wb.theme.js';

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const useProjectTypeDefaults =
  typeof argv.options['component-defaults'] !== 'undefined' ? argv.options['component-defaults'] : false;
let askToSetUpComponents = typeof argv.options.components !== 'undefined' ? argv.options.components : true;
let askToSetUpFavicon = typeof argv.options.favicon !== 'undefined' ? argv.options.favicon : true;
let askToSetUpFonts = typeof argv.options.fonts !== 'undefined' ? argv.options.fonts : true;
const verbose = typeof argv.options.verbose !== 'undefined' ? argv.options.verbose : false;

async function run() {
  // HELLO
  g.log('app', `Setting Up Site`);

  const questions = [
    {
      type: 'confirm',
      name: 'setUpFavicon',
      message: `Set Up Favicon?`,
      default: () => {
        g.log('verbose', `Checking for PNG file saved as ${paths.favicon.src}favicon.png`, verbose);
        if (fs.existsSync(`${paths.favicon.src}favicon.png`)) {
          g.log('verbose', `Favicon file found 😎`, verbose);
        } else {
          g.log(
            'warn',
            `No Favicon file found. Before continuing, save one at ${paths.favicon.src}favicon.png or this step will be skipped.`,
            verbose
          );
        }

        return true;
      },
      when: askToSetUpFavicon,
    },
    {
      type: 'confirm',
      name: 'setUpFonts',
      message: `Set Up Fonts?`,
      default: () => {
        g.log('verbose', `Checking for fonts that need @font-face declarations.`, verbose);
        if (g.fontSettingsExist(theme)) {
          g.log('verbose', `Font settings found in ./wb.theme.js.`, verbose);
        } else {
          g.log(
            'warn',
            `There are no fonts in ./wb.theme.js that need to be generated. Update settings or skip this step.`,
            verbose
          );
          return false;
        }

        return true;
      },
      when: askToSetUpFonts,
    },
    {
      type: 'confirm',
      name: 'setUpComponents',
      message: `Add Components to Project?`,
      default: true,
      when: askToSetUpComponents,
    },
  ];

  inquirer.prompt(questions).then(function (answers) {
    g.log('verbose', `Answers:`, verbose);
    g.log('dump', answers, verbose);

    const setUpComponents = typeof answers.setUpComponents !== 'undefined' ? answers.setUpComponents : false;
    const setUpFavicon = typeof answers.setUpFavicon !== 'undefined' ? answers.setUpFavicon : false;
    const setUpFonts = typeof answers.setUpFonts !== 'undefined' ? answers.setUpFonts : false;

    /*
     * Components
     */
    if (setUpComponents) {
      const vue3DefaultComponents = [
        'accessibility',
        'button',
        'color_scheme_toggle',
        'dev_bar',
        'general',
        'header',
        'icon_svg',
        'image',
        'lazy_animate',
        'lazy_load',
        'text',
        'touch_box',
        'video',
        'wrapper',
      ];
      const projectTypeDefaultComponents = {
        vue3: vue3DefaultComponents,
        'vue3-marketo': ['marketo_form', ...vue3DefaultComponents],
      };

      g.verboseExec(
        `node ${paths.wb.workbench}component.mjs --mv ${
          projectTypeDefaultComponents[settings.projectType] && useProjectTypeDefaults
            ? `--list=${projectTypeDefaultComponents[settings.projectType].join(',')}`
            : ''
        }${verbose ? ' --verbose' : ''}`,
        verbose
      );
    }

    /*
     * Favicon
     */
    if (setUpFavicon) {
      g.verboseExec(`node ${paths.wb.workbench}favicon.mjs${verbose ? ' --verbose' : ''}`, verbose);
    }

    /*
     * Fonts
     */
    if (setUpFonts) {
      g.verboseExec(`node ${paths.wb.workbench}fonts.mjs${verbose ? ' --verbose' : ''}`, verbose);
    }

    // BYE
    g.log('app', `Site Setup Complete`);
  });
}

// INIT
run();
