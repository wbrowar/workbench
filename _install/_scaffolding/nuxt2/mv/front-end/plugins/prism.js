import Vue from 'vue';
import Prism from 'vue-prism-component';

import 'prismjs';

import 'prismjs/themes/prism-tomorrow.css';

import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-properties.js';
// import 'prismjs/components/prism-php.js';
// import 'prismjs/components/prism-php.js';
import 'prismjs/components/prism-twig.js';

import 'prismjs/plugins/autolinker/prism-autolinker.js';
import 'prismjs/plugins/autolinker/prism-autolinker.css';

Vue.component('prism', Prism);
