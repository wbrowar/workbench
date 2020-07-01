import { log } from 'JS/global.js';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let state = {};
let mutations = {};
let actions = {};
let modules = {};

// Store all on-page marketo variables into one object
state['marketo'] = false;
mutations['updatemMarketo'] = function (state, newMarketoObject) {
  log('Updated Marketo: ', newMarketoObject);

  state.marketo = newMarketoObject;
};

// Store global Marketo form information
// This can be overrided when adding a MarketoForm component
state['marketoFormDomain'] = false;
state['marketoFormLoadScript'] = false;

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  modules: modules,
});
