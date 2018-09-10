const chalk = require('chalk'),
      download = require('download'),
      exec = require('child_process'),
      fs = require('fs-extra'),
      inquirer = require('inquirer'),
      pleasant = require('pleasant-progress'),
      os = require('os');

let localConfig;

let projectDir;

let cpTrigger,
    dbHost,
    dbPass,
    dbPort,
    dbPrefix,
    dbUser,
    gitUser,
    gitPass,
    gitOrg,
    gitPrivate,
    name,
    setupRepo,
    template,
    verbose;

function run() {

    _log('message', chalk.bgRed(' New Craft 3 Started '));

    // get command line arguments and store them into a variable
    const argv = _parseArgv();
    verbose    = argv.options.verbose || false;

    _log('verbose', `Looking for local configuration file in home directory: .new-craft3.config.json`);

    if (fs.existsSync(`${os.homedir()}/.new-craft3.config.json`)) {
        _log('verbose', `new-craft3 configuration file found`);

        localConfig = JSON.parse(fs.readFileSync(`${os.homedir()}/.new-craft3.config.json`));
    } else {
        _log('verbose', `new-craft3 configuration file not found`);
    }

    const questions = [{
        type: 'input',
        name: 'clientCode',
        message: 'Client code',
        default: 'wb',
        validate: (answer) => {
            return answer !== '';
        },
    },{
        type: 'input',
        name: 'projectName',
        message: 'Project name (machine readable)',
        default: 'test',
        validate: (answer) => {
            return answer !== '';
        },
    },{
        type: 'input',
        name: 'dbHost',
        message: 'Database Host',
        default: localConfig ? (localConfig.dbHost || '127.0.0.1') : '127.0.0.1',
    },{
        type: 'password',
        name: 'dbPass',
        message: 'Database Password',
        default: localConfig ? (localConfig.dbPass || '') : '',
    },{
        type: 'input',
        name: 'dbPort',
        message: 'Database Port',
        default: localConfig ? (localConfig.dbPort || '') : '',
    },{
        type: 'input',
        name: 'dbPrefix',
        message: 'Database Prefix',
        default: localConfig ? (localConfig.dbPrefix || 'craft') : 'craft',
    },{
        type: 'input',
        name: 'dbUser',
        message: 'Database Username',
        default: localConfig ? (localConfig.dbUser || 'root') : 'root',
    },{
        type: 'input',
        name: 'cpTrigger',
        message: 'CP Trigger (path to Craft CP)',
        default: localConfig ? (localConfig.cpTrigger || 'admin') : 'admin',
        validate: (answer) => {
            return answer !== '';
        },
    },{
        type: 'confirm',
        name: 'setupRepo',
        message: 'Setup GitHub repo?',
    },{
        type: 'input',
        name: 'gitUser',
        message: 'GitHub username (not your email)',
        default: localConfig ? (localConfig.gitUser || '') : '',
        when: (answers) => {
            return answers['setupRepo'];
        },
        validate: (answer) => {
            return answer !== '';
        },
    },{
        type: 'password',
        name: 'gitPass',
        message: 'GitHub password',
        when: (answers) => {
            return answers['setupRepo'];
        },
        validate: (answer) => {
            return answer !== '';
        },
    },{
        type: 'input',
        name: 'gitOrg',
        message: 'GitHub organization\n  (if blank, repo will be created for user)',
        default: localConfig ? (localConfig.gitOrg || '') : '',
        when: (answers) => {
            return answers['setupRepo'];
        }
    },{
        type: 'confirm',
        name: 'gitPrivate',
        message: 'Private repo?',
        default: true,
        when: (answers) => {
            return answers['setupRepo'];
        }
    }];

    inquirer.prompt(questions).then(function (answers) {
        cpTrigger  = answers['cpTrigger'];
        dbHost     = answers['dbHost'];
        dbPass     = answers['dbPass'];
        dbPort     = answers['dbPort'];
        dbPrefix   = answers['dbPrefix'];
        dbUser     = answers['dbUser'];
        gitUser    = answers['gitUser'] || false;
        gitPass    = answers['gitPass'] || false;
        gitOrg     = answers['gitOrg'] || false;
        gitPrivate = answers['gitPrivate'] || false;
        name       = answers['clientCode'].toLowerCase() + '-' + answers['projectName'].toLowerCase();
        setupRepo  = answers['setupRepo'];
        template   = argv.options.template || '_craft3_1';

        // create project folder
        console.log(chalk.blue.bold('[ Initializing ]'));

        // set project to value of name
        projectDir = './' + name;

        if (verbose) {
            _log('verbose', `getting composer version`);
            _verboseExec(`composer --version`);
            _log('verbose', `getting npm version`);
            _verboseExec(`npm -v`);
        }

        if (!fs.existsSync(projectDir)){
            // create project folder
            fs.mkdirSync(projectDir);

            // change working directory to new project folder
            process.chdir(projectDir);

            // download WB Starter
            _download('https://github.com/wbrowar/WB-Starter/archive/master.zip', () => {
                _log('verbose', `WB Starter downloaded`);

                _log('title', 'Moving Files');
                exec.execSync(`mv SETUP/WB-Starter-master/_source _source`);
                _log('verbose', `moved _source`);
                exec.execSync(`mv SETUP/WB-Starter-master/Gulpfile.js Gulpfile.js`);
                _log('verbose', `moved Gulpfile.js`);
                exec.execSync(`mv SETUP/WB-Starter-master/package.json package.json`);
                _log('verbose', `moved package.json`);
                exec.execSync(`mv SETUP/WB-Starter-master/webpack.config.js webpack.config.js`);
                _log('verbose', `moved webpack.config.js`);

                _log('title', 'Create Database');
                exec.execSync(`mysql --user="${ dbUser }" --password="${ dbPass }" -e 'CREATE DATABASE IF NOT EXISTS ${ '`' + name + '`' } CHARACTER SET utf8 COLLATE utf8_general_ci'`);
                _log('verbose', `created mysql database: '${name}'`);

                _log('title', 'Installing Craft');
                _verboseExec(`composer create-project -s RC craftcms/craft SETUP/CRAFT --ignore-platform-reqs`);
                _log('verbose', `Craft 3 downloaded via composer`);
                exec.execSync(`mv SETUP/CRAFT/* ../${projectDir}`);
                _log('verbose', `Craft 3 setup moved to project directory`);

                _log('title', 'Running NPM Install');
                _verboseExec(`npm install`);
                _log('verbose', `npm modules installed`);

                _log('title', 'Running Setup');
                _verboseExec(`gulp setup --dbhost="${dbHost}" --dbpass="${dbPass}" --dbport="${dbPort}" --dbprefix="${dbPrefix}" --dbuser="${dbUser}" --cptrigger="${cpTrigger}" --name="${name}" --template="${template}"`);
                _log('verbose', `gulp setup ran with arguments`);
                exec.execSync(`mv _env.php .env.php`);
                _log('verbose', `renamed .env.php`);
                exec.execSync(`mv _gitignore .gitignore`);
                _log('verbose', `renamed .gitignore`);

                _log('title', 'Reading Setup Config File');
                const setupConfigString = fs.readFileSync('./SETUP/setup.config.json');
                const setupConfig = JSON.parse(setupConfigString);
                _log('verbose', `setup.config.json loaded:\n\n${setupConfigString}\n`);

                _log('title', 'Running Composer Update');
                _verboseExec(`composer update --ignore-platform-reqs`);
                _log('verbose', `composer updated`);

                _log('title', 'Setting Up Craft Scripts');
                exec.execSync(`cp scripts/craft3-example.env.sh scripts/.env.sh`);
                _log('verbose', `created scripts/.env.sh`);
                _verboseExec(`composer update --ignore-platform-reqs`);
                _log('verbose', `copied scripts/.env.sh to Craft Scripts via composer update`);

                _log('title', 'Setting Up Craft');
                // exec.spawnSync(`./craft setup --driver="mysql" --server="127.0.0.1" --port="" --user="root" --password="" --database="${name}" --schema="public"`, [], { stdio: 'inherit', shell: true });
                exec.spawnSync(`./craft setup`, [], { stdio: 'inherit', shell: true });
                _log('verbose', `Craft 3 installer ran`);

                _log('title', 'Installing Craft Plugins');
                for (let i=0; i<setupConfig.installPlugins.length; i++) {
                    exec.execSync(`./craft install/plugin ${setupConfig.installPlugins[i]}`);
                    _log('verbose', `installed ${setupConfig.installPlugins[i]} plugin`);
                }

                _log('title', 'Running Initial Build Script');
                _verboseExec(`npm run dev`);
                _log('verbose', `WB Starter development script ran (npm run dev)`);

                if (setupRepo) {
                    _log('title', 'Setting up GitHub repo');
                    const gitHubEndPoint = gitOrg ? `https://api.github.com/orgs/${gitOrg}/repos` : `https://api.github.com/user/repos`;
                    _verboseExec(`curl -X POST -u ${gitUser}:${gitPass} -H "Content-Type: application/json" -d '{ "name": "${name}", "private": ${ gitPrivate ? "true" : "false" } }' ${gitHubEndPoint}`);
                    _log('verbose', `Created ${ gitOrg ? gitOrg : gitUser }/${name} repo on GitHub`);
                    exec.execSync(`git init`);
                    _log('verbose', `ran git init`);
                    exec.execSync(`git remote add origin https://github.com/${ gitOrg ? gitOrg : gitUser }/${name}.git`);
                    _log('verbose', `set remote origin`);
                    exec.execSync(`git add -A`);
                    _log('verbose', `added all files`);
                    exec.execSync(`git add -f .gitignore`);
                    _log('verbose', `added .gitignore file`);
                    exec.execSync(`git commit -m "initial commit"`);
                    _log('verbose', `created first commit`);
                    _verboseExec(`git push origin master`);
                    _log('verbose', `pushed first commit to GitHub`);
                }

                _log('title', 'Clean Up Setup');
                exec.execSync(`rm -rf SETUP`);
                _log('verbose', `SETUP directory deleted`);

                _log('message', chalk.bgRed(' New Craft 3 Completed '));
                _log('message', chalk.dim(`\n${_bye()}\n`));
            });
        } else {
            throw new Error("A directory of this name already exists. Please choose a different name.");
        }
    });
}

