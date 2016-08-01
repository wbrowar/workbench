/*
  GLOBAL
  🌎 Scripts used on all pages on the site
  Examples:
  🛣 Functionality in nagivation used accross all pages on the site
  🏗 Utility functions, global variables, or browser events used on all pages of the site
*/

var jq = jQuery;
//var windowWidth = 0, windowHeight = 0;

// UTILITY FUNCTIONS
/*
function ga_track(category, action, label) {
	if (!requireDevMode) {
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


// INIT FUNCTIONS
if (!requireDevMode) {
  console.log('Global');
}