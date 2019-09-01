//  APP
//  🏡 Custom Javascript used for UI and other functionality

import Vue from 'vue';
// import AdminBar from './adminbar.js';
// import Navigation from './components/Navigation.vue';
// import ScrollUpdater from './components/ScrollUpdater.vue';
import Lazy from './lazy.js';
import { dir, error, log, warn, classToggle, gaTrack } from './global.js';

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
    window.requestAnimationFrame(() => {
        this.scrollY = window.scrollY;
    });
};

// Display overlay
vueData['visibleOverlays'] = [];
vueMethods['showOverlay'] = function (overlayTitle) {
    VueEvent.$emit('show-overlay', overlayTitle);
    this.visibleOverlays.push(overlayTitle);
    gaTrack('overlay', 'shown', overlayTitle);
};
vueMethods['hideOverlay'] = function (overlayTitle) {
    VueEvent.$emit('hide-overlay', overlayTitle);
    this.visibleOverlays = this.visibleOverlays.filter(item => item !== overlayTitle);
    gaTrack('overlay', 'hidden', overlayTitle);
};

// Generic class toggle utility
// @click="classToggle('selector','class')"
vueMethods['classToggle'] = function (selector, getClass) {
    classToggle(selector, getClass);
};

// VUE INSTANCE
new Vue({
    el: '#page',
    data: vueData,
    components: {
        //Navigation,
        //ScrollUpdater,
        <% if (install.components.includes('accordion')) { %>Accordion: () => import('./components/Accordion.vue'),
        AccordionTab: () => import('./components/AccordionTab.vue'),<% } _%>
        <% if (install.components.includes('color_scheme_toggle')) { %>ColorSchemeToggle: () => import('./components/ColorSchemeToggle.vue'),<% } _%>
        <% if (install.components.includes('overlay')) { %>Overlay: () => import('./components/Overlay.vue'),<% } _%>
        <% if (install.components.includes('slider')) { %>Slider: () => import('./components/Slider.vue'),
        SliderControl: () => import('./components/SliderControl.vue'),
        SliderSlide: () => import('./components/SliderSlide.vue'),<% } _%>
        <% if (install.components.includes('form')) { %>ValidatedForm: () => import('./components/ValidatedForm.vue'),<% } _%>
        <% if (install.components.includes('form_input')) { %>ValidatedFormInput: () => import('./components/ValidatedFormInput.vue'),<% } _%>
    },
    created: function () {
        // Watch resize
        window.addEventListener('resize', this.resizeHandler);

        // Watch scroll
        // window.addEventListener('scroll', this.scrollHandler);

        // Manage overlays
        VueEvent.$on('show-overlay', (id) => this.visibleOverlays.push(id));
    },
    methods: vueMethods,
    mounted: function () {
        this.resizeHandler();

        // lazy load images and media
        window.lazy = new Lazy({
            container: '#page',
        });

        // Add Admin Bar to Craft CMS websites
        // window.adminbar = new AdminBar();
    },
    delimiters: ['${', '}'],
});

// INIT FUNCTIONS
log('App');