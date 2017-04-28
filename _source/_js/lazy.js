//  LAZY
//

import { addClass } from 'global';
import 'scrollmonitor';

let config = {
    animationFunctions: {
        'animationFunction': testFunction,
    }
};

// FUNCTIONS
function testFunction($argAsString) {
    console.log($argAsString);
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
function lazyAnimateHandler(element, watcher = null) {
    // call a javascript animation that has been passed into config.animationFunctions
    // EXAMPLE data-lazy-animate="animateIcon|arguments"
    if (element.getAttribute('data-lazy-animate') !== '') {
        const animation = element.getAttribute('data-lazy-animate');
        const func = (animation.indexOf("|") > 0) ? animation.split('|', 2)[0] : animation;
        const args = (animation.indexOf("|") > 0) ? animation.split('|', 2)[1] : null;

        if (typeof config.animationFunctions[func] === "function") {
            if (args !== null) {
                requestAnimationFrame(() => config.animationFunctions[func](args));
            } else {
                requestAnimationFrame(() => config.animationFunctions[func]());
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
        if (bgData.class != undefined && bgData.css != undefined) {
            let css = '';
            const elementClass = bgData.class;
            for (let i = 0, l = bgData.css.length; i<l; i++) {
                const mq = bgData.css[i].mq != undefined ? bgData.css[i].mq : '';
                const retina = bgData.css[i].retina != undefined ? bgData.css[i].retina : false;
                const media = ((mq != '') || retina);
                css += `${media ? `@media ${retina ? `${mq != '' ? `${ mq } and ` : '' }(-webkit-min-device-pixel-ratio: 2), ${mq != '' ? `${ mq } and ` : '' }(min-resolution: 192dpi)` : mq } { ` : ''}.${elementClass} { background-image: url('${bgData.css[i].url}'); }${media ? ' }' : ''}`;
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
        const elementOffset = lazyLoadElements[i].hasAttribute('data-lazy-load-offset') ? parseFloat(lazyLoadElements[i].getAttribute('data-lazy-load-offset')) : 500;
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
        const elementOffset = lazyAnimateElements[i].hasAttribute('data-lazy-animate-offset') ? parseFloat(lazyAnimateElements[i].getAttribute('data-lazy-animate-offset')) : -100;
        const elementWatcher = scrollMonitor.create(lazyAnimateElements[i], elementOffset);
        elementWatcher.enterViewport(function() {
            lazyAnimateHandler(this.watchItem, this);
        });
        elementWatcher.update();
        elementWatcher.triggerCallbacks();
    }
}


// INIT FUNCTIONS
if (jsDevMode) {
    console.log('Lazy Loading');
}