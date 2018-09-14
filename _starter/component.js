// import node modules
const chalk = require('chalk'),
      ejs = require('ejs'),
      fs = require('fs-extra'),
      glob = require('glob'),
      inquirer = require('inquirer'),
      notifier = require('node-notifier'),
      path = require('path');

// set variables
let env = process.env.NODE_ENV || 'development',
    verbose; // whether or not commands are displayed in terminal output

// load package file
let pkg = require(`${ process.cwd() }/package.json`);
let paths = getPaths(pkg.paths);

// set notify configs
const notify = {
    icon: `${ pkg.paths.base.src }_favicon/favicon.png`,
    name: pkg.name,
};

async function run() {
    // HELLO
    log('app', `Create a New Component`);

    // INIT
    // get command line arguments and set default config variables
    const argv = parseArgv();
    action     = (argv.options.mv || false) ? 'move' : 'new';
    verbose    = pkg.verboseOverride || argv.options.verbose || false;

    let questions;

    if (action === 'move') {
        if (argv.options.mv !== true) {
            if (fs.statSync(`${ paths.starter.templates }_components/library/${ argv.options.mv }`)) {
                log('verbose', `Moving ${ argv.options.mv }`, verbose);
                moveExistingComponent(argv.options.mv);
            }
        } else {
            log('verbose', `Looking for an existing component`, verbose);

            const libraryComponents = glob.sync(`${ paths.starter.templates }_components/library/*`);
            log('verbose', `${ paths.starter.templates }_components/library/*`, verbose);

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
                    log('verbose', `Component Options: ${ JSON.stringify(answers, null, 2) }`, verbose);
                    log('verbose', `Moving ${ answers.component }`, verbose);
                    moveExistingComponent(answers.component);
                });
            } else {
                console.warn(`No components found in library.`);
            }
        }
    } else if (action === 'new') {
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
                    { name: 'HTML', value: 'html' },
                    { name: 'Twig', value: 'twig' },
                    { name: 'Vue', value: 'vue' },
                ],
                validate: (answer) => {
                    return answer !== [];
                },
            },
        ];

        inquirer.prompt(questions).then(function (answers) {
            log('verbose', `Component Options: ${ JSON.stringify(answers, null, 2) }`, verbose);

            answers.templates.forEach((item) => {
                let config = answers;

                switch (item) {
                    case 'css':
                        config = Object.assign({
                            src: `${ paths.starter.templates }_components/new/HANDLE.scss`,
                            dist: `${ paths.components.src }${ answers.handle }/_${ answers.handle }.scss`,
                        }, config);
                        break;
                    case 'html':
                        config = Object.assign({
                            src: `${ paths.starter.templates }_components/new/HANDLE.html`,
                            dist: `${ paths.components.src }${ answers.handle }/${ answers.handle }.html`,
                        }, config);
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
                            dist: `${ paths.components.src }${ answers.handle }/${ answers.name.replace(' ', '') }.vue`,
                        }, config);
                        break;
                }

                moveFile(config);
            });
        });


        // BYE
        log('app', `End`);
    }
}












// FUNCTIONS
function moveExistingComponent(handle) {
    fs.moveSync(`${ paths.starter.templates }_components/library/${ handle }`, paths.components.src + handle, { overwrite: false })
}
function moveFile(config) {
    ejs.renderFile(config.src, config, {}, function(err, str) {
        fs.outputFile(config.dist, str, (err) => {
            if(!err){
                log('verbose', `Added : ${ config.dist }`, verbose);
            }
        });
    });
}




// LIBRARY FUNCTIONS
// todo: move these to an ES6 module for sharing with other library files
// synchronously crawls each file
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
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
            templates: process.cwd() + '/_starter/templates/',
            styleInventory: process.cwd() + '/_starter/style_inventory/',
        }
    }
}

// get version number based on build environment
function getVersion(version, env) {
    return env === 'production' ? version : null;
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
            console.log(chalk.green.bold('💻 ') + chalk.green(message));
            break;
        case 'title':
            console.log(chalk.blue.bold('🛠 ' + message));
            break;
        case 'verbose':
            if (verbose) {
                console.log(chalk.keyword('orange')('🕵 ' + message));
            }
            break;
        case 'warn':
            console.warn(chalk.red.bold('🚧 ' + message));
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