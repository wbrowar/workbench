// import node modules
const ejs = require('ejs'),
      fs = require('fs-extra'),
      glob = require('glob-all'),
      inquirer = require('inquirer'),
      path = require('path');

// import global functions
const g = require('./functions.js');

// load config files
let wb = require(`${ process.cwd() }/wb.config.js`);

// set constants
const argv = g.parseArgv(),
      env = process.env.NODE_ENV || 'development';

// use CLI arguments to set variables
const action  = (argv.options.mv || false) ? 'move' : 'new',
      verbose = argv.options.verbose || false;

// set variables based on wb options
let paths = wb.paths,
    questions;

// set notify configs
const notify = {
    icon: `${ wb.paths.favicon.src }/favicon.png`,
    name: wb.name,
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

            // Create demo.vue
            const demoVue = `<template>
  <div>
    <h1>Title</h1>
    <p>Description</p>

    <ImportPath path="import Grid from 'Components/folder/ComponentName';" />

    <CodeExample :code="code.default" title="Required Title" description="Optional description.">
      <p>Demo</p>
    </CodeExample>

    <PropsTable :props="props" />

    <CssModifiers root-class="c_root_class" :modifiers="modifiers" />
  </div>
</template>

<script>
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
import EventsTable from 'Starter/docs/vue/EventsTable.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    CodeExample,
    CssModifiers,
    EventsTable,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      code: false,
      modifiers: false,
      props: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.code = {
      default: \`<p>Demo</p>\`,
    };
    this.events = [
        { name: 'onExample', arguments: 'example', description: \`Example description.\` },
    ];
    this.modifiers = [
        { name: 'example', description: \`Example description.\` },
    ];
    this.props = [
        { name: 'example', type: 'String',  default: \`''\`, description: \`Example description.\` },
    ];
  }
};
</script>`;

            fs.outputFileSync(`${ paths.components.src }${ answers.handle }/demo.vue`, demoVue);
        });
    }
}












// FUNCTIONS
function moveExistingComponent(handle) {
    const componentSourceFolder = `${ paths.starter.components }${ handle }`;

    fs.moveSync(componentSourceFolder, paths.components.src + handle, { overwrite: false });
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