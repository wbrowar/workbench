// Import node modules
const _ = require('lodash'),
      chalk = require('chalk'),
      ejs = require('ejs'),
      fs = require('fs-extra'),
      glob = require('glob-all'),
      inquirer = require('inquirer'),
      os = require('os'),
      path = require('path');

// Import global functions
fs.copySync(`../../_starter/functions.js`, `./functions.js`)
const g = require('./functions.js');

// HELLO
g.log('app', `Installing WB-Starter Project`);

// Load package file
let pkg = require(`${ process.cwd() }/package.json`);

// Set constants
const argv = g.parseArgv();

// Use CLI arguments to set variables
const projectDirectory = argv.options['project-dir'] || '',
      verbose          = argv.options.verbose || false;
let   handle           = argv.options.handle || false,
      installerVersion = argv.options.version || '0';

// Set variables to be processed by EJS
let ejsVars = {
    nodeVersion: process.version,
    projectDir: projectDirectory,
    pkg: pkg,
    securityKey: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
};

// Set other variables
let enableInstall = false,
    localConfig   = false
    npmInstaller = 'npm';

// Check that new-wb and WB-Starter versions are compatible
const installerVersionJoined = installerVersion.split('.').join('');
const installerVersionString = installerVersionJoined.startsWith('0') ? installerVersionJoined.substr(1) : installerVersionJoined;
if (installerVersionString === pkg.requiredInstallerVersion) {
    enableInstall = true;
} else {
    g.log('warn', `Version of new-wb does not match WB-Starter installer version. Cancelling installation.\n`, verbose);
    g.log('message', 'Update new-wb then try again:\n  run `npm install -g new-wb`\n');
    process.exit();
}

// Check if npm and composer are installed
if (verbose) {
    g.log('warn', `Running install using --verbose will expose passwords in the terminal. Only share the output with people you trust with those secrets.`, verbose);
    g.log('verbose', `Getting new-wb installer version`, verbose);
    g.log('message', installerVersion, verbose);
    g.log('verbose', `Getting node version`, verbose);
    g.verboseExec(`node -v`, verbose);
    g.log('verbose', `Getting npm version`, verbose);
    g.verboseExec(`npm -v`, verbose);
    g.log('verbose', `Getting composer version`, verbose);
    g.verboseExec(`composer --version`, verbose);
}

// get local config file
g.log('verbose', `Looking for local configuration file in home directory: .wb-starter.config.json`, verbose);
if (fs.existsSync(`${ os.homedir() }/.wb-starter.config.json`)) {
    g.log('verbose', `wb-starter configuration file found`, verbose);

    localConfig = require(`${ os.homedir() }/.wb-starter.config.json`);
} else {
    g.log('verbose', `wb-starter configuration file not found`, verbose);
}

