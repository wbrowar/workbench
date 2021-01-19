// import { log } from 'JS/global.js';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let state = {};
let mutations = {};
let actions = {};
let modules = {};

// Example
// state['example'] = false;
// mutations['updatemExample'] = function(state, newExampleObject) {
//   log('Updated Example: ', newExampleObject);
//
//   state.example = newExampleObject;
// };

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  modules: modules,
});