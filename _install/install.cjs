// Import node modules
const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs-extra');
const glob = require('glob-all');
const inquirer = require('inquirer');
const os = require('os');
const path = require('path');

// Import global functions
let g;
fs.copySync(`../_scaffolding/_front-end/mv/front-end/_wb/functions.mjs`, `./functions.mjs`);

// Load package file
let pkg = require(`${ process.cwd() }/package.json`);

// Use CLI arguments to set variables
let ejsVars;
let handle;
let installerVersion;
let projectDirectory;
let scaffoldingDirectory;
let verbose;

// Set other variables
const ddevInstalled = fs.existsSync(`${projectDirectory}/.ddev`);
const backEndInstalled = fs.existsSync(`${projectDirectory}/back-end/`);
const frontEndInstalled = fs.existsSync(`${projectDirectory}/front-end/`);
let enableInstall = false;
let localConfig   = false;

async function run() {
    g = await import('./functions.mjs');

    // Set constants
    const argv = g.parseArgv();

    // Use CLI arguments to set variables
    projectDirectory     = argv.options['project-dir'] || '';
    scaffoldingDirectory = `${projectDirectory}/SETUP/_install/_scaffolding`;
    handle               = argv.options.handle || false;
    installerVersion     = argv.options.version || '0';
    verbose              = argv.options.verbose || false;

    // Set variables to be processed by EJS
    ejsVars = {
        securityKey: g.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    };

    // Check that new-wb and Workbench versions are compatible
    const installerVersionJoined = installerVersion.split('.').join('');
    const installerVersionString = installerVersionJoined.startsWith('0') ? installerVersionJoined.substr(1) : installerVersionJoined;
    if (installerVersionString === pkg.requiredInstallerVersion) {
        enableInstall = true;
    } else {
        g.log('warn', `Version of new-wb does not match Workbench installer version. Cancelling installation.\n`, verbose);
        g.log('message', 'Update new-wb then try again:\n  run `npm install -g new-wb`\n');
        process.exit();
    }

    if (enableInstall) {
        // HELLO
        g.log('app', `Installing Workbench Project`);

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
        g.log('verbose', `Looking for local configuration file in home directory: .workbench.config.json`, verbose);
        if (fs.existsSync(`${ os.homedir() }/.workbench.config.json`)) {
            g.log('verbose', `workbench configuration file found`, verbose);

            localConfig = require(`${ os.homedir() }/.workbench.config.json`);
        } else {
            g.log('verbose', `workbench configuration file not found`, verbose);
        }

        g.log('title', `Configuring Project`);

        const questions = [
            {
                type: 'list',
                name: 'installEnd',
                message: 'What kind of project are you building?',
                choices: [
                    { name: 'Front-end', value: 'front' },
                    { name: 'Back-end', value: 'back' },
                    { name: 'Both', value: 'back_front' },
                ],
            },
            {
                type: 'list',
                name: 'frontEndFramework',
                message: 'Front-end Framework',
                when: (answers) => {
                    return ['front', 'back_front'].includes(answers.installEnd);
                },
                choices: [
                    { name: 'Vue SPA', value: 'vue3' },
                    { name: 'Nuxt', value: 'nuxt2' },
                    { name: 'HTML (Tailwind, Webpack)', value: 'html' },
                    { name: 'Marketo Vue SPA', value: 'vue3-marketo' },
                ],
            },
            {
                type: 'list',
                name: 'backEndPlatform',
                message: 'Back-end Platform',
                when: (answers) => {
                    return ['back', 'back_front'].includes(answers.installEnd);
                },
                choices: [
                    { name: 'Craft 3', value: 'craft3' },
                ],
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
                message: 'Set Up GitHub repo?',
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
                default: localConfig ? (localConfig.gitPrivate || true) : true,
                when: (answers) => {
                    return answers.setupRepo;
                }
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

            // Assign install directories
            const installDirectories = [];
            let installEjs = [];
            let installMv = [];

            // If .ddev doesn’t exist, assume it’s a fresh install and include .ddev files
            if (!ddevInstalled) {
                installDirectories.push('_root');
            }

            if (answers.backEndPlatform) {
                switch (answers.backEndPlatform) {
                    case 'craft3':
                        installDirectories.push('craft3');
                        break;
                }
            }
            if (answers.frontEndFramework) {
                switch (answers.frontEndFramework) {
                    case 'html':
                        installDirectories.push('html');
                        break;
                    case 'vue3-marketo':
                        ejsVars.appEnvPrefix = 'VUE_APP_';
                        installDirectories.push('vue3', 'vue3-marketo');
                        break;
                    case 'nuxt2':
                        ejsVars.appEnvPrefix = '';
                        installDirectories.push('nuxt2');
                        break;
                    case 'vue3':
                        ejsVars.appEnvPrefix = 'VITE_';
                        installDirectories.push('_front-end', 'vue3');
                        // installMv = [
                        //     { pattern: `${ scaffoldingDirectory }/_front-end/mv/.prettierrc`, src: `${ scaffoldingDirectory }/_front-end/mv/`, dist: `${projectDirectory}/` },
                        //     { pattern: `${ scaffoldingDirectory }/vue3/mv/**/*`, src: `${ scaffoldingDirectory }/vue3/mv/`, dist: `${projectDirectory}/` },
                        // ];
                        break;
                }
            }

            if (answers.installEnd === 'back_front') {
                installDirectories.push('_back-end_front-end');
            }

            if (answers.saveConfig) {
                const saveConfig = g.asyncFunction(
                  `Saving Local Config`, `Local Config Saved`, (resolve) => {
                      saveLocalConfig(answers, resolve);
                  });
                let saveConfigComplete = await saveConfig;
            }

            if (answers.setupDb) {
                g.log('title', 'Creating Database');
                g.verboseExec(`mysql --user="${ answers.dbUser }" --password="${ answers.dbPass }" -e 'CREATE DATABASE IF NOT EXISTS ${ '`' + handle + '`' } CHARACTER SET utf8 COLLATE utf8_general_ci'`, verbose);
                g.log('verbose', `Created mysql database: '${ handle }'`, verbose);
            }

            g.log('title', 'Updating package.json values with dynamic data', verbose);
            pkg = _.merge(pkg, {
                name: handle,
                version: '1.0.0',
            });

            // Move files from glob patterns
            if (installMv.length) {
                const installMvFunc = g.asyncFunction(
                  `Moving project files`, `Project files moved`, (resolve) => {
                      g.globMvFromList(installMv, resolve, verbose);
                  });
                let installMvFuncComplete = await installMvFunc;
            }

            // Overwrite current directory with project-specific files
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
            if (installDirectories[3]) {
                const installDir3 = g.asyncFunction(
                  `Installing directory: ${installDirectories[3]}`, `Directory: ${installDirectories[3]} installed`, (resolve) => {
                      installDirectory(installDirectories[3], resolve);
                  });
                let installDir3Complete = await installDir3;
            }
            if (installDirectories[4]) {
                const installDir4 = g.asyncFunction(
                  `Installing directory: ${installDirectories[4]}`, `Directory: ${installDirectories[4]} installed`, (resolve) => {
                      installDirectory(installDirectories[4], resolve);
                  });
                let installDir4Complete = await installDir4;
            }
            if (installDirectories[5]) {
                const installDir5 = g.asyncFunction(
                  `Installing directory: ${installDirectories[5]}`, `Directory: ${installDirectories[5]} installed`, (resolve) => {
                      installDirectory(installDirectories[5], resolve);
                  });
                let installDir5Complete = await installDir5;
            }
            if (installDirectories[6]) {
                const installDir6 = g.asyncFunction(
                  `Installing directory: ${installDirectories[6]}`, `Directory: ${installDirectories[6]} installed`, (resolve) => {
                      installDirectory(installDirectories[6], resolve);
                  });
                let installDir6Complete = await installDir6;
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


            if (answers.frontEndFramework) {
                g.log('verbose', `Updating package.json file`, verbose);
                const pkgWithoutDependencies = _.omit(pkg, ['dependencies', 'devDependencies']);
                const pkgWithDependenciesAtTheEnd = _.merge(pkgWithoutDependencies, {
                    dependencies: pkg.dependencies,
                    devDependencies: pkg.devDependencies,
                });
                fs.outputFileSync(`${ process.cwd() }/front-end/package.json`, JSON.stringify(pkgWithDependenciesAtTheEnd, null, 2));
                g.log('verbose', `package.json file updated:`, verbose);
                g.log('dump', pkg, verbose);

                const removeGitkeep = g.asyncFunction(
                    `Removing Default .gitkeep Files`, `Default .gitkeep Files Removed`, (resolve) => {
                        g.globRemove(`${ process.cwd() }/front-end/_source/**/.gitkeep`, resolve, verbose);
                    });
                let removeGitkeepComplete = await removeGitkeep;
            }
            if (answers.backEndPlatform) {
                g.log('title', 'Running project specific install scripts', verbose);
                if (['craft3'].includes(answers.backEndPlatform)) {
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
            }

            if (answers.installEnd === 'front') {
                // Set up project basics
                // g.log('verbose', `Running setup script`, verbose);
                // g.verboseExec(`ddev exec node ${projectDirectory}/_wb/setup.mjs --component-defaults${verbose ? ' --verbose' : ''}`, true);
            }

            g.log('title', `Cleaning Up`);
            g.verboseExec(`rm -rf ${ process.cwd() }/SETUP`, verbose);
            g.log('verbose', `Install directory deleted`, verbose);

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

            g.log('app', `Workbench Project Installed`);
            g.log('app', `Run: cd ${ handle }`);
            g.log('app', `     ddev start`);
            if (answers.frontEndFramework) {
                g.log('app', `     ddev npm run setup`);
                g.log('app', `     ddev npm run dev`);
            }

            g.log('message', chalk.dim(`\n${_bye()}\n`));
        });
    }
}




// CUSTOM FUNCTIONS
async function installDirectory(name, finished) {
    const projectTypeInstallDirectory = `${scaffoldingDirectory}/${ name }`;

    mergeIntoPkg(`${ projectTypeInstallDirectory }/setup/package.json`);

    g.log('verbose', `Looking for templates to move at ${projectTypeInstallDirectory}`, verbose);
    if (fs.existsSync(`${ projectTypeInstallDirectory }/mv`)) {
        const moveInstallFiles = g.asyncFunction(
          `Moving Default Files`, `Default Files Moved`, (resolve) => {
              g.globMove(`${projectTypeInstallDirectory}/mv/**/*`, `${projectTypeInstallDirectory}/mv/`, `${projectDirectory}/`, resolve, verbose);
          });
        let moveInstallFilesComplete = await moveInstallFiles;
    } else {
        g.log('verbose', `No project templates to move`, verbose);
    }

    g.log('verbose', `Looking for EJS templates to compile at ${projectTypeInstallDirectory}`, verbose);
    if (fs.existsSync(`${ projectTypeInstallDirectory }/ejs`)) {
        const compileInstallFiles = g.asyncFunction(
          `Compiling Default Templates`, `Default Templates Compiled`, (resolve) => {
              g.globEjs(`${projectTypeInstallDirectory}/ejs/**/*`, `${projectTypeInstallDirectory}/ejs/`, `${projectDirectory}/`, ejsVars, resolve, verbose);
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

async function saveLocalConfig(config, callback) {
    g.log('title', `Saving Local Configuring File`);
    localConfig = {};

    const questions = [
        {
            type: 'input',
            name: 'cpTrigger',
            message: 'Default CP Trigger (path to Craft CP)',
            when: !config.cpTrigger,
        },
        {
            type: 'input',
            name: 'cmsAdminEmail',
            message: 'Default CMS Admin Email Address',
            when: !config.cmsAdminEmail,
        },
        {
            type: 'input',
            name: 'cmsAdminUsername',
            message: 'Default CMS Admin Username',
            when: !config.cmsAdminUsername,
        },
        {
            type: 'input',
            name: 'cmsAdminPassword',
            message: 'Default CMS Admin Password',
            when: !config.cmsAdminPassword,
        },
        {
            type: 'input',
            name: 'gitUser',
            message: 'Default Git User',
            when: !config.gitUser,
        },
        {
            type: 'input',
            name: 'gitOrg',
            message: 'Default Git Organization',
            when: !config.gitOrg,
        },
        {
            type: 'confirm',
            name: 'gitPrivate',
            message: 'Repos Private By Default?',
            default: true,
            when: !config.gitPrivate,
        },
    ];

    inquirer.prompt(questions).then(function (answers) {
        g.log('verbose', `Answers:`, verbose);
        g.log('dump', answers, verbose);

        const configSettings = [
            'cmsAdminEmail',
            'cmsAdminUsername',
            'cmsAdminPassword',
            'cpTrigger',
            'gitPrivate',
            'gitOrg',
            'gitUser',
        ];
        configSettings.forEach((key) => {
            if (typeof answers[key] !== 'undefined') {
                localConfig[key] = answers[key];
            }
        });

        fs.outputFileSync(`${ os.homedir() }/.workbench.config.json`, JSON.stringify(localConfig, null, 2));

        g.log('title', `Saved Local Configuring File to ${ os.homedir() }/.workbench.config.json:`);
        g.log('dump', localConfig, verbose);

        callback();
    });
}

function _bye() {
    const lines = [
        `We’re all done here. Byyyye!`,
    ]
    return lines[Math.floor(Math.random()*lines.length)];
}

// INIT
run();
