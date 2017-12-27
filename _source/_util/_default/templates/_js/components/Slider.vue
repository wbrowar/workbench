<template>
    <div class="vue_slider" :style="{ height: sliderHeight + 'px' }" @swipeleft="onSwipeLeft" @swiperight="onSwipeRight">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentSlide: 0,
                isLoaded: false,
                playInterval: false,
                totalSlides: 0,
                slides: []
            }
        },
        props: {
            sliderId: { required: true },
            interval: false,
            sliderHeight: false,
            startingSlide: { default: 0 },
            waitForLoad: { default: false }
        },
        methods: {
            onLoad() {
                for(let i=0; i<this.slides.length; i++) {
                    this.slides[i].sliderLoaded = true;
                }
            },
            onSwipeLeft() {
                console.log('swipped left');
                this.currentSlide = this.validateNewIndex(this.currentSlide + 1);
                this.updateCurrentSlide();
            },
            onSwipeRight() {
                console.log('swipped right');
                this.currentSlide = this.validateNewIndex(this.currentSlide - 1);
                this.updateCurrentSlide();
            },
            updateCurrentSlide() {
                const newIndex = this.currentSlide;

                VueEvent.$emit('slider-update-control-index', this.sliderId, newIndex);

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
            this.isLoaded = !this.waitForLoad;
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
            VueEvent.$emit('slider-update-total-slides', this.sliderId, this.slides.length);
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

            // set initial slide
            this.updateCurrentSlide();
        }
    }
</script>

<style scoped lang="scss">
    @import "./../../_scss/base/_mixins.scss";

    .vue_slider {
        position: relative;
        overflow: hidden;
        height: 30vw;
    }
</style>