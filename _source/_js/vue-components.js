//  VUE COMPONENETS

import Vue from 'vue';
import * as g from 'global';

// VARIABLES
let vueData = {};
let vueMethods = {};
window.VueEvent = new Vue();

// COMPONENTS
// Accordion
Vue.component('accordion', {
    data() {
        return { tabs: [] };
    },
    created() {
        this.tabs = this.$children;

        VueEvent.$on('tab-selected', (tab) => this.selectTab(tab));
    },
    methods: {
        selectTab(selectedTabTitle) {
            this.tabs.forEach(tab => {
                tab.isActive = (tab.title === selectedTabTitle);
            });
        }
    },
    template: `
    <div class="vue_accordion">
        <slot></slot>
    </div>
    `,
});
Vue.component('accordion-tab', {
    data() {
        return { isActive: false };
    },
    mounted() {
        this.isActive = this.selected;
    },
    props: {
        title: {},
        selected: { default: false },
    },
    methods: {
        onTabSelected() {
            if (!this.isActive) {
                VueEvent.$emit('tab-selected', this.title);
                g.gaTrack('accordion', 'clicked', this.title);
            } else {
                this.isActive = false;
            }
        }
    },
    template: `
    <div class="vue_accordion__tab">
        <div class="vue_accordion__tab__title" :class="{ active:isActive }" @click="onTabSelected">{{ title }}</div>
        <div class="vue_accordion__tab__content" :class="{ active:isActive }"><div class="vue_accordion__tab__content__inner"><slot></slot></div></div>
    </div>
    `,
});

// Detect Resize
vueData['windowWidth'] = false;
vueData['windowHeight'] = false;
vueMethods['resizeHandler'] = function() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    VueEvent.$emit('window-resized');
};

// Detect Scroll
vueData['scrollY'] = false;
vueMethods['scrollHandler'] = function() {
    this.scrollY = window.scrollY;
};

// Slider
Vue.component('slider', {
    data() {
        return {
            currentSlide: 0,
            playInterval: false,
            totalSlides: 0,
            slides: []
        }
    },
    props: {
        id: { default: true },
        interval: false,
        startingHeight: { default: 500 },
        startingSlide: { default: 0 },
    },
    created() {
    },
    methods: {
        updateCurrentSlide() {
            const newIndex = this.currentSlide;

            VueEvent.$emit('slider-update-control-index', this.id, newIndex);

            for(let i=0; i<this.slides.length; i++) {
                if (i<newIndex) {
                    this.slides[i].currentStatus = 'before';
                } else if (i === newIndex) {
                    this.slides[i].currentStatus = 'current';
                } else {
                    this.slides[i].currentStatus = 'after';
                }
            }
        },
        validateNewIndex(newIndex) {
            if (newIndex >= this.totalSlides) {
                return this.totalSlides - 1;
            } else if (newIndex < 0) {
                return 0;
            } else {
                return newIndex;
            }
        }
    },
    mounted() {
        this.slides = this.$children;
        this.totalSlides = this.slides.length;
        this.currentSlide = this.startingSlide;

        if (this.interval) {
            this.playInterval = setInterval(() => {
                this.currentSlide = ((this.currentSlide + 1) < this.totalSlides) ? this.currentSlide + 1 : 0;
                this.updateCurrentSlide();
            }, this.interval);
        }

        // set total slides for controller
        VueEvent.$emit('slider-update-total-slides', this.id, this.slides.length);

        // set current slide
        VueEvent.$on('slider-set-slide-index', (sliderId, newIndex) => {
            // stop slider from playing
            clearInterval(this.playInterval);

            if (this.id === sliderId) {
                this.currentSlide = this.validateNewIndex(newIndex);
                this.updateCurrentSlide();
            }
        });

        // set initial slide
        this.updateCurrentSlide();
    },
    template:
`<div class="vue_slider" :style="{ height: startingHeight + 'px' }">
    <slot></slot>
</div>`,
});