async function run() {
    g.log('title', `Configuring Project`);

    const questions = [
        {
            type: 'list',
            name: 'installEnd',
            message: 'What kind of project are you building?',
            choices: [
                { name: 'Front-end', value: 'front' },
                { name: 'Back-end', value: 'back' },
            ],
        },
        {
            type: 'list',
            name: 'projectType',
            message: (answers) => {
                return answers.installEnd === 'front' ? 'Front-end framework' : 'Back-end platform';
            },
            choices: (answers) => {
                return answers.installEnd === 'front' ? [
                    // { name: 'Gridsome', value: 'gridsome' },
                    { name: 'Nuxt', value: 'nuxt' },
                    // { name: 'Twig', value: 'twig' },
                    { name: 'Vue SPA', value: 'vue' },
                    { name: 'HTML (Tailwind, Webpack)', value: 'html' },
                    { name: 'Marketo Vue SPA', value: 'marketo-vue' },
                    // { name: 'Vite SPA', value: 'vite' },
                ] : [
                    { name: 'Craft 3', value: 'craft3' },
                    // { name: 'Craft Plugin', value: 'craftplugin' },
                ]
            },
        },
        {
            type: 'input',
            name: 'handle',
            message: 'Handle',
            default: () => {
                return argv.options.handle || '';
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
                const url = answers.handle.toLowerCase();
                return `http://${ url }.test/`;
            },
        },
        {
            type: 'confirm',
            name: 'setupDb',
            message: 'Setup Database?',
            default: (answers) => {
                return ['craft3'].includes(answers.projectType);
            },
            when: (answers) => {
                return answers.installEnd === 'back' && !['craftplugin'].includes(answers.projectType);
            },
        },
        {
            type: 'input',
            name: 'dbHost',
            message: 'Database Host',
            default: localConfig ? (localConfig.dbHost || '127.0.0.1') : '127.0.0.1',
            when: (answers) => {
                return answers.installEnd === 'back' && answers.setupDb;
            },
        },
        {
            type: 'input',
            name: 'dbUser',
            message: 'Database Username',
            default: localConfig ? (localConfig.dbUser || 'root') : 'root',
            when: (answers) => {
                return answers.installEnd === 'back' && answers.setupDb;
            },
        },
        {
            type: 'password',
            name: 'dbPass',
            message: 'Database Password',
            default: localConfig ? (localConfig.dbPass || '') : '',
            when: (answers) => {
                return answers.installEnd === 'back' && answers.setupDb;
            },
        },
        {
            type: 'input',
            name: 'dbPort',
            message: 'Database Port',
            default: localConfig ? (localConfig.dbPort || '') : '',
            when: (answers) => {
                return answers.installEnd === 'back' && answers.setupDb;
            },
        },
        {
            type: 'input',
            name: 'dbPrefix',
            message: 'Database Prefix',
            when: (answers) => {
                return answers.installEnd === 'back' && answers.setupDb;
            },
        },
        {
            type: 'input',
            name: 'cmsAdminEmail',
            message: 'CMS Admin Email Address',
            default: localConfig ? (localConfig.cmsAdminEmail || '') : '',
            when: (answers) => {
                return ['craft3'].includes(answers.projectType);
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'input',
            name: 'cmsAdminUsername',
            message: 'CMS Admin Username',
            default: localConfig ? (localConfig.cmsAdminUsername || 'admin') : 'admin',
            when: (answers) => {
                return ['craft3'].includes(answers.projectType);
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'password',
            name: 'cmsAdminPassword',
            message: 'CMS Admin Password',
            default: localConfig ? (localConfig.cmsAdminPassword || '') : '',
            when: (answers) => {
                return ['craft3'].includes(answers.projectType);
            },
            validate: (answer) => {
                return answer !== '';
            },
        },
        {
            type: 'input',
            name: 'cmsSiteName',
            message: 'Craft Site Name',
            default: 'My Site',
            when: (answers) => {
                return ['craft3'].includes(answers.projectType);
            },
            validate: (answer) => {
                return answer !== '';
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
            name: 'setupRepo',
            message: 'Setup GitHub repo?',
            default: false,
        },
        {
            type: 'input',
            name: 'gitRepo',
            message: 'Git Repo Name (machine readable)',
            default: (answers) => {
                return answers.handle.toLowerCase();
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
            choices: (answers) => {
                const componentDirectories = glob.sync(`${projectDirectory}/_starter/components/*/`);
                let componentOptions = [];
                componentDirectories.forEach((item) => {
                    const defaultComponents = [
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

                    // Add project specific component defaults
                    switch (answers.projectType) {
                        case 'html':
                            defaultComponents.splice(0,defaultComponents.length);
                            break;
                        case 'marketo-vue':
                            defaultComponents.push('marketo_form');
                            break;
                    }

                    const componentName = path.basename(item);
                    componentOptions.push({ checked: defaultComponents.includes(componentName), name: componentName, value: componentName });
                });

                return componentOptions;
            },
            when: (answers) => {
                return answers.installEnd === 'front';
            },
        },
        {
            type: 'list',
            name: 'npmInstaller',
            message: 'npm installer',
            default: localConfig ? (localConfig.npmInstaller || 'npm') : 'npm',
            choices: [
                { name: 'npm', value: 'npm' },
                { name: 'Yarn', value: 'yarn' },
            ],
            when: (answers) => {
                return !localConfig.npmInstaller && answers.installEnd === 'front';
            },
        },
        {
            type: 'confirm',
            name: 'saveConfig',
            message: 'Save these options to a config file (in your home folder)?',
            default: true,
            when: () => {
                return !localConfig;
            }
        },
    ];

    inquirer.prompt(questions).then(async (answers) => {
        g.log('verbose', `Answers:`, verbose);
        g.log('dump', answers, verbose);

        ejsVars['install'] = answers;
        ejsVars.appEnvPrefix = '';

        if (answers.handle) {
            handle = ejsVars.handle = answers.handle || '';
        }
        if (answers.npmInstaller) {
            npmInstaller = answers.npmInstaller;
        }

        // Assign install directories
        let installDirectories = [];

        if (answers.projectType) {
            switch (answers.projectType) {
                case 'craft3':
                    installDirectories = ['craft3'];
                    break;
                case 'craftplugin':
                    installDirectories = ['craft3'];
                    break;
                case 'gridsome':
                    ejsVars.appEnvPrefix = 'GRIDSOME_';
                    installDirectories = ['_front-end', 'gridsome'];
                    break;
                case 'html':
                    installDirectories = ['_front-end', 'html'];
                    break;
                case 'marketo-vue':
                    ejsVars.appEnvPrefix = 'VUE_APP_';
                    installDirectories = ['_front-end', 'vue-base', 'vue', 'marketo-vue'];
                    break;
                case 'nuxt':
                    ejsVars.appEnvPrefix = '';
                    installDirectories = ['_front-end', 'nuxt'];
                    break;
                case 'vue':
                    ejsVars.appEnvPrefix = 'VUE_APP_';
                    installDirectories = ['_front-end', 'vue-base', 'vue'];
                    break;
                case 'vite':
                    ejsVars.appEnvPrefix = 'VUE_APP_';
                    installDirectories = ['_front-end', 'vue-base', 'vite'];
                    break;
            }
        }

        if (answers.saveConfig) {
            g.log('title', `Saving Local Configuring File`);
            localConfig = {};

            if (['craft3'].includes(answers.projectType)) {
                localConfig['cpTrigger'] = answers.cpTrigger;
                localConfig['cmsAdminEmail'] = answers.cmsAdminEmail;
                localConfig['cmsAdminUsername'] = answers.cmsAdminUsername;
                localConfig['cmsAdminPassword'] = answers.cmsAdminPassword;
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
            localConfig['npmInstaller'] = npmInstaller;

            fs.outputFileSync(`${ os.homedir() }/.wb-starter.config.json`, JSON.stringify(localConfig, null, 2));

            g.log('title', `Saved Local Configuring File`);
            g.log('dump', localConfig, verbose);
        }

        if (answers.setupDb) {
            g.log('title', 'Creating Database');
            g.verboseExec(`mysql --user="${ answers.dbUser }" --password="${ answers.dbPass }" -e 'CREATE DATABASE IF NOT EXISTS ${ '`' + handle + '`' } CHARACTER SET utf8 COLLATE utf8_general_ci'`, verbose);
            g.log('verbose', `Created mysql database: '${ handle }'`, verbose);
        }

        g.log('title', 'Updating package.json values with dynamic data', verbose);
        pkg = _.merge(pkg, {
            scripts: {
                update: npmInstaller + ' install',
            },
            name: handle,
            version: '1.0.0',
        });

        // Install
        if (installDirectories[0]) {
            const installDir0 = g.asyncFunction(
              `Installing directory: ${installDirectories[0]}`, `Directory: ${installDirectories[0]} installed`, (resolve) => {
                  installDirectory(installDirectories[0], resolve);
              });
            let installDir0Complete = await installDir0;
        }
        if (installDirectories[1]) {
            const installDir1 = g.asyncFunction(
              `Installing directory: ${installDirectories[1]}`, `Directory: ${installDirectories[1]} installed`, (resolve) => {
                  installDirectory(installDirectories[1], resolve);
              });
            let installDir1Complete = await installDir1;
        }
        if (installDirectories[2]) {
            const installDir2 = g.asyncFunction(
              `Installing directory: ${installDirectories[2]}`, `Directory: ${installDirectories[2]} installed`, (resolve) => {
                  installDirectory(installDirectories[2], resolve);
              });
            let installDir2Complete = await installDir2;
        }


        // Change working directory to project folder
        try {
            process.chdir(projectDirectory);
            g.log('verbose', `Changed working directory to project folder`, verbose);
        }
        catch (err) {
            g.log('warn', err, verbose);
            process.exit();
        }


        g.log('verbose', `Updating package.json file`, verbose);
        const pkgWithoutDependencies = _.omit(pkg, ['dependencies', 'devDependencies']);
        const pkgWithDependenciesAtTheEnd = _.merge(pkgWithoutDependencies, {
            dependencies: pkg.dependencies,
            devDependencies: pkg.devDependencies,
        });
        fs.outputFileSync(`${ process.cwd() }/package.json`, JSON.stringify(pkgWithDependenciesAtTheEnd, null, 2));
        g.log('verbose', `package.json file updated:`, verbose);
        g.log('dump', pkg, verbose);

        const removeGitkeep = g.asyncFunction(
            `Removing Default .gitkeep Files`, `Default .gitkeep Files Removed`, (resolve) => {
                globRemove(`${ process.cwd() }/_source/**/.gitkeep`, resolve);
            });
        let removeGitkeepComplete = await removeGitkeep;

        if (fs.existsSync(`${ process.cwd() }/INSTALL.env`)) {
            fs.moveSync(`${ process.cwd() }/INSTALL.env`, `${ process.cwd() }/.env`);
        }

        g.log('title', 'Running project specific install scripts', verbose);
        if (['craft3'].includes(answers.projectType)) {
            g.verboseExec(`mv ./craft ./craft`, verbose);
            g.log('verbose', `Craft files moved`, verbose);

            g.log('title', 'Setting Up Craft Scripts');
            g.verboseExec(`mv scripts/craft3-example.env.sh scripts/.env.sh`, verbose);
            g.log('verbose', `.env.sh created from example`, verbose);

            g.log('title', 'Running Composer Install');
            g.verboseExec(`composer install --ignore-platform-reqs`, verbose);
            g.log('verbose', `Composer updated`, verbose);

            g.log('title', 'Installing Craft');
            g.verboseExec(`./craft install --interactive=0 --email="${ answers.cmsAdminEmail }" --username="${ answers.cmsAdminUsername }" --password="${ answers.cmsAdminPassword }" --siteName="${ answers.cmsSiteName }" --siteUrl="$DEFAULT_SITE_URL" --language="en"`, verbose);
            g.log('verbose', `Craft 3 installed`, verbose);

            g.log('title', 'Applying Project Config Settings');
            if (fs.existsSync(`config/default.project.yaml`)) {
                if (fs.existsSync(`config/project.yaml`)) {
                    g.verboseExec(`rm config/project.yaml`, verbose);
                    g.log('verbose', `Deleted project config generated from install`, verbose);
                }
                g.verboseExec(`mv config/default.project.yaml config/project.yaml`, verbose);
                g.log('verbose', `Renamed default project config to project.yaml`, verbose);
            }
            try {
                g.verboseExec(`./craft project-config/sync`, verbose);
                g.log('verbose', `Project Config synced`, verbose);
            } catch {
                g.verboseExec(`./craft project-config/sync`, verbose); // Running again to fix minify issue
                g.log('verbose', `Project Config synced`, verbose);
            }
            g.verboseExec(`./craft update all --backup`, verbose);
            g.log('verbose', `Craft and plugins updated`, verbose);
        }

        if (answers.installEnd === 'front') {
            g.log('title', 'Updating NPM packages', verbose);
            g.verboseExec(npmInstaller + ` install`, verbose);
            g.log('verbose', `NPM Packages updated`, verbose);

            g.log('title', 'Moving selected components', verbose);
            answers.components.forEach((item) => {
                if (!item.startsWith('@')) {
                    g.verboseExec(`node ${projectDirectory}/_starter/component.js --mv='${ item }'${ verbose ? ' --verbose' : '' }`, verbose);
                }
            });
        } else if (answers.installEnd === 'back') {
            g.verboseExec(`rm -f package.json`, verbose);
            g.verboseExec(`rm -f package-lock.json`, verbose);
            g.verboseExec(`rm -rf node_modules`, verbose);
            g.log('verbose', `Removed node_modules and package.json`, verbose);
        }

        g.log('title', `Cleaning Up`);
        g.verboseExec(`rm -rf ${ process.cwd() }/SETUP`, verbose);
        g.log('verbose', `Install directory deleted`, verbose);

        // if (answers.installEnd === 'front') {
        //     g.log('title', 'Running Initial Build Script', verbose);
        //     g.verboseExec(`npm run dev`, true);
        //     g.log('verbose', `WB Starter development script ran (npm run dev)`, verbose);
        // }

        if (answers.setupRepo) {
            g.log('title', 'Setting up GitHub repo');
            const gitHubEndPoint = answers.gitOrg || false ? `https://api.github.com/orgs/${answers.gitOrg}/repos` : `https://api.github.com/user/repos`;

            g.verboseExec(`curl -X POST -u ${ answers.gitUser }:${ answers.gitPass } -H "Content-Type: application/json" -d '{ "name": "${ answers.gitRepo }", "private": ${ answers.gitPrivate ? "true" : "false" } }' ${gitHubEndPoint}`, verbose);
            g.log('verbose', `Created ${ answers.gitOrg ? answers.gitOrg : answers.gitUser }/${ handle } repo on GitHub`, verbose);
            g.verboseExec(`git init`, verbose);
            g.log('verbose', `Ran git init`, verbose);
            g.verboseExec(`git remote add origin https://github.com/${ answers.gitOrg ? answers.gitOrg : answers.gitUser }/${ handle }.git`, verbose);
            g.log('verbose', `Set remote origin, verbose`, verbose);
            g.verboseExec(`git add -A`, verbose);
            g.log('verbose', `Added all files`, verbose);
            g.verboseExec(`git add -f .gitignore`, verbose);
            g.log('verbose', `Added .gitignore file`, verbose);
            g.verboseExec(`git commit -m "initial commit"`, verbose);
            g.log('verbose', `Created first commit`, verbose);
            g.verboseExec(`git push --set-upstream origin master`, verbose);
            g.log('verbose', `Pushed first commit to GitHub`, verbose);
        } else {
            g.log('verbose', `Skipped repo step`, verbose);
        }

        g.log('app', `WB-Starter Project Installed`);
        g.log('app', `Run: cd ${ handle }`);
        g.log('app', `     npm run dev`);

        g.log('message', chalk.dim(`\n${_bye()}\n`));
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
                        g.log('warn', err);
                    }
                    fs.outputFile(item.replace(replaceSrc, replaceDist), str, (err) => {
                        if(!err) {
                            g.log('verbose', `Compiled ${ item } → ${ item.replace(replaceSrc, replaceDist) }`, verbose);
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
                    g.log('verbose', `Moved ${ item } → ${ item.replace(replaceSrc, replaceDist) }`, verbose);
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
                    g.log('verbose', `Removed ✄ ${ item }`, verbose);
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

async function installDirectory(name, finished) {
    const projectTypeInstallDirectory = `${projectDirectory}/SETUP/_install/_scaffolding/${ name }`;

    mergeIntoPkg(`${ projectTypeInstallDirectory }/setup/package.json`);

    g.log('verbose', `Looking for templates to move at ${projectTypeInstallDirectory}`, verbose);
    if (fs.existsSync(`${ projectTypeInstallDirectory }/mv`)) {
        const moveInstallFiles = g.asyncFunction(
          `Moving Default Files`, `Default Files Moved`, (resolve) => {
              globMove(`${projectTypeInstallDirectory}/mv/**/*`, `${projectTypeInstallDirectory}/mv/`, `${projectDirectory}/`, resolve);
          });
        let moveInstallFilesComplete = await moveInstallFiles;
    } else {
        g.log('verbose', `No project templates to move`, verbose);
    }

    g.log('verbose', `Looking for EJS templates to compile at ${projectTypeInstallDirectory}`, verbose);
    if (fs.existsSync(`${ projectTypeInstallDirectory }/ejs`)) {
        const compileInstallFiles = g.asyncFunction(
          `Compiling Default Templates`, `Default Templates Compiled`, (resolve) => {
              globEjs(`${projectTypeInstallDirectory}/ejs/**/*`, `${projectTypeInstallDirectory}/ejs/`, `${projectDirectory}/`, resolve);
          });
        let compileInstallFilesComplete = await compileInstallFiles;
    } else {
        g.log('verbose', `No project templates to compile`, verbose);
    }

    finished();
}

function mergeIntoPkg(pkgFile) {
    if (fs.existsSync(pkgFile)) {
        g.log('verbose', `Merging new package info from: ${ pkgFile }`, verbose);

        const newPkgInfo = require(pkgFile);
        pkg = _.merge(pkg, newPkgInfo);

        g.log('verbose', `Merged new package info:`, verbose);
        g.log('dump', newPkgInfo, verbose);
    } else {
        g.log('verbose', `Package JSON not found at: ${ pkgFile }`, verbose);
    }
}

function randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function _bye() {
    const lines = [
        `Coming soon`,
    ]
    return lines[Math.floor(Math.random()*lines.length)];
}

// INIT
if (enableInstall) {
    run();
}
