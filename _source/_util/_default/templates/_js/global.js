//  GLOBAL
//  🌎 Scripts used on all pages on the site
//  Examples:
//  🛣 Functionality in nagivation used accross all pages on the site
//  🏗 Utility functions, global variables, or browser events used on all pages of the site

import * as animation from './animation.js';
import lazy from './lazy.js';
import * as vc from './vue-components.js';

// export var windowWidth = 0, windowHeight = 0;
const isIE = /MSIE \d|Trident.*rv:/.test(navigator.userAgent);

// UTILITY FUNCTIONS
export function log(...args) {
    if (jsDevMode) {
        for (let i=0; i<args.length; i++) {
            const spacer = i>0 ? '•' : '';
            console.log(spacer + '🚀', args[i]);
        }
    }
}
export function warn(...args) {
    if (jsDevMode) {
        for (let i=0; i<args.length; i++) {
            console.warn(args);
        }
    }
}
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
    if (document.readyState !== 'loading'){
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
function sliderLoaded(el, args) {
    if (window.VueEvent !== undefined) {
        window.VueEvent.$emit('slider-loaded', args.id);
    }
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


// SETUP FUNCTIONS
export function setupJsComponents() {
    activeToggleSetup();
}
export function setupEnhancements() {
    if (typeof QueryString.enhanced === 'undefined') {
        const lazyConfig = {
            animationFunctions: {
                'introduceElement': animation.introduceElement,
                'sliderLoaded': sliderLoaded,
            }
        };
        ready(function() {
            // add fix for background images
            if (isIE) {
                const imageBgImages = document.querySelectorAll('.c_image_bg__image');

                for (let i = 0, l = imageBgImages.length; i<l; i++) {
                    const el = imageBgImages[i];
                    const image = el.querySelector('img');

                    if (image.getAttribute('data-src')) {
                        el.style.backgroundImage = 'url(' + image.getAttribute('data-src') + ')';
                    } else if (image.getAttribute('src')) {
                        el.style.backgroundImage = 'url(' + image.getAttribute('src') + ')';
                    }
                }
            }

            // add class to html element for styling purposes
            addClass(document.documentElement, 'enhanced');

            // lazy load images and media
            lazy(lazyConfig);
        });
    }
}

// INIT FUNCTIONS
log('Global');