Vue.component('slider-control', {
    data() {
        return {
            currentSlide: 0,
            totalSlides: 0
        }
    },
    props: {
        labelBack: { default: '&lt;' },
        labelNext: { default: '&gt;' },
        indicatorType: { default: 'dots' },
        numberIndicatorDivider: { default: '/' },
        showBack: { default: true },
        showIndicators: { default: true },
        showNext: { default: true },
        sliderId: { required: true },
    },
    created() {
        // get total slides from slider
        VueEvent.$on('slider-update-total-slides', (sliderId, newTotal) => {
            if (this.sliderId === sliderId) {
                this.totalSlides = newTotal;
            }
        });
        VueEvent.$on('slider-update-control-index', (sliderId, newIndex) => {
            if (this.sliderId === sliderId) {
                this.currentSlide = newIndex;
            }
        });
    },
    methods: {
        setSlideIndex(newIndex) {
            VueEvent.$emit('slider-set-slide-index', this.sliderId, newIndex);
        }
    },
    template:
`<div class="vue_slider_control">
    <div class="vue_slider_control__back" v-html="labelBack" v-if="showBack" @click="setSlideIndex(currentSlide - 1)"></div>
    <div class="vue_slider_control__indicators" v-if="showIndicators && (indicatorType === 'dots')">
        <div class="vue_slider_control__indicator_dot" :class="{ active: index === currentSlide }" v-for="(item, index) in totalSlides" @click="setSlideIndex(index)">{{ index + 1 }}</div>
    </div>
    <div class="vue_slider_control__indicators" v-else-if="showIndicators && (indicatorType === 'numbers')">
        <span class="vue_slider_control__indicator_number">{{ currentSlide + 1 }}</span>{{ numberIndicatorDivider }}<span class="vue_slider_control__indicator_number">{{ totalSlides }}</span>
    </div>
    <div class="vue_slider_control__next" v-html="labelNext" v-if="showNext" @click="setSlideIndex(currentSlide + 1)"></div>
</div>`,
});

Vue.component('slider-slide', {
    data() {
        return {
            backgroundImageSrc: false,
            currentStatus: 'after'
        }
    },
    props: {
        backgroundImages: false,
        focalPoint: { default: '50% 50%' },
    },
    mounted() {
        if (this.backgroundImages) {
            VueEvent.$on('window-resized', () => {
                let src = '';
                for (let i=0; i<this.backgroundImages.length; i++) {
                    if (this.backgroundImages[i].mq !== undefined) {
                        if (window.matchMedia(this.backgroundImages[i].mq).matches) {
                            src = this.backgroundImages[i].src;
                        }
                    } else {
                        src = this.backgroundImages[i].src;
                    }
                }

                this.backgroundImageSrc = src;
            });
        }
    },
    template:
`<div class="vue_slider__slide" :class="'vue_slider__slide--' + currentStatus" :style="{ 'background-image': (backgroundImageSrc ? 'url(' + backgroundImageSrc + ')' : false), 'background-position': focalPoint }">
    <div>
        <slot></slot>
    </div>
</div>`,
});

// Overlay
vueData['overlayIsVisible'] = false;
vueMethods['showOverlay'] = function(overlayTitle) {
    VueEvent.$emit('show-overlay', overlayTitle);
    this.overlayIsVisible = true;
    g.gaTrack('overlay', 'shown', overlayTitle);
};
Vue.component('overlay', {
    data() {
        return { isActive: false };
    },
    created() {
        VueEvent.$on('show-overlay', (id) => this.isActive = (id === this.overlayId));
    },
    mounted() {
        this.isActive = this.active;
    },
    props: {
        active: { default: false },
        overlayId: { type: String, required: true },
    },
    methods: {
        closeOverlay() {
            this.isActive = false;
            VueEvent.$emit('hide-overlay');
        }
    },
    template: `
    <div class="vue_overlay" v-show="isActive">
        <div class="vue_overlay__mask" @click="closeOverlay"></div>
        <div class="vue_overlay__content">
            <div class="vue_overlay__content__inner" v-if="isActive">
                <slot></slot>
            </div>
            <div class="vue_overlay__content__close icon_close" @click="closeOverlay">Close</div>
        </div>
    </div>
    `,
});

// VUE INSTANCE
new Vue({
    el: '#page',
    data: vueData,
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
if (jsDevMode) {
    console.log('Vue Components');
}