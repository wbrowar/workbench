// import node modules
const chalk = require('chalk'),
      ejs = require('ejs'),
      exec = require('child_process'),
      fs = require('fs-extra'),
      glob = require('glob-all'),
      inquirer = require('inquirer'),
      notifier = require('node-notifier'),
      path = require('path'),
      os = require('os');

if (!fs.existsSync(`${ process.cwd() }/_starter/install`)) {
    log('warn', `Install Has Already Completed and Cannot Be Run Again`);
    process.exit();
}

// HELLO
console.log(`Installing WB-Starter`);

// load package file
let pkg = require(`${ process.cwd() }/package.json`);

// set constants
const argv = parseArgv();

// use CLI arguments to set variables
const verbose = argv.options.verbose || false;
let   handle  = argv.options.handle || false;

// set variables to be processed by EJS
let ejsVars = {
    handle: handle ? handle : '',
    projectDir: process.cwd(),
    pkg: pkg,
    securityKey: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
};

// set other variables
let localConfig = false;

// check if npm and composer are installed
if (verbose) {
    log('verbose', `getting composer version`);
    verboseExec(`composer --version`);
    log('verbose', `getting npm version`);
    verboseExec(`npm -v`);
}

// get local config file
log('verbose', `Looking for local configuration file in home directory: .wb-starter.config.json`, verbose);
if (fs.existsSync(`${ os.homedir() }/.wb-starter.config.json`)) {
    log('verbose', `wb-starter configuration file found`, verbose);

    localConfig = require(`${ os.homedir() }/.wb-starter.config.json`);
} else {
    log('verbose', `wb-starter configuration file not found`, verbose);
}

