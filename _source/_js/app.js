//  APP
//  🏡 Custom Javascript used for UI and other functionality

import Vue from 'vue';
import { gaTrack, log, warn, setupEnhancements, addClass, hasClass, removeClass } from './global.js';

// VARIABLES
let vueData = {};
let vueMethods = {};
window.VueEvent = new Vue();

// ROOT VARIABLES AND FUNCTIONS
// Alert bar
vueData['alertBarIsVisible'] = false;
vueMethods['toggleAlertBar'] = function () {
    this.alertBarIsVisible = !this.alertBarIsVisible;
};

// Detect resize
vueData['windowWidth'] = false;
vueData['windowHeight'] = false;
vueMethods['resizeHandler'] = function () {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    VueEvent.$emit('window-resized', this.windowWidth, this.windowHeight);
};

// Detect scroll
vueData['scrollY'] = false;
vueMethods['scrollHandler'] = function () {
    this.scrollY = window.scrollY;
};

// Display overlay
vueData['overlayIsVisible'] = false;
vueMethods['showOverlay'] = function (overlayTitle) {
    VueEvent.$emit('show-overlay', overlayTitle);
    this.overlayIsVisible = true;
    gaTrack('overlay', 'shown', overlayTitle);
};

// Generic class toggle utility
// @click="classToggle('id','class')"
vueMethods['classToggle'] = function (getID, getClass) {
    const query = document.querySelectorAll(getID);
    query.forEach((el) => {
        if (hasClass(el, getClass)) {
            removeClass(el, getClass);
        } else {
            addClass(el, getClass);
        }
    });
};

// Lazy load Vue components
// Vue.component('accordion', function (resolve) {
//     require(['./components/Accordion.vue'], resolve)
// });
// Vue.component('accordion-tab', function (resolve) {
//     require(['./components/AccordionTab.vue'], resolve)
// });
// Vue.component('overlay', function (resolve) {
//     require(['./components/Overlay.vue'], resolve)
// });
// Vue.component('slider', function (resolve) {
//     require(['./components/Slider.vue'], resolve)
// });
// Vue.component('slider-control', function (resolve) {
//     require(['./components/SliderControl.vue'], resolve)
// });
// Vue.component('slider-slide', function (resolve) {
//     require(['./components/SliderSlide.vue'], resolve)
// });
// Vue.component('validated-form', function (resolve) {
//     require(['./components/ValidatedForm.vue'], resolve)
// });
// Vue.component('validated-form-input', function (resolve) {
//     require(['./components/ValidatedFormInput.vue'], resolve)
// });

// VUE INSTANCE
new Vue({
    el: '#page',
    data: vueData,
    components: {
        // 'confetti': () => import(/* webpackChunkName: "confetti" */ '../vue/Confetti.vue'),
    },
    created: function () {
        // Hide overlay and remove content
        VueEvent.$on('hide-overlay', () => this.isActive = (this.overlayIsVisible = false));

        // Watch resize
        // window.addEventListener('resize', this.resizeHandler);

        // Watch scroll
        // window.addEventListener('scroll', this.scrollHandler);
    },
    methods: vueMethods,
    mounted: function () {
        VueEvent.$emit('window-resized');

        // Initialize
        setupEnhancements();
    },
    delimiters: ['${', '}'],
});


// INIT FUNCTIONS
log('App');
