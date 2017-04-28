//  VUE COMPONENETS
//

import Vue from 'vue';
import * as g from 'global';

// VARIABLES
let vueData = {};
let vueMethods = {};
window.VueEvent = new Vue();

// COMPONENTS

// VUE INSTANCE
new Vue({
    el: '#page',
    data: vueData,
    methods: vueMethods,
    delimiters: ['${', '}'],
});


// INIT FUNCTIONS
if (jsDevMode) {
  console.log('Vue Components');
}