async function run() {
    log('title', `Configuring Project`);

    const componentDirectories = glob.sync(`./_starter/components/*/`);

    let componentOptions = [];
    componentDirectories.forEach((item) => {
        const defaultComponents = [
            'animate',
            'button',
            'buttons',
            'grid',
            'header',
            'image',
            'image_bg',
            'text',
            'wrapper',
        ];
        const componentName = path.basename(item);
        componentOptions.push({ checked: defaultComponents.includes(componentName), name: componentName, value: componentName });
    });

    const questions = [
        {
            type: 'list',
            name: 'projectType',
            message: 'What kind of project are you building?',
            choices: [
                { name: 'Craft 3', value: 'craft3' },
                { name: 'HTML', value: 'html' },
                { name: 'Craft Plugin', value: 'craftplugin' },
            ],
        },
        {
            type: 'input',
            name: 'handle',
            message: 'Handle',
            default: 'my-plugin',
            default: () => {
                return handle || false;
            },
            when: (answers) => {
                return ['craftplugin'].includes(answers.projectType);
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'input',
            name: 'clientCode',
            message: 'Client code',
            default: 'wb',
            when: (answers) => {
                return !answers.handle;
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name (machine readable)',
            default: 'test',
            when: (answers) => {
                return !answers.handle;
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'input',
            name: 'localUrl',
            message: 'Local Dev URL',
            default: (answers) => {
                const url = answers.handle || answers.clientCode.toLowerCase() + '-' + answers.projectName.toLowerCase();
                return `http://${ url }.test/`;
            },
        },
        {
            type: 'input',
            name: 'cpTrigger',
            message: 'CP Trigger (path to Craft CP)',
            default: localConfig ? (localConfig.cpTrigger || 'admin') : 'admin',
            when: (answers) => {
                return ['craft3'].includes(answers.projectType);
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'confirm',
            name: 'setupDb',
            message: 'Setup Database?',
            when: (answers) => {
                return !['craftplugin'].includes(answers.projectType);
            },
        },
        {
            type: 'input',
            name: 'dbHost',
            message: 'Database Host',
            default: localConfig ? (localConfig.dbHost || '127.0.0.1') : '127.0.0.1',
            when: (answers) => {
                return answers.setupDb;
            },
        },
        {
            type: 'input',
            name: 'dbUser',
            message: 'Database Username',
            default: localConfig ? (localConfig.dbUser || 'root') : 'root',
            when: (answers) => {
                return answers.setupDb;
            },
        },
        {
            type: 'password',
            name: 'dbPass',
            message: 'Database Password',
            default: localConfig ? (localConfig.dbPass || '') : '',
            when: (answers) => {
                return answers.setupDb;
            },
        },
        {
            type: 'input',
            name: 'dbPort',
            message: 'Database Port',
            default: localConfig ? (localConfig.dbPort || '') : '',
            when: (answers) => {
                return answers.setupDb;
            },
        },
        {
            type: 'input',
            name: 'dbPrefix',
            message: 'Database Prefix',
            default: (answers) => {
                const defaultPrefix = ['craft3'].includes(answers.projectType) ? 'craft' : '';
                return localConfig ? (localConfig.dbPrefix || defaultPrefix) : defaultPrefix;
            },
            when: (answers) => {
                return answers.setupDb;
            },
        },
        {
            type: 'confirm',
            name: 'setupRepo',
            message: 'Setup GitHub repo?',
        },
        {
            type: 'input',
            name: 'gitRepo',
            message: 'Local Dev URL',
            default: (answers) => {
                return answers.handle || answers.clientCode.toLowerCase() + '-' + answers.projectName.toLowerCase();
            },
            when: (answers) => {
                return answers.setupRepo;
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'input',
            name: 'gitUser',
            message: 'GitHub username (not your email)',
            default: localConfig ? (localConfig.gitUser || '') : '',
            when: (answers) => {
                return answers.setupRepo;
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'password',
            name: 'gitPass',
            message: 'GitHub password',
            when: (answers) => {
                return answers.setupRepo;
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'input',
            name: 'gitOrg',
            message: 'GitHub organization\n  (if blank, repo will be created for user)',
            default: localConfig ? (localConfig.gitOrg || '') : '',
            when: (answers) => {
                return answers.setupRepo;
            }
        },
        {
            type: 'confirm',
            name: 'gitPrivate',
            message: 'Private repo?',
            default: true,
            when: (answers) => {
                return answers.setupRepo;
            }
        },
        {
            type: 'checkbox',
            name: 'components',
            message: 'Select the components you would like to use by default?',
            choices: componentOptions,
        },
        {
            type: 'confirm',
            name: 'saveConfig',
            message: 'Save these options to a local config file?',
            default: true,
            when: () => {
                return !localConfig;
            }
        },
    ];

    inquirer.prompt(questions).then(async (answers) => {
        log('verbose', `Answers:`, verbose);
        log('dump', answers, verbose);

        ejsVars['install'] = answers;

        if (answers.handle) {
            handle = ejsVars.handle = answers.handle;
        } else if (answers.clientCode && answers.projectName) {
            handle = ejsVars.handle = answers.clientCode.toLowerCase() + '-' + answers.projectName.toLowerCase();
        }

        const projectTypeInstallDirectory = `${ process.cwd() }/_starter/install/${ answers.projectType }/`,
              installConfig = fs.existsSync(`${ projectTypeInstallDirectory }config/install.config.json`) ? require(`${ projectTypeInstallDirectory }config/install.config.json`) : {};

        if (answers.saveConfig) {
            log('title', `Saving Local Configuring File`);
            localConfig = {};

            if (['craft3'].includes(answers.projectType)) {
                localConfig['cpTrigger'] = answers.cpTrigger;
            }
            if (answers.setupDb) {
                localConfig['dbHost'] = answers.dbHost;
                localConfig['dbUser'] = answers.dbUser;
                localConfig['dbPort'] = answers.dbPort;
            }
            if (answers.setupRepo) {
                localConfig['gitUser'] = answers.gitUser;
                localConfig['gitOrg'] = answers.gitOrg;
                localConfig['gitPrivate'] = answers.gitPrivate;
            }

            fs.outputFileSync(`${ os.homedir() }/.wb-starter.config.json`, JSON.stringify(localConfig, null, 2));

            log('title', `Saved Local Configuring File`);
            log('dump', localConfig, verbose);
        }

        if (answers.setupDb) {
            log('title', 'Creating Database');
            verboseExec(`mysql --user="${ answers.dbUser }" --password="${ answers.dbPass }" -e 'CREATE DATABASE IF NOT EXISTS ${ '`' + handle + '`' } CHARACTER SET utf8 COLLATE utf8_general_ci'`, verbose);
            log('verbose', `Created mysql database: '${ handle }'`, verbose);
        }

        const removeGitkeep = asyncFunction(
            `Removing Default .gitkeep Files`, `Default .gitkeep Files Removed`, (resolve) => {
                globRemove(`${ process.cwd() }/_source/**/.gitkeep`, resolve);
            });
        let removeGitkeepComplete = await removeGitkeep;

        if (['craft3'].includes(answers.projectType)) {
            log('title', 'Installing Craft');
            verboseExec(`composer create-project -s RC craftcms/craft CRAFT_DOWNLOAD --ignore-platform-reqs`, verbose);
            log('verbose', `Craft 3 downloaded via composer`, verbose);
            verboseExec(`rm -r ${ process.cwd() }/CRAFT_DOWNLOAD/composer.lock`, verbose);
            log('verbose', `Craft 3 download directory removed`, verbose);
            verboseExec(`mv ./CRAFT_DOWNLOAD/* ./`, verbose);
            log('verbose', `Craft 3 files moved to cwd`, verbose);
            verboseExec(`rm -r ${ process.cwd() }/CRAFT_DOWNLOAD`, verbose);
            log('verbose', `Craft 3 download directory removed`, verbose);
        }

        const moveAllInstallFiles = asyncFunction(
            `Moving Default Files`, `Default Files Moved`, (resolve) => {
                globMove(`${ process.cwd() }/_starter/install/all/mv/**/*`, `_starter/install/all/mv/`, ``, resolve);
            });
        let moveAllInstallFilesComplete = await moveAllInstallFiles;

        const compileAllInstallFiles = asyncFunction(
            `Compiling Default Templates`, `Default Templates Compiled`, (resolve) => {
                globEjs(`${ process.cwd() }/_starter/install/all/ejs/**/*`, `_starter/install/all/ejs/`, ``, resolve);
            });
        let compileAllInstallFilesComplete = await compileAllInstallFiles;

        if (fs.existsSync(`${ projectTypeInstallDirectory }ejs`)) {
            const compileProjectInstallFiles = asyncFunction(
                `Compiling Project Templates`, `Project Templates Compiled`, (resolve) => {
                    globEjs(`${ projectTypeInstallDirectory }ejs/**/*`, `_starter/install/${ answers.projectType }/ejs/`, ``, resolve);
                });
            let compileProjectInstallFilesComplete = await compileProjectInstallFiles;
        } else {
            log('verbose', `No project templates to compile`, verbose);
        }

        if (fs.existsSync(`${ projectTypeInstallDirectory }mv`)) {
            const compileProjectInstallFiles = asyncFunction(
                `Moving Project Templates`, `Project Templates Moved`, (resolve) => {
                    globMove(`${ projectTypeInstallDirectory }mv/**/*`, `_starter/install/${ answers.projectType }/mv/`, ``, resolve);
                });
            let compileProjectInstallFilesComplete = await compileProjectInstallFiles;
        } else {
            log('verbose', `No project templates to move`, verbose);
        }

        answers.components.forEach((item) => {
            verboseExec(`node ./_starter/component.js --mv='${ item }'${ verbose ? ' --verbose' : '' }`, verbose);
        });

        if (['craft3'].includes(answers.projectType)) {
            log('title', 'Setting Up Craft Scripts');
            verboseExec(`mv example.env .env`, verbose);
            log('verbose', `.env created from example`, verbose);
            verboseExec(`mv scripts/craft3-example.env.sh scripts/.env.sh`, verbose);
            log('verbose', `.env.sh created from example`, verbose);

            log('title', 'Running Composer Update');
            verboseExec(`composer update --ignore-platform-reqs`, verbose);
            log('verbose', `Composer updated`, verbose);

            log('title', 'Installing Craft');
            exec.spawnSync(`./craft setup`, [], { stdio: 'inherit', shell: true });
            log('verbose', `Craft 3 installer ran`, verbose);

            log('title', 'Installing Craft Plugins');
            installConfig.plugins.install.forEach((item) => {
                verboseExec(`./craft install/plugin ${ item }`, verbose);
                log('verbose', `installed ${ item } plugin`, verbose);
            });
        }

        log('title', 'Changing package.json Defaults', verbose);
        pkg.version = '1.0.0';
        pkg.browserSync.url = answers.localUrl;
        pkg.paths.base.siteUrl = answers.localUrl;

        if (answers.projectType === 'craft3') {
            pkg.paths.css.dist = `web/css/`;
            pkg.paths.favicon.dist = `web/favicon/`;
            pkg.paths.icon.dist = `web/icon/`;
            pkg.paths.img.dist = `web/img/`;
            pkg.paths.js.dist = `web/js/`;
            pkg.paths.templates.dist = `templates/`;
            pkg.styleInventory.urlSuffix = '';
            pkg.projectTemplateLanguage = 'twig';
            pkg.projectType = 'craft3';
        } else if (answers.projectType === 'html') {
            pkg.projectTemplateLanguage = 'ejs';
            pkg.projectType = 'html';
        } else if (answers.projectType === 'craftplugin') {
            pkg.paths.base.dist = 'development/';
            pkg.paths.base.release = 'release/';
            pkg.paths.css.dist = `src/assetbundles/${ handle }/dist⁩/css/`;
            pkg.paths.icon.dist = `src/assetbundles/${ handle }/dist⁩/icon/`;
            pkg.paths.img.dist = `src/assetbundles/${ handle }/dist⁩/img/`;
            pkg.paths.js.dist = `src/assetbundles/${ handle }/dist⁩/js/`;
            pkg.paths.templates.dist = `src/templates/`;
            pkg.postcss = [];
            pkg.projectTemplateLanguage = 'twig';
            pkg.projectType = 'craftplugin';
            pkg.styleInventory.enabled = false;
        }

        const editPkgComponents = asyncFunction(
            `Adding Selected Components to package.json`, `Selected Components Added`, (resolve) => {
                let selectedComponents = answers.components;
                const defaults = glob.sync(`${ process.cwd() }/_starter/style_inventory/defaults/*`);
                defaults.forEach((item) => {
                    selectedComponents.push(`@${ path.basename(item, path.extname(item)) }`);
                });
                Object.keys(pkg.styleInventory['pages']).forEach((key) => {
                    const filteredComponents = pkg.styleInventory['pages'][key].components.filter(component => selectedComponents.includes(component));
                    if (filteredComponents.length > 0) {
                        pkg.styleInventory['pages'][key].components = filteredComponents;
                    } else {
                        delete pkg.styleInventory['pages'][key];
                    }
                });
                resolve();
            });
        let editPkgComponentsComplete = await editPkgComponents;

        log('title', `Filtering NPM Scripts in package.json`);
        if (['craft3'].includes(answers.projectType)) {
            pkg.scripts['cssd'] = './vendor/nystudio107/craft-scripts/scripts/backup_assets.sh && ./vendor/nystudio107/craft-scripts/scripts/backup_db.sh && ./vendor/nystudio107/craft-scripts/scripts/pull_assets.sh && ./vendor/nystudio107/craft-scripts/scripts/pull_db.sh && ./vendor/nystudio107/craft-scripts/scripts/clear_caches.sh';
            pkg.scripts['cssdb'] = './vendor/nystudio107/craft-scripts/scripts/backup_db.sh && ./vendor/nystudio107/craft-scripts/scripts/pull_db.sh && ./vendor/nystudio107/craft-scripts/scripts/clear_caches.sh';
            pkg.scripts['update'] = 'git pull && npm run update && npm run cssd && npm run watch';
            pkg.scripts['update'] = 'npm update && composer update';
        }

        fs.outputFileSync(`${ process.cwd() }/package.json`, JSON.stringify(pkg, null, 2));
        log('verbose', `package.json updated:`, verbose);
        log('dump', pkg, verbose);

        log('title', 'Running Initial Build Script', verbose);
        verboseExec(`npm run dev${ verbose ? ' --verbose' : '' }`, verbose);
        log('verbose', `WB Starter development script ran (npm run dev)`, verbose);

        if (answers.setupRepo) {
            log('title', 'Setting up GitHub repo');
            const gitHubEndPoint = answers.gitOrg || false ? `https://api.github.com/orgs/${answers.gitOrg}/repos` : `https://api.github.com/user/repos`;

            verboseExec(`curl -X POST -u ${ answers.gitUser }:${ answers.gitPass } -H "Content-Type: application/json" -d '{ "name": "${ answers.gitRepo }", "private": ${ answers.gitPrivate ? "true" : "false" } }' ${gitHubEndPoint}`, verbose);
            log('verbose', `Created ${ answers.gitOrg ? answers.gitOrg : answers.gitUser }/${ handle } repo on GitHub`, verbose);
            verboseExec(`git init`, verbose);
            log('verbose', `ran git init`, verbose);
            verboseExec(`git remote add origin https://github.com/${ answers.gitOrg ? answers.gitOrg : answers.gitUser }/${ handle }.git`, verbose);
            log('verbose', `set remote origin, verbose`, verbose);
            verboseExec(`git add -A`, verbose);
            log('verbose', `added all files`, verbose);
            verboseExec(`git add -f .gitignore`, verbose);
            log('verbose', `added .gitignore file`, verbose);
            verboseExec(`git commit -m "initial commit"`, verbose);
            log('verbose', `created first commit`, verbose);
            verboseExec(`git push --set-upstream origin master`, verbose);
            log('verbose', `pushed first commit to GitHub`, verbose);
        }

        log('title', `Cleaning Up`);
        verboseExec(`rm -r ${ process.cwd() }/_starter/install`, verbose);
        log('verbose', `Install directory deleted`, verbose);
    });
}




// CUSTOM FUNCTIONS
function globEjs(pattern, replaceSrc, replaceDist, resolve) {
    glob(pattern, { dot:true, nodir: true }, function (er, files) {
        let count = files.length;
        if (count > 0) {
            files.forEach((item) => {
                ejs.renderFile(item, ejsVars, {}, function(err, str) {
                    if (err) {
                        log('warn', err);
                    }
                    fs.outputFile(item.replace(replaceSrc, replaceDist), str, (err) => {
                        if(!err) {
                            log('verbose', `Compiled ${ item } → ${ item.replace(replaceSrc, replaceDist) }`, verbose);
                            count--;
                            if (count === 0) {
                                resolve();
                            }
                        }
                    });
                });
            });
        } else {
            resolve();
        }
    });
}

function globMove(pattern, replaceSrc, replaceDist, resolve) {
    glob(pattern, { dot:true, nodir: true }, function (er, files) {
        let count = files.length;
        if (count > 0) {
            files.forEach((item) => {
                fs.move(item, item.replace(replaceSrc, replaceDist), { overwrite: true }).then(() => {
                    log('verbose', `Moved ${ item } → ${ item.replace(replaceSrc, replaceDist) }`, verbose);
                    count--;
                    if (count === 0) {
                        resolve();
                    }
                });
            });
        } else {
            resolve();
        }
    });
}

function globRemove(pattern, resolve) {
    glob(pattern, { dot:true, nodir: true }, function (er, files) {
        let count = files.length;
        if (count > 0) {
            files.forEach((item) => {
                fs.remove(item).then(() => {
                    log('verbose', `Removed ✄ ${ item }`, verbose);
                    count--;
                    if (count === 0) {
                        resolve();
                    }
                });
            });
        } else {
            resolve();
        }
    });
}

function randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
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
        .replace(/\s+/g, '_')           // Replace spaces with _
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '_')         // Replace multiple - with single _
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