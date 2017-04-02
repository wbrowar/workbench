//  GLOBAL
//  🌎 Scripts used on all pages on the site
//  Examples:
//  🛣 Functionality in nagivation used accross all pages on the site
//  🏗 Utility functions, global variables, or browser events used on all pages of the site

import jq from 'jquery';
import emergence from 'emergence';

// export var windowWidth = 0, windowHeight = 0;

// UTILITY FUNCTIONS
export function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}
export function gaTrack(category, action, label) {
    if (!jsDevMode) {
        ga("send", "event", category, action, label);
    } else {
        console.log('GA Tracking Preview: ', category, action, label);
    }
}
export function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
}
export function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}


// CUSTOM FUNCTIONS


// BROWSER EVENTS
// jq(window).resize(function() {
//   windowWidth = jq(window).width();
//   windowHeight = jq(window).height();
// }).resize();
// // track click-to-call links
// jq('a[href^="tel:"]').click(function() {
//   gaTrack('Call', 'clicked', jq(this).attr('href').substr(4));
// });
// // track form submissions
// jq('form').submit(function() {
//   gaTrack('Forms', 'submitted', jq(this).attr('name')); // change from name attribute to some unique id
// });


// INIT FUNCTIONS
if (jsDevMode) {
    console.log('Global');
}