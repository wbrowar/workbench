//  VUE COMPONENTS
//  🌄 Vue components and methods to manage state in the UI and on the page

import { gaTrack, log, warn } from './global.js';
import Vue from 'vue';

import Accordion from './components/Accordion.vue';
import AccordionTab from './components/AccordionTab.vue';
import Overlay from './components/Overlay.vue';
import Slider from './components/Slider.vue';
import SliderControl from './components/SliderControl.vue';
import SliderSlide from './components/SliderSlide.vue';
import ValidatedForm from './components/ValidatedForm.vue';
import ValidatedFormInput from './components/ValidatedFormInput.vue';

// VARIABLES
let vueData = {};
let vueMethods = {};
window.VueEvent = new Vue();

// ROOT VARIABLES AND FUNCTIONS
// Alert bar
vueData['alertBarIsVisible'] = false;
vueMethods['toggleAlertBar'] = function() {
    this.alertBarIsVisible = !this.alertBarIsVisible;
};

// Detect resize
vueData['windowWidth'] = false;
vueData['windowHeight'] = false;
vueMethods['resizeHandler'] = function() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    VueEvent.$emit('window-resized', this.windowWidth, this.windowHeight);
};

// Detect scroll
vueData['scrollY'] = false;
vueMethods['scrollHandler'] = function() {
    this.scrollY = window.scrollY;
};

// Display overlay
vueData['overlayIsVisible'] = false;
vueMethods['showOverlay'] = function(overlayTitle) {
    VueEvent.$emit('show-overlay', overlayTitle);
    this.overlayIsVisible = true;
    gaTrack('overlay', 'shown', overlayTitle);
};

// VUE INSTANCE
new Vue({
    el: '#page',
    data: vueData,
    components: {
        Accordion,
        AccordionTab,
        Overlay,
        Slider,
        SliderControl,
        SliderSlide,
        ValidatedForm,
        ValidatedFormInput,
    },
    created: function () {
        // Hide overlay and remove content
        VueEvent.$on('hide-overlay', () => this.isActive = (this.overlayIsVisible = false));

        // Watch resize
        window.addEventListener('resize', this.resizeHandler);

        // Watch scroll
        window.addEventListener('scroll', this.scrollHandler);
    },
    methods: vueMethods,
    mounted: function () {
        VueEvent.$emit('window-resized');
    },
    delimiters: ['${', '}'],
});


// INIT FUNCTIONS
log('Vue Components');
