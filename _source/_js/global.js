//  GLOBAL
//  🌎 Scripts used on all pages on the site
//  Examples:
//  🛣 Functionality in nagivation used accross all pages on the site
//  🏗 Utility functions, global variables, or browser events used on all pages of the site

import lazy from 'lazy';

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
        if (typeof ga === 'function') {
            ga("send", "event", category, action, label);
        } else {
            console.warn('Google Analytics is not set up.');
        }
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
const QueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    const query_string = {};
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i=0;i<vars.length;i++) {
        const pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            const arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();
function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
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
function activeToggleHandler(e) {
    const element = e.target,
        activeToggleTargets = element.getAttribute('data-active-toggle') !== '' ? document.querySelectorAll(element.getAttribute('data-active-toggle')) : [element];

    Array.prototype.forEach.call(activeToggleTargets, function(el, i) {
        if (hasClass(el, 'active')) {
            removeClass(el, 'active');
        } else {
            addClass(el, 'active');
        }
    });
}
function activeToggleSetup() {
    const activeToggleElements = document.querySelectorAll('[data-active-toggle]');

    Array.prototype.forEach.call(activeToggleElements, function(el, i) {
        el.addEventListener('click', activeToggleHandler);
    });
}


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
export function setupJsComponents() {
    activeToggleSetup();
}
export function setupEnhancements() {
    if (typeof QueryString.enhanced === 'undefined') {
        ready(function() {
            addClass(document.documentElement, 'enhanced');
            lazy();
        });
    }
}
if (jsDevMode) {
    console.log('Global');
}