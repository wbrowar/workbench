// import node modules
const _ = require('lodash'),
      ejs = require('ejs'),
      fs = require('fs-extra'),
      glob = require('glob-all'),
      inquirer = require('inquirer'),
      os = require('os'),
      path = require('path');

// import global functions
const g = require('./global.js');

if (!fs.existsSync(`${ process.cwd() }/_starter/install`)) {
    g.log('warn', `Install Has Already Completed and Cannot Be Run Again`);
    process.exit();
}

// HELLO
g.log(`Installing WB-Starter`);

// load package file
let pkg = require(`${ process.cwd() }/package.json`);

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const verbose = argv.options.verbose || false;
let   handle  = argv.options.handle || false;

// set variables to be processed by EJS
let ejsVars = {
    projectDir: process.cwd(),
    pkg: pkg,
    securityKey: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
};

// set other variables
const starterProjects = ['craft3', 'craftplugin', 'html'];
let localConfig = false;

// check if npm and composer are installed
if (verbose) {
    g.log('warn', `Running install using --verbose will expose passwords in the terminal. Only share the output with people you trust with those passwords.`, verbose);
    g.log('verbose', `getting composer version`, verbose);
    g.verboseExec(`composer --version`, verbose);
    g.log('verbose', `getting node version`, verbose);
    g.verboseExec(`node -v`, verbose);
    g.log('verbose', `getting npm version`, verbose);
    g.verboseExec(`npm -v`, verbose);
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
                { name: 'Vue CLI', value: 'vuecli' },
                { name: 'Craft Plugin', value: 'craftplugin' },
            ],
        },
        {
            type: 'input',
            name: 'handle',
            message: 'Handle',
            default: 'my-plugin',
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
            when: (answers) => {
                return answers.setupDb;
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
            name: 'headless',
            message: 'Will this be a headless CMS?',
            default: false,
            when: (answers) => {
                return ['craft3'].includes(answers.projectType);
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
            choices: componentOptions,
        },
        {
            type: 'list',
            name: 'npmInstaller',
            message: 'npm installer',
            default: argv.options.npminstaller || localConfig ? (localConfig.npmInstaller || 'npm') : 'npm',
            choices: [
                { name: 'npm', value: 'npm' },
                { name: 'pnpm', value: 'pnpm' },
                { name: 'Yarn', value: 'yarn' },
            ],
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

        if (answers.handle) {
            handle = ejsVars.handle = answers.handle || '';
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
            localConfig['npmInstaller'] = answers.npmInstaller;

            fs.outputFileSync(`${ os.homedir() }/.wb-starter.config.json`, JSON.stringify(localConfig, null, 2));

            g.log('title', `Saved Local Configuring File`);
            g.log('dump', localConfig, verbose);
        }

        if (answers.setupDb) {
            g.log('title', 'Creating Database');
            g.verboseExec(`mysql --user="${ answers.dbUser }" --password="${ answers.dbPass }" -e 'CREATE DATABASE IF NOT EXISTS ${ '`' + handle + '`' } CHARACTER SET utf8 COLLATE utf8_general_ci'`, verbose);
            g.log('verbose', `Created mysql database: '${ handle }'`, verbose);
        }

        if (starterProjects.includes(answers.projectType)) {
            mergeIntoPkg(`${process.cwd()}/_starter/install/_starter/setup/package.json`);
        }
        g.log('title', 'Changing package.json Defaults', verbose);
        pkg.name = handle;
        pkg.version = '1.0.0';
        pkg.browserSync.url = answers.localUrl;
        pkg.paths.base.siteUrl = answers.localUrl;

        mergeIntoPkg(`${process.cwd()}/_starter/install/${ answers.projectType }/setup/package.json`);

        g.log('title', `Updating package.json values with dynamic data`);
        pkg.scripts['cnvm'] = 'nvm use ' + process.version;
        pkg.scripts['update'] = answers.npmInstaller + ' update';

        if (answers.projectType === 'craft3') {
            pkg.scripts['update'] = answers.npmInstaller + ' update && ./craft update all --backup';
        } else if (answers.projectType === 'craftplugin') {
            pkg.paths.css.dist = `src/assetbundles/${ handle }/dist/css/`;
            pkg.paths.icon.dist = `src/assetbundles/${ handle }/dist/icon/`;
            pkg.paths.img.dist = `src/assetbundles/${ handle }/dist/img/`;
            pkg.paths.js.dist = `src/assetbundles/${ handle }/dist/js/`;
        }

        const editPkgComponents = g.asyncFunction(
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

        if (starterProjects.includes(answers.projectType)) {
            const moveAllInstallFiles = g.asyncFunction(
                `Moving Default Files`, `Default Files Moved`, (resolve) => {
                    globMove(`${ process.cwd() }/_starter/install/_starter/mv/**/*`, `_starter/install/_starter/mv/`, ``, resolve);
                });
            let moveAllInstallFilesComplete = await moveAllInstallFiles;

            const compileAllInstallFiles = g.asyncFunction(
                `Compiling Default Templates`, `Default Templates Compiled`, (resolve) => {
                    globEjs(`${ process.cwd() }/_starter/install/_starter/ejs/**/*`, `_starter/install/_starter/ejs/`, ``, resolve);
                });
            let compileAllInstallFilesComplete = await compileAllInstallFiles;
        }

        const projectTypeInstallDirectory = `${ process.cwd() }/_starter/install/${ answers.projectType }/`;

        if (fs.existsSync(`${ projectTypeInstallDirectory }ejs`)) {
            const compileProjectInstallFiles = g.asyncFunction(
                `Compiling Project Templates`, `Project Templates Compiled`, (resolve) => {
                    globEjs(`${ projectTypeInstallDirectory }ejs/**/*`, `_starter/install/${ answers.projectType }/ejs/`, ``, resolve);
                });
            let compileProjectInstallFilesComplete = await compileProjectInstallFiles;
        } else {
            g.log('verbose', `No project templates to compile`, verbose);
        }

        if (fs.existsSync(`${ projectTypeInstallDirectory }mv`)) {
            const compileProjectInstallFiles = g.asyncFunction(
                `Moving Project Templates`, `Project Templates Moved`, (resolve) => {
                    globMove(`${ projectTypeInstallDirectory }mv/**/*`, `_starter/install/${ answers.projectType }/mv/`, ``, resolve);
                });
            let compileProjectInstallFilesComplete = await compileProjectInstallFiles;
        } else {
            g.log('verbose', `No project templates to move`, verbose);
        }

        g.log('title', 'Running project specific install scripts', verbose);
        if (['craft3'].includes(answers.projectType)) {
            g.verboseExec(`mv example.env .env`, verbose);
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

        g.log('title', 'Moving selected components', verbose);
        answers.components.forEach((item) => {
            if (!item.startsWith('@')) {
                g.verboseExec(`node ./_starter/component.js --mv='${ item }'${ verbose ? ' --verbose' : '' }`, verbose);
            }
        });

        g.log('title', 'Updating NPM packages', verbose);
        g.verboseExec(answers.npmInstaller + ` update`, verbose);
        g.log('verbose', `NPM Packages updated`, verbose);

        g.log('title', 'Running Initial Build Script', verbose);
        g.verboseExec(`npm run dev${ verbose ? ' -- --verbose' : '' }`, verbose);
        g.log('verbose', `WB Starter development script ran (npm run dev)`, verbose);

        if (answers.setupRepo) {
            g.log('title', 'Setting up GitHub repo');
            const gitHubEndPoint = answers.gitOrg || false ? `https://api.github.com/orgs/${answers.gitOrg}/repos` : `https://api.github.com/user/repos`;

            g.verboseExec(`curl -X POST -u ${ answers.gitUser }:${ answers.gitPass } -H "Content-Type: application/json" -d '{ "name": "${ answers.gitRepo }", "private": ${ answers.gitPrivate ? "true" : "false" } }' ${gitHubEndPoint}`, verbose);
            g.log('verbose', `Created ${ answers.gitOrg ? answers.gitOrg : answers.gitUser }/${ handle } repo on GitHub`, verbose);
            g.verboseExec(`git init`, verbose);
            g.log('verbose', `ran git init`, verbose);
            g.verboseExec(`git remote add origin https://github.com/${ answers.gitOrg ? answers.gitOrg : answers.gitUser }/${ handle }.git`, verbose);
            g.log('verbose', `set remote origin, verbose`, verbose);
            g.verboseExec(`git add -A`, verbose);
            g.log('verbose', `added all files`, verbose);
            g.verboseExec(`git add -f .gitignore`, verbose);
            g.log('verbose', `added .gitignore file`, verbose);
            g.verboseExec(`git commit -m "initial commit"`, verbose);
            g.log('verbose', `created first commit`, verbose);
            g.verboseExec(`git push --set-upstream origin master`, verbose);
            g.log('verbose', `pushed first commit to GitHub`, verbose);
        }

        g.log('title', `Cleaning Up`);
        g.verboseExec(`rm -r ${ process.cwd() }/_starter/install`, verbose);
        g.log('verbose', `Install directory deleted`, verbose);
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

// INIT
run();