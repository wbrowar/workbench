// import node modules
const inquirer = require('inquirer');

// import global functions
const g = require('./functions.js');

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const commitMessage = argv.options.commitmessage || false,
      verbose       = argv.options.verbose || false;

// other variables
let publishAnswers = {};

async function run() {
    const askCommitQuestions = g.asyncFunction(
        `Commit Options`, `Commit Options Set`, (resolve) => {
            if (commitMessage) {
                g.log('verbose', `Using "commitmessage" argument for commit: ${ commitMessage }`, verbose);
                publishAnswers.commitRelease = true;
                publishAnswers.message = commitMessage;
                resolve();
            } else {
                g.log('verbose', `Prompting questions for commit:`, verbose);
                const publishQuestions = [
                    {
                        type: 'confirm',
                        name: 'commitRelease',
                        message: 'Commit and push release?',
                        default: true,
                    },
                    {
                        type: 'input',
                        name: 'message',
                        message: 'Commit message',
                        validate: (answer) => {
                            return answer !== '';
                        },
                        when: (answers) => {
                            return answers.commitRelease;
                        },
                    },
                ];

                inquirer.prompt(publishQuestions).then((answers) => {
                    g.log('verbose', `Publishing with settings:`, verbose);
                    g.log('dump', answers, verbose);

                    publishAnswers = answers;
                    resolve();
                });
            }
        });
    let askCommitQuestionsComplete = await askCommitQuestions;

    if (publishAnswers.commitRelease && publishAnswers.message) {
        g.log('title', `Adding and committing code to repo.`);
        g.verboseExec(`git add -A && git commit -m "${ publishAnswers.message }" && git push && git status`, verbose);
        g.log('verbose', `Code pushed with message: ${ publishAnswers.message }`, verbose);
    }
}

// INIT
run();