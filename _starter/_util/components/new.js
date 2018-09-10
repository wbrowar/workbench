const chalk = require('chalk'),
      exec = require('child_process'),
      ejs = require('ejs'),
      fs = require('fs-extra'),
      glob = require('glob'),
      inquirer = require('inquirer'),
      path = require('path'),
      pleasant = require('pleasant-progress'),
      sass = require('node-sass'),
      sassGlobImporter = require('node-sass-glob-importer'),
      webpack = require('webpack');

let config = {
        assetBundlePath: `${ process.cwd() }/development/src/assetbundles/`,
        templatesPath: `${ process.cwd() }/development/src/templates/`,
    },
    env = process.env.NODE_ENV || 'development',
    runBuild,
    runPublish,
    runRelease,
    runWatch,
    verbose; // whether or not commands are displayed in terminal output

async function run() {
    // HELLO
    _log('message', chalk.bgRed(` Craft Plugin Builder Started `));

    // INIT
    // get command line arguments and set default config variables
    const argv = _parseArgv();
    runBuild   = argv.options.build || true;
    runPublish = argv.options.publish || false;
    runRelease = argv.options.release || false;
    runWatch   = argv.options.watch || false;
    verbose    = argv.options.verbose || false;

    // get craft builder config from plugin folder
    _log('title', `Loading config file.`);
    _log('verbose', `Checking for ${ process.cwd() }/.craft-pb.json`);
    if (fs.existsSync(`${ process.cwd() }/.craft-pb.json`)) {
        // if project config exists, update config with new values
        _log('verbose', `craft-pb configuration file found`);

        const projectConfig = JSON.parse(fs.readFileSync(`${ process.cwd() }/.craft-pb.json`));

        _log('verbose', `Setting defaults to config settings`);
        config['assets'] = projectConfig.assets || false;
        _log('verbose', `assets: ${ config.assets }`);
        config['craftMajorVersion'] = projectConfig.craftMajorVersion || false;
        _log('verbose', `craftMajorVersion: ${ config.craftMajorVersion }`);
        config['moduleType'] = projectConfig.moduleType || false;
        _log('verbose', `moduleType: ${ config.moduleType }`);
        config['sourceDir'] = projectConfig.sourceDir || false;
        _log('verbose', `sourceDir: ${ config.sourceDir }`);

        const webpackConfigPath = projectConfig.config.webpack !== 'PB' ? `${ process.cwd() }/${ projectConfig.config.webpack }` : `${ __dirname }/config/webpack.config.js`;
        if (fs.existsSync(webpackConfigPath)) {
            config['webpack'] = require(webpackConfigPath);
            _log('verbose', `Webpack config loaded from ${ webpackConfigPath }`);
        }
    } else {
        // if project config does not exist, ask questions to create config
        _log('verbose', `craft-pb configuration file not found`);
    }

    if (config.assets
        && config.craftMajorVersion
        && config.moduleType
        && config.sourceDir) {

        if (runWatch) {
            // WATCH
            // start watching files
        }

        // BUILD
        // compile files from _source to development
        const buildTask = () => {
            return new Promise(resolve => {
                _log('title', `Running Build`);

                // compile scss
                compileCss();

                // compile js
                compileJs();

                // compile templates
                compileTemplates();

                resolve(true);
            })
        };

        // RELEASE
        // move files from development to release
        const releaseTask = async () => {
            const _build = await buildTask();
            _log('title', `Running Release`);

            if (_build) {
                const _cleanRelease = async () => {
                    const cleanReleaseFiles = glob.sync(`./release/*`, {dot: true, ignore: "{./release/.git,./release/.gitignore}"});
                    await _asyncForEach(cleanReleaseFiles, async (item) => {
                        fs.remove(item, err => {
                            if (err) return console.error(err);

                            _log('verbose', `Removed: ${ item }`);
                        });
                    });
                };
                const _copyDevelopment = async () => {
                    await _cleanRelease();
                    const releaseFiles = glob.sync(`./development/*`, {dot: true, ignore: ['./development/vendor']});
                    await _asyncForEach(releaseFiles, async (item) => {
                        fs.copy(item, item.replace('./development', './release'), err => {
                            if (err) return console.error(err);

                            _log('verbose', `Copied: ${ item }`);
                        });
                    });
                };

                _copyDevelopment();

                return true;
            }

            return false;
        };

        // PUBLISH
        // ask for new version number
        // check if composer.json has been updated with new version number
        // check if CHANGELOG.md has been updated with new version number
        // commit and tag plugin with new version number
        const publishTask = async () => {
            const _release = await releaseTask();
            _log('title', `Running Publish`);

            return _release;
        };

        // RUN
        if (runPublish) {
            publishTask().then((res) => {
                if (res) {
                    _log('title', `Publish Complete`);
                }
            });
        } else if (runRelease) {
            releaseTask().then((res) => {
                if (res) {
                    _log('title', `Release Complete`);
                }
            });
        } else if (runWatch) {
        } else if (runBuild) {
            buildTask();
        }
    } else {
        // SETUP
        // copy js files
        // copy css files and convert them to scss
        // copy template files
        // create craft-pb config file
    }
}

