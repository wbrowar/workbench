// import { log } from 'JS/global.js';

const stateItems = {};
const mutationItems = {};

// Example
// USAGE: $store.state.prefs.example
// stateItems['example'] = false;
// USAGE: $store.commit('prefs/update', arg)
// mutationItems['update'] = function(state, newExampleObject) {
//   log('Updated Example: ', newExampleObject);
//
//   state.example = newExampleObject;
// };

export const state = () => stateItems;
export const mutations = mutationItems;
