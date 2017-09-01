//  VUE COMPONENTS
//  🌄 Vue components and methods to manage state in the UI and on the page

import Vue from 'vue';

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