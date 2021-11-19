import { log } from 'JS/global';

const actionItems = {};
const mutationItems = {};
const stateItems = {};

// EXAMPLE
// actionItems.updateExample = function({ commit }, payload = {}) {
//   commit('updateExample', payload.colorHandle);
// };
//
// stateItems.example = false;
// mutationItems.updateExample = function(state, colorHandle = 'white') {
//   log('Update Page Background Color', colorHandle);
//   state.example = colorHandle;
// };

// COLOR SCHEME + DARK MODE
// actionItems.updateColorScheme = function({ commit }, payload = {}) {
//   commit('updateColorScheme', {
//     scheme: payload.scheme,
//     savePreference: typeof payload.savePreference !== 'undefined' ? payload.savePreference : true,
//   });
//   commit('updateDarkMode', payload.scheme === 'dark');
// };
//
// stateItems.colorScheme = 'auto';
// mutationItems.updateColorScheme = function(state, payload = {}) {
//   log('Update Color Scheme', payload.scheme, payload.savePreference);
//   state.colorScheme = payload.scheme;
//
//   if (payload.savePreference) {
//     localStorage.setItem('color-scheme', payload.scheme);
//   }
// };
//
// stateItems.darkMode = false;
// mutationItems.updateDarkMode = function(state, isDark) {
//   log('Update Dark Mode', isDark);
//   state.darkMode = isDark;
// };

// REDUCE MOTION
// actionItems.updateReduceMotion = function({ commit }, payload = {}) {
//   commit('updateReduceMotion', {
//     isReduced: payload.isReduced,
//     savePreference: typeof payload.savePreference !== 'undefined' ? payload.savePreference : true,
//   });
// };
//
// stateItems.reduceMotion = false;
// mutationItems.updateReduceMotion = function(state, payload = {}) {
//   log('Update Reduce Motion', payload.isReduced, payload.savePreference);
//   state.reduceMotion = payload.isReduced;
//
//   if (payload.savePreference) {
//     localStorage.setItem('reduce-motion', payload.isReduced ? 'true' : 'false');
//   }
// };

export const actions = actionItems;
export const mutations = mutationItems;
export const state = () => stateItems;
