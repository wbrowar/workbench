//  LAZY
//  🏖 Utility library used to lazy load front-end assets as well as perform animations based on page scroll position

import { addClass, log, warn } from './global.js';
import * as io from 'intersection-observer';

// UTILITY FUNCTIONS
function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

// CUSTOM FUNCTIONS
function testFunction(el, rotation = '15') {
    const currentDegrees = el.hasAttribute('data-rotation-degrees') ? parseFloat(el.getAttribute('data-rotation-degrees')) : '0';
    const degrees = currentDegrees + parseFloat(rotation);

    el.style.transform="rotateY(" + degrees + "deg)";
    el.setAttribute('data-rotation-degrees', degrees);
}

function animateHandler(element, watcher, animationFunctions, viewportEvent = 'enter') {
    // call a javascript animation that has been passed into animationFunctions
    // EXAMPLE data-lazy-animate="introduceElement"
    if (element.getAttribute('data-lazy-animate') !== '' || element.getAttribute('data-lazy-animate-exit') !== '') {
        let func, args;
        switch (viewportEvent) {
            case 'enter':
                func = element.getAttribute('data-lazy-animate');
                args = element.hasAttribute('data-lazy-animate-args') ? JSON.parse(element.getAttribute('data-lazy-animate-args')) : null;
                break;
            case 'exit':
                func = element.getAttribute('data-lazy-animate-exit');
                args = element.hasAttribute('data-lazy-animate-exit-args') ? JSON.parse(element.getAttribute('data-lazy-animate-exit-args')) : null;
                break;
        }

        if (typeof animationFunctions[func] === "function") {
            if (args !== null) {
                requestAnimationFrame(() => animationFunctions[func](element, args));
            } else {
                requestAnimationFrame(() => animationFunctions[func](element));
            }
        }
    }

    // in CSS use a class, called 'animated', for CSS transforms and keyframe animations
    addClass(element, 'animated');
    if (watcher !== null && !element.hasAttribute('data-lazy-animate-reset')) {
        element.removeAttribute('data-lazy-animate');
        element.removeAttribute('data-lazy-animate-exit');
        watcher.unobserve(element);
    }
}
function loadHandler(element, watcher) {
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
    if (watcher !== null) {
        watcher.unobserve(element);
    }
}
function removeImagePlaceholder(el) {
    el.style.paddingTop = '';
    el.style.maxWidth = '';
}

export default class Scene {
    constructor(args = {}) {
        this.animateMargin = args.animateMargin || '-100px';
        this.animateThreshold = args.animateThreshold || 0;
        this.animationFunctions = args.animationFunctions || { 'rotateBox': testFunction };
        this.loadMargin = args.loadMargin || '50%';
        this.loadThreshold = args.loadThreshold || 0;

        this.createImagePlaceholders();

        // loops through elements with `data-lazy-load` and adds each element to the observer
        // when the element scrolls into view, a callback function will be fired and data attributes will be replaced with code that loads assets
        this.loadElements = args.loadElements || document.querySelectorAll('[data-lazy-load]');
        if (this.loadElements.length > 0) {
            this.loadObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    log('Lazy loading element', entry);
                    if (entry.intersectionRatio === 0) {
                        loadHandler(entry.target, this.loadObserver);
                    }
                });
            }, {
                rootMargin: this.loadMargin,
                threshold: this.loadThreshold,
            });
            this.loadElements.forEach(element => {
                if (isElementInViewport(element)) {
                    loadHandler(element, null);
                } else {
                    this.loadObserver.observe(element);
                }
            });
        }

        // loops through elements with `data-lazy-load` and adds each element to the observer
        // when the element scrolls into view, a callback function will be fired and data attributes will be replaced with code that loads assets
        this.animateElements = args.animateElements || document.querySelectorAll('[data-lazy-animate]');
        if (this.animateElements.length > 0) {
            this.animateObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    log('Lazy animating element', entry);
                    if (entry.isIntersecting) {
                        animateHandler(entry.target, this.animateObserver, this.animationFunctions);
                    }
                });
            }, {
                rootMargin: this.animateMargin,
                threshold: this.animateThreshold,
            });
            this.animateElements.forEach(element => {
                if (isElementInViewport(element)) {
                    animateHandler(element, null, this.animationFunctions);
                } else {
                    this.animateObserver.observe(element);
                }
            });
        }
    }
    createImagePlaceholders() {
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
    updateAnimate(selector = false) {
        const elements = selector ? document.querySelectorAll(selector + ' [data-lazy-animate],' + selector + '[data-lazy-animate]') : this.animateElements;

        elements.forEach((element) => {
            if (selector) {
                animateHandler(element, null, this.animationFunctions);
            } else if (isElementInViewport(element)) {
                animateHandler(element, this.animateObserver, this.animationFunctions);
            }
        });
    }
    updateLoad(selector = false) {
        const elements = selector ? document.querySelectorAll(selector + ' [data-lazy-load],' + selector + '[data-lazy-load]') : this.loadElements;

        elements.forEach((element) => {
            if (selector) {
                loadHandler(element, null);
            } else if (isElementInViewport(element)) {
                loadHandler(element, this.loadObserver);
            }
        });
    }
}

// INIT FUNCTIONS
log('Lazy Loading');
