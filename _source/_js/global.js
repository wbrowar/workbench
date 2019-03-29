//  GLOBAL
// LOGGING FUNCTIONS
export function dir(...args) {
    logger('dir', args);
}
export function error(...args) {
    logger('error', args);
}
export function log(...args) {
    logger('log', args);
}
export function warn(...args) {
    logger('warn', args);
}
function logger(type = 'log', args) {
    const spirit = '🚀';

    if (window.jsDevMode) {
        for (let i=0; i<args.length; i++) {
            const spacer = i>0 ? '◉ ' : '';
            switch (type) {
                case 'dir':
                    if (typeof args[i] === 'string') {
                        console.dir(spacer + spirit + ' ' + args[i]);
                    } else {
                        console.dir(args[i]);
                    }
                    break;
                case 'error':
                    console.error(spacer + spirit, args[i]);
                    break;
                case 'log':
                    console.log(spacer + spirit, args[i]);
                    break;
                case 'warn':
                    console.warn(spacer + spirit, args[i]);
                    break;
            }
        }
    }
}

// UTILITY FUNCTIONS
export function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}
export function classToggle(selector, getClass) {
    const query = document.querySelectorAll(selector);
    query.forEach((el) => {
        if (hasClass(el, getClass)) {
            removeClass(el, getClass);
        } else {
            addClass(el, getClass);
        }
    });
}
export function gaTrack(category, action, label) {
    if (!window.jsDevMode) {
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

// INIT FUNCTIONS
log('Global');