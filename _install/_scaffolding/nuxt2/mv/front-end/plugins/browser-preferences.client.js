import { defineNuxtPlugin } from '@nuxtjs/composition-api';

export default defineNuxtPlugin(({ store }) => {
  // Set dark mode class upon page load
  if (
    localStorage['color-scheme'] === 'dark' ||
    (!('color-scheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    store.dispatch('updateColorScheme', { scheme: 'dark', savePreference: false });
  }

  // Set reduce motion based on browser preference
  if (
    localStorage['reduce-motion'] === 'true' ||
    (!('reduce-motion' in localStorage) && window.matchMedia('(prefers-reduced-motion)').matches)
  ) {
    store.dispatch('updateReduceMotion', { isReduced: true, savePreference: false });
  }
});
