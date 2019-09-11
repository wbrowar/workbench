import { gaTrack, log } from './global.js';

// UTILITY FUNCTIONS
// Call this before Marketo RTP is loaded to prepare IDs to be changed via RTP
export function init(config = {}) {
  let el;

  // Add classes to "This is the Place" text
  // el = document.querySelector('.grid_item--11846 .c_feature_grid_item--text__text__content__header');
  // if (el) {
  //     el.id = 'hey_mike_title';
  // }
  // el = document.querySelector('.grid_item--11846 .c_feature_grid_item--text__text__content__body');
  // if (el) {
  //     el.id = 'hey_mike_body';
  // }
}
// Call this after RTP is loaded to change the page based on the updated content
export function onload(data, config = {}) {
  let el;

  // Change waterfall video
  el = document.querySelector('video[data-src*="rochester_waterfall.mp4"]');
  if (el) {
    if (jsDevMode || (data.location.city === 'Buffalo' && data.location.state === 'NY')) {
      el.setAttribute('data-src', '/u/feature-grid/buffalo_water.mp4');
      track('Homepage waterfall video changed to Buffalo water video');
      gaTrack('personalization', 'video_swap', 'buffalo', { nonInteraction: 1 });
    }
  }
}

export function track(name) {
  if (!jsDevMode) {
    window.rtp('send', 'event', { value: name });
    log(`Marketo event tracked: ${name}`);
  } else {
    log(`Marketo event preview: ${name}`);
  }
}

log('RTP');
