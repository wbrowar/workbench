<template>
    <div class="c_slider" :style="{ height: (sliderHeight > 0) ? sliderHeight + 'px' : null }">
        <slider-slide v-for="(slide, index) in slidesData" :key="index" v-if="slidesData">
            <div class="c_slider__slide__content">
                <div v-for="(content, index) in slide" :key="index" v-html="content"></div>
            </div>
        </slider-slide>
        <slot></slot>
    </div>
</template>

<script>
    import { log } from '../global.js';
    import SliderSlide from './SliderSlide.vue';
    import Hammer from 'hammerjs';

    export default {
        components: {
            SliderSlide,
        },
        data() {
            return {
                childrenPerSlide: 1,
                currentSlide: 0,
                dynamicSlideContent: false,
                isLoaded: false,
                playInterval: false,
                layouts: false,
                sliderHeight: false,
                slidesData: false,
                slides: [],
            }
        },
        props: {
            autoResume: false,
            autoHeight: false,
            enableSwipe: { default: true },
            interval: false,
            sliderId: { required: true },
            slidesLayout: false,
            slidesContent: false,
            startingSlide: { default: 0 },
            waitForLoad: false,
        },
        methods: {
            onLoad() {
                for(let i=0; i<this.slides.length; i++) {
                    this.slides[i].sliderLoaded = true;
                }
            },
            onSwipeLeft() {
                // stop slider from playing
                clearInterval(this.playInterval);

                this.currentSlide = this.validateNewIndex(this.currentSlide + 1);
                this.updateCurrentSlide();
            },
            onSwipeRight() {
                // stop slider from playing
                clearInterval(this.playInterval);

                this.currentSlide = this.validateNewIndex(this.currentSlide - 1);
                this.updateCurrentSlide();
            },
            updateCurrentSlide() {
                const newIndex = this.currentSlide;
                const totalSlides = this.slides.length;
                const lastSlideIndex = this.slides.length - 1;

                // let controllers know which slide is the current slide
                VueEvent.$emit('slider-update-control-index', this.sliderId, newIndex);

                // set each slide to it's inital position
                for(let i=0; i<totalSlides; i++) {
                    if (i === newIndex - 1) {
                        this.slides[i].currentStatus = 'prev';
                    } else if (i<newIndex) {
                        this.slides[i].currentStatus = 'before';
                    } else if (i === newIndex) {
                        this.slides[i].currentStatus = 'current';
                    } else if (i === newIndex + 1) {
                        this.slides[i].currentStatus = 'next';
                    } else {
                        this.slides[i].currentStatus = 'after';
                    }
                }

                // override position of the slides when the first or last slide is the current slide
                if (totalSlides > 2) {
                    if (newIndex === 0) {
                        this.slides[lastSlideIndex].currentStatus = 'prev';
                    } else if (newIndex === (lastSlideIndex - 1)) {
                        this.slides[0].currentStatus = 'after';
                    } else if (newIndex === lastSlideIndex) {
                        this.slides[0].currentStatus = 'next';
                        this.slides[1].currentStatus = 'after';
                    }
                }

            },
            updateSlideLayout() {
                if (this.dynamicSlideContent) {
                    const slidesData = JSON.parse(this.slidesContent);
                    const dataLength = slidesData.length;
                    let objectsPerSlide = 1;
                    let newSlides = [];
                    const width = this.$el.clientWidth;

                    // get the slide layouts based on media query
                    for (let i=0; i<this.layouts.length; i++) {
                        if (this.layouts[i].width !== undefined) {
                            if (this.layouts[i].width < width) {
                                objectsPerSlide = this.layouts[i].count;
                            }
                        } else {
                            objectsPerSlide = this.layouts[i].count;
                        }
                    }

                    this.childrenPerSlide = objectsPerSlide;

                    // split content in slidesData into chunks based on layouts
                    for (let i=0; i<dataLength; i += objectsPerSlide) {
                        const myChunk = slidesData.slice(i, i+objectsPerSlide);
                        newSlides.push(myChunk);
                    }

                    // set slidesData to new chunks of slides so template gets updated
                    this.slidesData = newSlides.slice();

                    // update controllers and reset slider to 0
                    this.$nextTick(function() {
                        this.updateSlidesHeight();
                        this.updateTotalSlides();
                        this.currentSlide = 0;
                        this.updateCurrentSlide();
                    });
                }
            },
            updateTotalSlides() {
                VueEvent.$emit('slider-update-total-slides', this.sliderId, this.slides.length);
            },
            updateSlidesHeight() {
                if (this.autoHeight) {
                    let newHeight = 0;

                    for(let i=0; i<this.slides.length; i++) {
                        if (newHeight < this.slides[i].$el.children[0].clientHeight) {
                            newHeight = this.slides[i].$el.children[0].clientHeight;
                        }
                    }

                    this.sliderHeight = newHeight;
                }
            },
            validateNewIndex(newIndex) {
                if (newIndex >= this.slides.length) {
                    return 0;
                } else if (newIndex < 0) {
                    return (this.slides.length - 1);
                } else {
                    return newIndex;
                }
            }
        },
        created() {
        },
        mounted() {
            this.slides = this.$children;

            // check to see if slider can load elements yet
            this.isLoaded = !this.waitForLoad;

            // set current slide to starting slide
            this.currentSlide = this.startingSlide;

            // set the slider height:
            this.sliderHeight = 0;

            // set a default layouts if none are set
            this.layouts = this.slidesLayout !== undefined ? JSON.parse(this.slidesLayout) : [{ count: 2 }];

            // use slidesContent to create slide data
            if (this.slidesContent) {
                // this.slidesData = JSON.parse(this.slidesContent);
                this.dynamicSlideContent = true;
                this.updateSlideLayout();

                // change the amount of elements per slide when slider resizes
                VueEvent.$on('window-resized', () => {
                    this.updateSlideLayout();
                });
            } else {
                // set total slides for controller
                this.updateTotalSlides();

                // set initial slide
                this.updateCurrentSlide();
            }

            // sets swipe functionality
            if (this.enableSwipe) {
                const mc = new Hammer.Manager(this.$el);

                const Swipe = new Hammer.Swipe();

                mc.add(Swipe);

                mc.on('swipeleft', () =>{
                    this.onSwipeLeft();
                });

                mc.on('swiperight', () => {
                    this.onSwipeRight();
                });
            }

            // sets auto play of each slide
            if (this.interval) {
                this.playInterval = setInterval(() => {
                    this.currentSlide = ((this.currentSlide + 1) < this.slides.length) ? this.currentSlide + 1 : 0;
                    this.updateCurrentSlide();
                }, this.interval);
            }

            // set current slide
            VueEvent.$on('slider-set-slide-index', (sliderId, newIndex) => {
                // stop slider from playing
                clearInterval(this.playInterval);

                if (this.sliderId === sliderId) {
                    this.currentSlide = this.validateNewIndex(newIndex);
                    this.updateCurrentSlide();
                }
            });

            if (this.isLoaded) {
                this.onLoad();
            } else {
                VueEvent.$on('slider-loaded', (sliderId) => {
                    if (this.sliderId === sliderId) {
                        this.onLoad();
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    @import "./../../_scss/base/_mixins.scss";

    .c_slider {
        position: relative;
        overflow: hidden;
    }
</style>