async function compileCss() {
    _log('title', `Compiling CSS.`);

    if (config.assets.css || false) {
        config.assets.css.forEach((item) => {
            if (item.src && item.dist) {
                sass.render({
                    file: `${ config.sourceDir }_scss/${ item.src }`,
                    importer: sassGlobImporter(),
                    outputStyle: env === 'production' ? 'compressed' : 'expanded',
                }, function(error, result) { // node-style callback from v3.0.0 onwards
                    if (error) {
                        _log('verbose', `SASS Error: ${ error.status }`); // used to be "code" in v2x and below
                        _log('verbose', `SASS Error: ${ error.column }`);
                        _log('verbose', `SASS Error: ${ error.message }`);
                        _log('verbose', `SASS Error: ${ error.line }`);
                    }
                    else {
                        fs.outputFile(config.assetBundlePath + item.dist, result.css, (err) => {
                            if(!err){
                                _log('verbose', `SASS compiled: ${ item.src } → ${ item.dist }`);
                            }
                        });
                    }
                });
            }
        });
    }
}

async function compileJs() {
    _log('title', `Compiling JS.`);

    if (config.webpack || false) {
        let jsFiles = [];
        config.assets.js.forEach((item) => {
            jsFiles.push(
                Object.assign({
                    entry: `${ config.sourceDir }_js/${ item.src }`,
                    output: {
                        chunkFilename: '[id].js',
                        filename: item.dist.filename,
                        path: config.assetBundlePath + item.dist.path,
                    },
                }, config.webpack)
            );
        });

        webpack(jsFiles, function (err, stats) {
            if (err) {
                throw new Error("A valid webpack config file is not provided. Point config.webpack to a valid webpack.config.json file.");
            }

            _log('verbose', `JS compiled: ${ stats.toString({
                assets: true,
                chunks: false,
                chunkModules: false,
                colors: true,
                hash: false,
                timings: false,
                version: false
            })}`);
        });
    } else {
        throw new Error("A valid webpack config file is not provided. Point config.webpack to a valid webpack.config.json file.");
    }
}

async function compileTemplates() {
    _log('title', `Compiling Templates.`);

    glob(`${ config.sourceDir }_templates/**/*{html,twig,php,json,csv,css,js}`, function (er, files) {
        files.forEach((item) => {
            // _log('verbose', `EJS rendering: ${ item }`);

            ejs.renderFile(item, {}, {}, function(err, str) {
                // _log('verbose', `EJS going to: ${ config.templatesPath + item.replace(`${ config.sourceDir }_templates/`, '') }`);

                fs.outputFile(config.templatesPath + item.replace(`${ config.sourceDir }_templates/`, ''), str, (err) => {
                    if(!err){
                        _log('verbose', `EJS compiled: ${ item }`);
                    }
                });
            });
        });
    })
}

async function _asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
};
function _log(type='message', message) {
    switch (type) {
        case 'running':
            console.log(chalk.green.bold('Running: ') + chalk.green(message));
            break;
        case 'title':
            console.log(chalk.blue.bold('[ ' + message + ' ]'));
            break;
        case 'verbose':
            if (verbose) {
                console.log(chalk.red.bold('Craft Plugin Builder: ') + chalk.red(message));
            }
            break;
        default:
            console.log(message);
    }
}

function _parseArgv() {

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

function _verboseExec(command) {
    if (verbose) {
        _log('running', command);
        exec.spawnSync(command, [], { stdio: 'inherit', shell: true });
    } else {
        exec.execSync(`${command} > /dev/null 2>&1`);
    }
}

exports.run = run;