import { log } from 'JS/global.js';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let state = {};
let mutations = {};
let actions = {};
let modules = {};

state['marketo'] = false;
mutations['updatemMarketo'] = function(state, newMarketoObject) {
  log('Updated Marketo: ', newMarketoObject);

  state.marketo = newMarketoObject;
};

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  modules: modules,
});