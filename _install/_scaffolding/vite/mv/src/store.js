import { createStore } from 'vuex';

let state = {};
let mutations = {};
let actions = {};

// Branch manager based on user-selected location
state['example'] = false;
actions['updateExample'] = function({ commit }, employee) {
  commit('updateExample', employee);
};
mutations['updateExample'] = function(state, employee) {
  state.example = employee;
};

export default createStore({
  state: state,
  actions: actions,
  mutations: mutations,
});