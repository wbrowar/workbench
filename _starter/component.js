// import node modules
const ejs = require('ejs'),
      fs = require('fs-extra'),
      glob = require('glob-all'),
      inquirer = require('inquirer'),
      path = require('path');

// import global functions
const g = require('./global.js');

// load package file
let pkg = require(`${ process.cwd() }/package.json`);

// set constants
const argv = g.parseArgv(),
      env = process.env.NODE_ENV || 'development';

// use CLI arguments to set variables
const action  = (argv.options.mv || false) ? 'move' : 'new',
      verbose = pkg.verboseOverride || argv.options.verbose || false;

// set variables based on pkg options
let paths = g.getPaths(pkg.paths),
    questions;

// set notify configs
const notify = {
    icon: `${ pkg.paths.base.src }_favicon/favicon.png`,
    name: pkg.name,
};

async function run() {
    if (action === 'move') {
        if (argv.options.mv !== true) {
            if (fs.statSync(`${ paths.starter.components }${ argv.options.mv }`)) {
                g.log('verbose', `Moving ${ argv.options.mv }`, verbose);
                moveExistingComponent(argv.options.mv);
            }
        } else {
            g.log('verbose', `Looking for an existing component`, verbose);

            const libraryComponents = glob.sync(`${ paths.starter.components }*`);
            g.log('verbose', `${ paths.starter.components }*`, verbose);

            if (libraryComponents.length > 0) {
                questions = [
                    {
                        type: 'list',
                        name: 'component',
                        message: 'Component',
                        choices: () => {
                            let components = [];

                            libraryComponents.forEach((item) => {
                                components.push({ name: path.basename(item), value: path.basename(item) })
                            });

                            return components;
                        }
                    },
                ];

                inquirer.prompt(questions).then(function (answers) {
                    g.log('verbose', `Answers:`, verbose);
                    g.log('dump', answers, verbose);
                    g.log('verbose', `Moving ${ answers.component }`, verbose);
                    moveExistingComponent(answers.component);
                    addComponentToStyleInventory(answers.component);
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
                    { name: 'EJS', value: 'ejs' },
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
                let delimiter = '%';

                switch (item) {
                    case 'css':
                        config = Object.assign({
                            src: `${ paths.starter.templates }_components/new/HANDLE.scss`,
                            dist: `${ paths.components.src }${ answers.handle }/_${ answers.handle }.scss`,
                        }, config);
                        break;
                    case 'ejs':
                        config = Object.assign({
                            src: `${ paths.starter.templates }_components/new/HANDLE.ejs`,
                            dist: `${ paths.components.src }${ answers.handle }/${ answers.handle }.ejs`,
                        }, config);
                        delimiter = '?';
                        break;
                    case 'twig':
                        config = Object.assign({
                            src: `${ paths.starter.templates }_components/new/HANDLE.twig`,
                            dist: `${ paths.components.src }${ answers.handle }/${ answers.handle }.twig`,
                        }, config);
                        break;
                    case 'vue':
                        config = Object.assign({
                            src: `${ paths.starter.templates }_components/new/HANDLE.vue`,
                            dist: `${ paths.components.src }${ answers.handle }/${ answers.name.replace(/\s+/g, '') }.vue`,
                        }, config);
                        break;
                }

                moveFile(config, delimiter);
            });

            // move demo.ejs
            const twigCode = answers.templates.includes('twig') ? `,
  twig: {
    code:
\`{% import 'macros/component.twig' as component %}
{{ component.c('${ answers.handle }', {  }) }}\`,
        modifiers: ['example'],
        options: [
          { "name": 'example', "required": false, "type": 'string', "default": \`''\`, "description": \`Description of example.\` },
        ] 
    },` : '';
            const demoCode =
`<% let component = {
  title: "${ answers.name }",
  description: "A new component.",
  background: "light",
  html: {
    code:
\`<div class="c_${ answers.handle }">DEMO CODE</div>\`
  }${ twigCode }
} %>
<%- include(paths.starter.styleInventory + '_demo.ejs', { component: component, paths: paths, pkg: pkg, release: release }) %>`;

            fs.outputFileSync(`${ paths.components.src }${ answers.handle }/demo.ejs`, demoCode);

            addComponentToStyleInventory(answers.handle);
        });
    }
}












// FUNCTIONS
function addComponentToStyleInventory(handle) {
    let styleInventoryPages = [
        { name: 'Create a New Page', value: '__new__' },
        { name: 'Do Not Add to Style Inventory', value: '__none__' },
    ];
    Object.keys(pkg.styleInventory['pages']).forEach((key) => {
        styleInventoryPages.push({ name: pkg.styleInventory['pages'][key].label, value: key });
    });

    let questions = [
        {
            type: 'list',
            name: 'targetPage',
            message: 'Style Inventory Page',
            choices: styleInventoryPages,
            validate: (answer) => {
                return answer !== [];
            },
        },
        {
            type: 'input',
            name: 'newTitle',
            message: 'Page Title',
            when: (answers) => {
                return answers.targetPage === '__new__';
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'input',
            name: 'newHandle',
            message: 'Slug',
            when: (answers) => {
                return answers.targetPage === '__new__';
            },
            default: (answers) => {
                return g.slugify(answers.newTitle);
            },
            validate: (answer) => {
                return answer.length > 0;
            },
        },
    ];

    inquirer.prompt(questions).then(function (answers) {
        g.log('verbose', `Answers:`, verbose);
        g.log('dump', answers, verbose);

        if (answers.targetPage === '__new__') {
            pkg.styleInventory['pages'][answers.newHandle] = {
                label: answers.newTitle,
                components: [handle]
            };
            g.log('verbose', `Created a new page:`, verbose);
            g.log('dump', pkg.styleInventory['pages'][answers.newHandle], verbose);
        } else if (answers.targetPage !== '__none__') {
            pkg.styleInventory['pages'][answers.targetPage].components.push(handle);
            g.log('verbose', `Added to page:`, verbose);
            g.log('dump', pkg.styleInventory['pages'][answers.targetPage], verbose);
        }

        // backup package file then overwrite the version number
        fs.copy(`${ process.cwd() }/package.json`, `${ paths.starter.backups }package.json`, (err) => {
            if (err) {
                g.log('warn', err, verbose);
            }
            g.log('verbose', `Package File Backed Up`, verbose);
            fs.outputFile(`${ process.cwd() }/package.json`, JSON.stringify(pkg, null, 2), function (err) {
                if (err) {
                    g.log('warn', err, verbose);
                }
                g.log('verbose', `Package file updated.`, verbose);
            });
        });
    });
}
function moveExistingComponent(handle) {
    fs.moveSync(`${ paths.starter.components }${ handle }`, paths.components.src + handle, { overwrite: false })
}
function moveFile(config, delimiter = '%') {
    if (process) {
        ejs.renderFile(config.src, config, { delimiter: delimiter }, function(err, str) {
            fs.outputFile(config.dist, str, (err) => {
                if(!err){
                    g.log('verbose', `Compiled : ${ config.dist }`, verbose);
                }
            });
        });
    }
}

// INIT
run();