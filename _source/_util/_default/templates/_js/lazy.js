//  LAZY
// Utility library used to lazy load front-end assets as well as perform animations based on page scroll position

import { addClass, log, warn } from './global.js';
import scrollMonitor from 'scrollmonitor';

let config = {
    animationFunctions: {
        'rotateBox': testFunction,
    }
};

// FUNCTIONS
function testFunction(el, rotation = '15') {
    const currentDegrees = el.hasAttribute('data-rotation-degrees') ? parseFloat(el.getAttribute('data-rotation-degrees')) : '0';
    const degrees = currentDegrees + parseFloat(rotation);

    el.style.transform="rotateY(" + degrees + "deg)";
    el.setAttribute('data-rotation-degrees', degrees);
}

// Adds max-width and padding-top to images for easier styling of placeholder images
function createImagePlaceholders() {
    const images = document.querySelectorAll('img[data-lazy-load]');
    Array.prototype.forEach.call(images, function(el, i){
        if (el.getAttribute('data-width') && el.getAttribute('data-height')) {
            const width = el.getAttribute('data-width'),
                height = el.getAttribute('data-height');
            el.style.paddingTop = (height / width * 100) + '%';
            el.style.maxWidth = el.getAttribute('data-width') + 'px';
        }
    });
}
function lazyAnimateHandler(element, watcher = null, viewportEvent = 'enter') {
    // call a javascript animation that has been passed into config.animationFunctions
    // EXAMPLE data-lazy-animate="animateIcon|arguments"
    if (element.getAttribute('data-lazy-animate') !== '' || element.getAttribute('data-lazy-animate-exit') !== '') {
        let func, args;
        switch (viewportEvent) {
            case 'enter':
                func = element.getAttribute('data-lazy-animate');
                args = element.hasAttribute('data-lazy-animate-args') ? JSON.parse(element.getAttribute('data-lazy-animate-args')) : null;
                break;
            case 'exit':
                func = element.getAttribute('data-lazy-animate-exit');
                args = element.hasAttribute('data-lazy-animate-args-exit') ? JSON.parse(element.getAttribute('data-lazy-animate-args-exit')) : null;
                break;
        }

        if (typeof config.animationFunctions[func] === "function") {
            if (args !== null) {
                requestAnimationFrame(() => config.animationFunctions[func](element, args));
            } else {
                requestAnimationFrame(() => config.animationFunctions[func](element));
            }
        }
    }

    // in CSS use a class, called 'animated', for CSS transforms and keyframe animations
    addClass(element, 'animated');
    if (!element.hasAttribute('data-lazy-animate-reset')) {
        element.removeAttribute('data-lazy-animate');
        watcher.destroy();
    }
}
function lazyLoadHandler(element, watcher = null) {
    // lazy load background images
    // EXAMPLE: data-bg-array='{ "selector": ".image_1", "css": [{ "mq": "(min-width: 300px)", "url": "/img/FPO.png" },{ "mq": "(min-width: 300px)", "retina": true, "url": "/img/FPO@2x.png" }] }'
    // REQUIRED 'data-bg-array'  JSON string that contains information needed to create and append a style tag with lazy loaded styles
    // - REQUIRED `selector` is required and it is used as the selector for the CSS
    // - REQUIRED `css` is an array that will be looped through, allowing for multiple sized images at different media queries
    //   - OPTIONAL `mq` is all of the qualifying media queries for this image size
    //   - OPTIONAL `retina` adds a media query for 2x sized screens
    //   - REQUIRED `url` is the path to the image that will be displayed in the background of the element
    if (element.hasAttribute('data-bg-array')) {
        const bgData = JSON.parse(element.getAttribute('data-bg-array'));
        if (bgData.class !== undefined && bgData.css !== undefined) {
            let css = '';
            const elementClass = bgData.class;
            for (let i = 0, l = bgData.css.length; i<l; i++) {
                const mq = bgData.css[i].mq != undefined ? bgData.css[i].mq : '';
                const retina = bgData.css[i].retina != undefined ? bgData.css[i].retina : false;
                const media = ((mq != '') || retina);
                const extra = bgData.css[i].extra != undefined ? bgData.css[i].extra : '';
                css += `${media ? `@media ${retina ? `${mq != '' ? `${ mq } and ` : '' }(-webkit-min-device-pixel-ratio: 2), ${mq != '' ? `${ mq } and ` : '' }(min-resolution: 192dpi)` : mq } { ` : ''}.${elementClass} { background-image: url('${bgData.css[i].url}');${extra} }${media ? ' }' : ''}`;
            }
            element.insertAdjacentHTML('afterend', `<style>${css}</style>`);
            addClass(element, elementClass);
        }
        element.removeAttribute('data-bg-array');
    }

    // lazy load images via srcset
    // EXAMPLE: data-srcset="/img/FPO.png 1x, /img/FPO@2x.png 2x"
    // REQUIRED `data-srcset` will be swapped to `srcset` attribute
    if (element.hasAttribute('data-srcset')) {
        const srcset = element.getAttribute('data-srcset');
        element.setAttribute('srcset', srcset);
        removeImagePlaceholder(element);
        element.removeAttribute('data-srcset');
    }

    // lazy load videos and audio via src
    // EXAMPLE: data-src="/video/1.mp4"
    // REQUIRED `data-src` will be swapped to `src` attribute
    if (element.hasAttribute('data-src')) {
        const src = element.getAttribute('data-src');
        element.setAttribute('src', src);
        element.removeAttribute('data-src');
    }

    element.removeAttribute('data-lazy-load');
    watcher.destroy();
}
function removeImagePlaceholder(el) {
    el.style.paddingTop = '';
    el.style.maxWidth = '';
}
export default function(lazyConfig = {}) {
    Object.keys(lazyConfig).forEach(function(key) { config[key] = lazyConfig[key]; });

    createImagePlaceholders();

    // loops through elements with `data-lazy-load` and adds a `scrollMonitor` watcher to each element
    // when the element scrolls into view, a callback function will be fired and data attributes will be replaced with code that loads assets
    const lazyLoadElements = document.querySelectorAll('[data-lazy-load]');
    for (let i = 0, l = lazyLoadElements.length; i<l; i++) {
        const elementOffset = lazyLoadElements[i].hasAttribute('data-lazy-load-offset') ? lazyLoadElements[i].getAttribute('data-lazy-load-offset') : 500;
        const elementWatcher = scrollMonitor.create(lazyLoadElements[i], elementOffset);
        elementWatcher.enterViewport(function() {
            lazyLoadHandler(this.watchItem, this);
        });
        elementWatcher.update();
        elementWatcher.triggerCallbacks();
    }

    // loops through elements with `data-lazy-animate` and adds a `scrollMonitor` watcher to each element
    // when the element scrolls into view, a CSS class will be added to the element and an animation can be done in CSS or Javascript
    const lazyAnimateElements = document.querySelectorAll('[data-lazy-animate]');
    for (let i = 0, l = lazyAnimateElements.length; i<l; i++) {
        const elementOffset = lazyAnimateElements[i].hasAttribute('data-lazy-animate-offset') ? parseFloat(lazyAnimateElements[i].getAttribute('data-lazy-animate-offset')) : -200;
        const elementDelay = lazyAnimateElements[i].hasAttribute('data-lazy-animate-delay') ? parseFloat(lazyAnimateElements[i].getAttribute('data-lazy-animate-delay')) : 0;
        const elementWatcher = scrollMonitor.create(lazyAnimateElements[i], elementOffset);
        elementWatcher.enterViewport(function() {
            if (lazyAnimateElements[i].hasAttribute('data-lazy-animate-delay')) {
                const watchItem = this.watchItem;
                setTimeout(function() {
                    lazyAnimateHandler(watchItem, elementWatcher, 'enter');
                }, elementDelay);
            } else {
                lazyAnimateHandler(this.watchItem, this, 'enter');
            }
        });
        if (lazyAnimateElements[i].hasAttribute('data-lazy-animate-exit')) {
            elementWatcher.exitViewport(function() {
                if (lazyAnimateElements[i].hasAttribute('data-lazy-animate-delay')) {
                    const watchItem = this.watchItem;
                    setTimeout(function() {
                        lazyAnimateHandler(watchItem, elementWatcher, 'exit');
                    }, elementDelay);
                } else {
                    lazyAnimateHandler(this.watchItem, this, 'exit');
                }
            });
        }
        elementWatcher.update();
        elementWatcher.triggerCallbacks();
    }
}


// INIT FUNCTIONS
log('Lazy Loading');
