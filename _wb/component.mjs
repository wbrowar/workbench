import { default as ejs } from 'ejs';
import { default as fs } from 'fs-extra';
import { default as glob } from 'glob-all';
import { default as inquirer } from 'inquirer';
import { default as path } from 'path';
import * as g from './functions.mjs';
import { default as paths } from '../wb.paths.js';

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const action = argv.options.mv || false ? 'move' : 'new';
const verbose = argv.options.verbose || false;

// set variables based on wb options
let questions;

async function run() {
  if (action === 'move') {
    if (argv.options.mv !== true) {
      if (fs.statSync(`${paths.wb.components}${argv.options.mv}`)) {
        g.log('verbose', `Moving ${argv.options.mv}`, verbose);
        moveExistingComponent(argv.options.mv);
      }
    } else {
      g.log('verbose', `Looking for an existing component`, verbose);

      const libraryComponents = glob.sync(`${paths.wb.components}*`);
      g.log('verbose', `${paths.wb.components}*`, verbose);

      if (libraryComponents.length > 0) {
        questions = [
          {
            type: 'list',
            name: 'component',
            message: 'Component',
            choices: () => {
              let components = [];

              libraryComponents.forEach((item) => {
                components.push({ name: path.basename(item), value: path.basename(item) });
              });

              return components;
            },
          },
        ];

        inquirer.prompt(questions).then(function (answers) {
          g.log('verbose', `Answers:`, verbose);
          g.log('dump', answers, verbose);
          g.log('verbose', `Moving ${answers.component}`, verbose);
          moveExistingComponent(answers.component);
        });
      } else {
        console.warn(`No components found in library.`);
      }
    }
  } else if (action === 'new') {
    // HELLO
    g.log('app', `Create a New Component`);

    questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Name',
        default: 'Button',
        validate: (answer) => {
          return answer !== '';
        },
      },
      {
        type: 'input',
        name: 'handle',
        message: 'Handle',
        default: (answers) => {
          return g.snake(answers.name);
        },
        validate: (answer) => {
          return answer !== '';
        },
      },
      {
        type: 'checkbox',
        name: 'templates',
        message: 'Files',
        choices: [
          { name: 'CSS', value: 'css' },
          { name: 'Twig', value: 'twig' },
          { name: 'Vue', value: 'vue' },
        ],
        validate: (answer) => {
          return answer.length > 0;
        },
      },
    ];

    inquirer.prompt(questions).then(function (answers) {
      g.log('verbose', `Answers:`, verbose);
      g.log('dump', answers, verbose);

      answers.templates.forEach((item) => {
        let config = answers;
        config.condensedName = answers.name.replace(/\s+/g, '');
        config.handleKebab = answers.handle.replace(/_/g, '-');
        let delimiter = '%';

        switch (item) {
          case 'css':
            config = Object.assign(
              {
                src: `${paths.wb.templates}_components/new/HANDLE.scss`,
                dist: `${paths.components.src}${answers.handle}/_${answers.handle}.scss`,
              },
              config
            );
            break;
          case 'twig':
            config = Object.assign(
              {
                src: `${paths.wb.templates}_components/new/HANDLE.twig`,
                dist: `${paths.components.src}${answers.handle}/${answers.handle}.twig`,
              },
              config
            );
            break;
          case 'vue':
            config = Object.assign(
              {
                src: `${paths.wb.templates}_components/new/HANDLE.vue`,
                dist: `${paths.components.src}${answers.handle}/${answers.name.replace(/\s+/g, '')}.vue`,
              },
              config
            );
            break;
        }

        moveFile(config, delimiter);
      });
    });
  }
}

// FUNCTIONS
function moveExistingComponent(handle) {
  const componentSourceFolder = `${paths.wb.components}${handle}`;

  fs.moveSync(componentSourceFolder, paths.components.src + handle, { overwrite: false });
}
function moveFile(config, delimiter = '%') {
  if (process) {
    ejs.renderFile(config.src, config, { delimiter: delimiter }, function (err, str) {
      fs.outputFile(config.dist, str, (err) => {
        if (!err) {
          g.log('verbose', `Compiled : ${config.dist}`, verbose);
        }
      });
    });
  }
}

// INIT
run();
