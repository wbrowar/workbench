//  GLOBAL
//  🌎 Scripts used on all pages on the site
//  Examples:
//  🛣 Functionality in nagivation used accross all pages on the site
//  🏗 Utility functions, global variables, or browser events used on all pages of the site

import Lazy from './lazy.js';

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
export function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
export function snake(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '_')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}


// CUSTOM FUNCTIONS
function sliderLoaded(el, args) {
    if (window.VueEvent !== undefined) {
        window.VueEvent.$emit('slider-loaded', args.id);
    }
}


// SETUP FUNCTIONS
export function setupEnhancements() {
    if (typeof QueryString.enhanced === 'undefined') {
        ready(function() {
            // add class to html element for styling purposes
            addClass(document.documentElement, 'enhanced');

            // lazy load images and media
            window.lazy = new Lazy({
                // animationFunctions: {
                //     'introduceElement': animation.introduceElement,
                //     'sliderLoaded': sliderLoaded,
                // },
                container: '#page',
            });
        });
    }
}

// INIT FUNCTIONS
log('Global');