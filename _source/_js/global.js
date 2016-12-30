/*
  GLOBAL
  🌎 Scripts used on all pages on the site
  Examples:
  🛣 Functionality in nagivation used accross all pages on the site
  🏗 Utility functions, global variables, or browser events used on all pages of the site
*/

import jq from 'jquery';

//var windowWidth = 0, windowHeight = 0;

// UTILITY FUNCTIONS
/*
function ga_track(category, action, label) {
  if (!jsDevMode) {
    ga("send", "event", category, action, label);
  } else {
    console.log('GA Tracking Preview: ', category, action, label);
  }
}
*/


// CUSTOM FUNCTIONS


// BROWSER EVENTS
/*
jq(window).resize(function() {
  windowWidth = jq(window).width();
  windowHeight = jq(window).height();
}).resize();
*/
/*
// track click-to-call links
jq('a[href^="tel:"]').click(function() {
  ga_track('Call', 'clicked', jq(this).attr('href').substr(4));
});
// track form submissions
jq('form').submit(function() {
  ga_track('Forms', 'submitted', jq(this).attr('name')); // change from name attribute to some unique id
});
*/


// INIT FUNCTIONS
if (jsDevMode) {
  console.log('Global');
}