//  LAZY
//  🏖 Utility library used to lazy load front-end assets as well as perform animations based on page scroll position

import { addClass, log, warn } from './global.js';
import * as io from 'intersection-observer';

let animations = false;

// UTILITY FUNCTIONS
function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

// CUSTOM FUNCTIONS
function animateHandler(element, watcher = false, onLoad = false) {
    let reset = false;

    // Call a javascript animation in the animation.js file
    // EXAMPLE data-lazy-animate="{ "anim": "fade-in", "delay": [0.1, 0.5] }"
    if (element.getAttribute('data-lazy-animate') !== '' && animations) {
        let args = JSON.parse(element.getAttribute('data-lazy-animate')) || {};
        const anim = args.anim || false,
              el = args.targets ? document.querySelectorAll(args.targets) : args.target ? document.querySelector(args.target) : element;

        reset = args.reset || false;

        if (onLoad && (args.staticOnLoad || true)) {
            args.delay = args.speed = 0;
        }

        if (anim) {
            requestAnimationFrame(() => animations.animate(anim, el, args));
        } else {
            warn('Animation function not passed in:', anim);
        }
    }

    // In CSS use a class, called 'c_animate--animated', for CSS transforms and keyframe animations
    addClass(element, 'c_animate--animated');

    // Turn off observer or leave it on by passing '"reset": true' into args
    if (!reset) {
        element.removeAttribute('data-lazy-animate');

        if (watcher) {
            watcher.unobserve(element);
        }
    }
}
function loadHandler(element, watcher) {
    // Lazy load images via srcset
    // EXAMPLE: data-srcset="/img/FPO.png 1x, /img/FPO@2x.png 2x"
    // REQUIRED `data-srcset` will be swapped to `srcset` attribute
    if (element.hasAttribute('data-srcset')) {
        const srcset = element.getAttribute('data-srcset');
        element.setAttribute('srcset', srcset);
        removeImagePlaceholder(element);
        element.removeAttribute('data-srcset');
        log('Lazy srcset', srcset);
    }

    // Lazy load videos and audio via src
    // EXAMPLE: data-src="/video/1.mp4"
    // REQUIRED `data-src` will be swapped to `src` attribute
    if (element.hasAttribute('data-src')) {
        const src = element.getAttribute('data-src');
        element.setAttribute('src', src);
        element.removeAttribute('data-src');
        log('Lazy src', src);
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

export default class Lazy {
    constructor(args = {}) {
        this.animateMargin = args.animateMargin || '-100px';
        this.animateThreshold = args.animateThreshold || 0;
        this.loadMargin = args.loadMargin || '50%';
        this.loadThreshold = args.loadThreshold || 0;

        this.createImagePlaceholders();

        // Loops through elements with `data-lazy-load` and adds each element to the observer
        // When the element scrolls into view, a callback function will be fired and data attributes will be replaced with code that loads assets
        this.loadElements = args.loadElements || document.querySelectorAll('[data-lazy-load]');
        if (this.loadElements.length > 0) {
            this.loadObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    log('Lazy loading element', entry);
                    if (entry.isIntersecting) {
                    // if (entry.intersectionRatio === 0) {
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

        // Loops through elements with `data-lazy-load` and adds each element to the observer
        // When the element scrolls into view, a callback function will be fired and data attributes will be replaced with code that loads assets
        this.animateElements = args.animateElements || document.querySelectorAll('[data-lazy-animate]');
        if (this.animateElements.length > 0) {
            import(/* webpackChunkName: "animation" */ './animation.js').then((module) => {
                animations = module;

                this.animateObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        log('Lazy animating element', entry);
                        if (entry.isIntersecting) {
                            animateHandler(entry.target, this.animateObserver);
                        }
                    });
                }, {
                    rootMargin: this.animateMargin,
                    threshold: this.animateThreshold,
                });
                this.animateElements.forEach(element => {
                    let args = JSON.parse(element.getAttribute('data-lazy-animate')) || {};

                    if (isElementInViewport(element)) {
                        animateHandler(element, (args.reset ? this.animateObserver : null), true);
                    } else {
                        this.animateObserver.observe(element);
                    }
                });
            }).catch(error => warn('An error occurred while loading the component'));
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
                animateHandler(element, null, animations);
            } else if (isElementInViewport(element)) {
                animateHandler(element, this.animateObserver, animations);
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