function _download(url, cb) {
    let progress = new pleasant();
    progress.start(chalk.blue.bold('[ Downloading ') + url + chalk.blue.bold(' ]'));
    new download({mode: '775', extract: true})
        .get(url)
        .dest('SETUP')
        .run(function(error) {
            if (error) {
                console.log(error);
                process.exit();
            } else {
                progress.stop();
                cb();
            }
        });
}

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
                console.log(chalk.red.bold('New Craft 3: ') + chalk.red(message));
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

function _bye() {
    // brought to you by: https://www.shortlist.com/entertainment/films/50-best-final-lines-in-movies/82044
    // exept the one quote... that guy was a f***ing idiot

    const lines = [
        `You met me at a very strange time in my life.`,
        `Louis, I think this is the beginning of a beautiful friendship.`,
        `Let me sleep.`,
        `Roads? Where we're going, we don't need roads!`,
        `Now, where was I?`,
        `Where we go from there is a choice I leave to you.`,
        `Ernest Hemingway once wrote, "The world is a fine place and worth fighting for." I agree with the second part.`,
        `This is Ripley, last survivor of the Nostromo, signing off.`,
        `We will hunt him down because he can take it. Because he's not our hero. He's a silent guardian. A watchful protector. A dark knight...`,
        `Why don't we just wait here for a little while... see what happens...`,
        `Hang on, lads; I've got a great idea.`,
        `You Maniacs! You blew it up! Ah, damn you! God damn you all to hell!`,
        `The greatest trick the devil ever pulled was convincing the world he did not exist. And like that... he is gone.`,
        `I'm da boss, I'm da boss, I'm da boss, I'm da boss, I'm da boss... I'm da boss, I'm da boss, I'm da boss, I'm da boss, I'm da boss, I'm da boss.`,
        `I'm not even gonna swat that fly. I hope they are watching. They'll see. They'll see and they'll know and they'll say, 'Why, she wouldn't even harm a fly'...`,
        `No matter where he is, I thought you should know what kind of man your father really was.`,
        `So long... partner.`,
        `I do wish we could chat longer, but I'm having an old friend for dinner...`,
        `I was cured all right!`,
        `You're not an asshole, Mark. You're just trying so hard to be.`,
        `The horror, the horror...`,
        `Still, things won't ever be the way they were before he came. But that's alright because if you hang onto the past you die a little every day. And for myself, I know I'd rather live.`,
        `Kevin, What Did You Do to My Room?`,
        `Some men get the world. Others get ex-hookers and a trip to Arizona.`,
        `I’m too old for this.`,
        `I'll be right here...`,
        `You know somethin', Utivich? I think this just might be my masterpiece.`,
        `The truth is...I am Iron Man.`,
        `Go ahead! I take your f***ing bullets! You think you kill me with bullets? I take your f***ing bullets! Go ahead!`,
        `You have no idea what I'm talking about, I'm sure. But don't worry: you will someday.`,
        `The unknown future rolls toward us. I face it, for the first time, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.`,
        `Oh yes, I believe in friends. I believe we need them, but if one day you find that you just can't trust them anymore then what then? What then?`,
        `This is my gift, my curse. Who am I? I'm Spider-man.`,
        `I think we'll be OK here, Leon.`,
        `What about the person we show it to? What's happens to them?`,
        `Yo, Adrian, we did it. We did it.`,
        `A man’s got to know his limitations.`,
        `The name's Bond. James Bond.`,
        `When people ask me if Michael Sullivan was a good man, or if there was just no good in him at all, I always give the same answer. I just tell them, he was my father.`,
        `There have been tyrants and murderers and for a time they can seem invincible, but in the end they always fall. Think of it. Always.`,
        `And no matter what they did to build this city back up again ... for the rest of time ... it would be like nobody even knew we was ever here.`,
        `Oh, no! It wasn't the airplanes. It was Beauty killed the Beast.`,
        `Baby, you are gonna miss that plane.`,
        `One more thing, Sofie... is she aware her daughter is still alive?`,
        `This place makes me wonder... Which would be worse, to live as a monster, or to die as a good man?`,
        `We each owe a death - there are no exceptions - but, oh God, sometimes the Green Mile seems so long.`,
        `Well, nobody's perfect.`,
        `What a day. What a motherf***in' day.`,
        `Right after I got here, I ordered some spaghetti with marinara sauce and I got egg noodles and ketchup. I'm an average nobody. I get to live the rest of my life like a schnook.`
    ]
    return lines[Math.floor(Math.random()*lines.length)];
}

exports.run = run;