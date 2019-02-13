// import node modules
const chalk = require('chalk'),
      ejs = require('ejs'),
      fs = require('fs-extra'),
      glob = require('glob-all'),
      inquirer = require('inquirer'),
      notifier = require('node-notifier'),
      path = require('path');

// load package file
let pkg = require(`${ process.cwd() }/package.json`);

// set constants
const argv = parseArgv(),
      env = process.env.NODE_ENV || 'development';

// use CLI arguments to set variables
const action  = (argv.options.mv || false) ? 'move' : 'new',
      verbose = pkg.verboseOverride || argv.options.verbose || false;

// set variables based on pkg options
let paths = getPaths(pkg.paths),
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
                log('verbose', `Moving ${ argv.options.mv }`, verbose);
                moveExistingComponent(argv.options.mv);
            }
        } else {
            log('verbose', `Looking for an existing component`, verbose);

            const libraryComponents = glob.sync(`${ paths.starter.components }*`);
            log('verbose', `${ paths.starter.components }*`, verbose);

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
                    log('verbose', `Answers:`, verbose);
                    log('dump', answers, verbose);
                    log('verbose', `Moving ${ answers.component }`, verbose);
                    moveExistingComponent(answers.component);
                    addComponentToStyleInventory(answers.component);
                });
            } else {
                console.warn(`No components found in library.`);
            }
        }
    } else if (action === 'new') {
        // HELLO
        log('app', `Create a New Component`);

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
                    return snake(answers.name);
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
            log('verbose', `Answers:`, verbose);
            log('dump', answers, verbose);

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
{{ component.c('${ answers.handle }', {  }) }}\`
    },
    options: [
      { "name": 'example', "required": false, "type": 'string', "": \`''\`, "description": \`Description of example.\` },
    ]` : '';
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


        // BYE
        // log('app', `End`);
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
                return slugify(answers.newTitle);
            },
            validate: (answer) => {
                return answer.length > 0;
            },
        },
    ];

    inquirer.prompt(questions).then(function (answers) {
        log('verbose', `Answers:`, verbose);
        log('dump', answers, verbose);

        if (answers.targetPage === '__new__') {
            pkg.styleInventory['pages'][answers.newHandle] = {
                label: answers.newTitle,
                components: [handle]
            };
            log('verbose', `Created a new page:`, verbose);
            log('dump', pkg.styleInventory['pages'][answers.newHandle], verbose);
        } else if (answers.targetPage !== '__none__') {
            pkg.styleInventory['pages'][answers.targetPage].components.push(handle);
            log('verbose', `Added to page:`, verbose);
            log('dump', pkg.styleInventory['pages'][answers.targetPage], verbose);
        }

        // backup package file then overwrite the version number
        fs.copy(`${ process.cwd() }/package.json`, `${ paths.starter.backups }package.json`, (err) => {
            if (err) {
                log('warn', err, verbose);
            }
            log('verbose', `Package File Backed Up`, verbose);
            fs.outputFile(`${ process.cwd() }/package.json`, JSON.stringify(pkg, null, 2), function (err) {
                if (err) {
                    log('warn', err, verbose);
                }
                log('verbose', `Package file updated.`, verbose);
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
                    log('verbose', `Compiled : ${ config.dist }`, verbose);
                }
            });
        });
    }
}




// LIBRARY FUNCTIONS
// todo: move these to an ES6 module for sharing with other library files
// synchronously crawls each file
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

// Synchronously run a function and wait for a callback to fire
async function asyncFunction(startMessage, endMessage, func) {
    log('title', startMessage);

    const p = await new Promise(resolve => {
        func(resolve);
    }).then(()=>'');
    log('title', endMessage);
    return p;
}

// bump version
function bumpVersion(version, release = 'patch') {
    return semver.inc(version, release);
}

// get dist and src paths based on base path options
function getPaths(paths) {
    return {
        components: {
            src: process.cwd() + '/' + paths.base.src + paths.components.src,
        },
        css: {
            dist: process.cwd() + '/' + paths.base.dist + paths.css.dist,
            src: process.cwd() + '/' + paths.base.src + paths.css.src,
        },
        favicon: {
            dist: process.cwd() + '/' + paths.base.dist + paths.favicon.dist,
            src: process.cwd() + '/' + paths.base.src + paths.favicon.src,
        },
        icon: {
            dist: process.cwd() + '/' + paths.base.dist + paths.icon.dist,
            src: process.cwd() + '/' + paths.base.src + paths.icon.src,
        },
        img: {
            dist: process.cwd() + '/' + paths.base.dist + paths.img.dist,
            src: process.cwd() + '/' + paths.base.src + paths.img.src,
        },
        js: {
            dist: process.cwd() + '/' + paths.base.dist + paths.js.dist,
            src: process.cwd() + '/' + paths.base.src + paths.js.src,
        },
        templates: {
            dist: process.cwd() + '/' + paths.base.dist + paths.templates.dist,
            src: process.cwd() + '/' + paths.base.src + paths.templates.src,
        },
        starter: {
            backups: process.cwd() + '/_starter/backups/',
            build: process.cwd() + paths.base.build,
            components: process.cwd() + '/_starter/components/',
            templates: process.cwd() + '/_starter/templates/',
            styleInventory: process.cwd() + '/_starter/style_inventory/',
        }
    }
}

// get version number based on build environment
function getVersion(version) {
    return release ? version : null;
}

// display a message in the command line
function log(type = 'message', message, verbose = false) {
    switch (type) {
        case 'app':
            console.log(chalk.bgRgb(230, 20, 20)(`  ${ message }  `));
            break;
        case 'dump':
            if (verbose) {
                console.log(chalk.magenta.bold(`📦 ${ JSON.stringify(message, null, 2) }`));
            }
            break;
        case 'running':
            console.log(chalk.green.bold(`💻 ${ chalk.green(message) }`));
            break;
        case 'title':
            console.log(chalk.blue.bold(`🛠 ${ message }`));
            break;
        case 'verbose':
            if (verbose) {
                console.log(chalk.keyword('orange')(`🕵 ${ message }`));
            }
            break;
        case 'warn':
            console.warn(chalk.red.bold(`🚧 ${ message }`));
            break;
        default:
            console.log(message);
    }
}

// parse process arguments into an array format
function parseArgv() {
    let args = [];
    let options = {};

    process.argv.forEach(function(arg, i) {
        if(i > 1) {
            if (arg.substr(0, 2) === "--") {
                // remove leading dashes
                const str = arg.substr(2);

                // split out to key/value pairs
                if (str.indexOf("=") !== -1) {
                    const strSplit = str.split('=');
                    options[strSplit[0]] = strSplit[1];
                } else {
                    options[str] = true;
                }
            }
            else {
                args.push(arg);
            }
        }
    });

    return {
        args: args,
        options: options
    }
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function snake(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '_')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// determine if a command should be displayed in terminal when running shell commands
function verboseExec(command, verbose = false) {
    if (verbose) {
        log('running', command);
        exec.spawnSync(command, [], { stdio: 'inherit', shell: true });
    } else {
        exec.execSync(`${command} > /dev/null 2>&1`);
    }
}

// INIT
run();