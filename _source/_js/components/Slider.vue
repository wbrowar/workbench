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
                // this.updateCurrentSlide();
                VueEvent.$emit('slider-set-slide-index', this.sliderId, this.currentSlide);
            },
            onSwipeRight() {
                // stop slider from playing
                clearInterval(this.playInterval);

                this.currentSlide = this.validateNewIndex(this.currentSlide - 1);
                // this.updateCurrentSlide();
                VueEvent.$emit('slider-set-slide-index', this.sliderId, this.currentSlide);
            },
            updateCurrentSlide() {
                const newIndex = this.currentSlide;
                const totalSlides = this.slides.length;
                const lastSlideIndex = this.slides.length - 1;

                // let controllers know which slide is the current slide
                VueEvent.$emit('slider-update-control-index', this.sliderId, newIndex);

                // set each slide to it's inital position
                for(let i=0; i<totalSlides; i++) {
                    this.slides[i].previousStatus = '' + this.slides[i].currentStatus;

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

                mc.on('swipeleft', () => {
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

                    // let other sliders with the same ID know which slide is the current slide
                    VueEvent.$emit('slider-set-slide-index', this.sliderId, this.currentSlide);
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
        },
        watch: {
            slides: function() {
                if (!this.slidesContent) {
                    this.updateTotalSlides();

                    this.updateCurrentSlide();
                }
            }
        }
    }
</script>

<style lang="scss">
    // COLORS
:root {
  --color-white: rgb(255, 255, 255);
  --color-black: rgb(0, 0, 0);
  --color-alert_success: rgb(45, 176, 51);
  --color-alert_error: rgb(176, 25, 22);
  --color-alert_warning: rgb(238, 199, 0);
}

$color_white: var(--color-white);
$color_black: var(--color-black);
$color_alert_success: var(--color-alert_success);
$color_alert_error: var(--color-alert_error);
$color_alert_warning: var(--color-alert_warning);

$color_white_raw: rgb(255, 255, 255);
$color_black_raw: rgb(0, 0, 0);
$color_alert_success_raw: rgb(45, 176, 51);
$color_alert_error_raw: rgb(176, 25, 22);
$color_alert_warning_raw: rgb(238, 199, 0);

    // CSS CUSTOM PROPERTIES
:root {
  --spacing-box: 50px;
  --spacing-text: 30px;
  --max-width: 1100px;
  --max-width-text: 700px;
}

// SITE VARIABLES
// ANIMATIONS
$anim_duration_default: 0.3s;
$anim_duration_fade: $anim_duration_default;
$anim_duration_slide: $anim_duration_default;

// LAYOUT
$grid_gap_default: 20px;
$spacing_box: var(--spacing-box);
$spacing_text: var(--spacing-text);
$max_width: var(--max-width);
$max_width_text: var(--max-width-text);

// MEDIA QUERIES
$mq_grid_start: 700px;

// SITE MIXINS
// BOX
// Default modifiers that affect spacing and layout of box elements
@mixin box_modifiers($self: &) {
  @at-root #{$self}--center {
    text-align: center;
  }
  @at-root #{$self}--margin {
    margin-top: $spacing_text;
    margin-bottom: $spacing_text;

    @at-root #{&}--auto {
      margin-right: auto;
      margin-left: auto;
    }
    @at-root #{&}--top {
      margin-top: $spacing_text;
    }
    @at-root #{&}--right {
      margin-right: $spacing_text;
    }
    @at-root #{&}--bottom {
      margin-bottom: $spacing_text;
    }
    @at-root #{&}--left {
      margin-left: $spacing_text;
    }
  }
  @at-root #{$self}--padding {
    padding-top: $spacing_text;
    padding-bottom: $spacing_text;

    @at-root #{&}--top {
      padding-top: $spacing_text;
    }
    @at-root #{&}--right {
      padding-right: $spacing_text;
    }
    @at-root #{&}--bottom {
      padding-bottom: $spacing_text;
    }
    @at-root #{&}--left {
      padding-left: $spacing_text;
    }
  }
}

// FONTS
// For the font() mixin, see _source/automated/_fonts
// If this file is empty, run `gulp first` to populate it

// Set scalable font size (in vw units) and set fallback
// @include fz(7, 5rem, 700px);
// $font_vw_unit = value for vw unit
// $font_fallback_size = fallback size used if vw units are not supported by the browser
// $font_fallback_mq = at this width, the texrt will stop scaling up
@mixin fz($font_vw_unit, $font_fallback_size: '', $font_fallback_mq: '') {
  @if $font_fallback_size != '' {
    font-size: $font_fallback_size;
  }
  font-size: $font_vw_unit + vw;

  @if $font_fallback_mq != '' {
    @include mq($font_fallback_mq) {
      font-size: $font_fallback_size;
    }
  }
}

// LAYOUT
// Centers three divs with a background, middle, and foreground layers
@mixin layout_centered_image_text {
  position: relative;

  @at-root #{&}__background, #{&}__middle, #{&}__foreground, #{&}__url_mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  @at-root #{&}__background {
    z-index: 1;
  }
  @at-root #{&}__middle {
    z-index: 2;
  }
  @at-root #{&}__foreground {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
  }
  @at-root #{&}__url_mask {
    z-index: 4;
  }
}

// MARKETO
// Remove Marketo's default styles on embedded forms
@mixin marketo_reset {
  &.mktoForm {
    padding: 0 !important;
    width: 100% !important;

    div {
      float: none !important;
      min-height: 0 !important;
    }
    .mktoFormCol {
      margin: 0 !important;
      padding: 0 !important;
    }
    .mktoFormRow {
      margin-bottom: 14px;
    }
    .mktoOffset, .mktoGutter, .mktoClear {
      display: none !important;
    }
    .mktoTextField, .mktoTelField, .mktoEmailField, textarea, select {
      float: none !important;
      width: 100% !important;
      box-sizing: border-box;
    }
    .mktoButtonWrap {
      margin-left: 0 !important;
    }
    .mktoLabel {
      display: block !important;
      float: none !important;
      width: 100% !important;
    }
    .mktoAsterix {
      display: none !important;
    }
  }
}

// MEDIA QUERIES
// Quickly write simple media queries
// @include mq(600px) {  }
@mixin _mq_handler($mq_min_max, $mq_direction, $breakpoint, $additional_media: '') {
  @if $additional_media != '' {
    @media (#{$mq_min_max}-#{$mq_direction}: $breakpoint, $additional_media) {
      @content;
    }
  } @else {
    @media (#{$mq_min_max}-#{$mq_direction}: $breakpoint) {
      @content;
    }
  }
}

@mixin mq($breakpoint, $additional_media: '') {
  @include _mq_handler('min', 'width', $breakpoint, $additional_media) {
    @content;
  }
}

@mixin mq_max($breakpoint, $additional_media: '') {
  @include _mq_handler('max', 'width', ($breakpoint - 1px), $additional_media) {
    @content;
  }
}

@mixin mq_v($breakpoint, $additional_media: '') {
  @include _mq_handler('min', 'height', $breakpoint, $additional_media) {
    @content;
  }
}

@mixin mq_vmax($breakpoint, $additional_media: '') {
  @include _mq_handler('max', 'height', ($breakpoint - 1px), $additional_media) {
    @content;
  }
}

@mixin bg_2x {
  @media only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min-resolution: 192dpi) {
    @content;
  }
}

// PLACEHOLDER
// Style placeholder
@mixin placeholder {
  ::-webkit-input-placeholder {
    @content;
  }
  :-moz-placeholder {
    @content;
  }
  ::-moz-placeholder {
    @content;
  }
}

// SVG
// Turn SVG fill to color
@mixin svg_color($color: $color_white, $color_paths: true, $color_polygons: true, $color_rects: true, $color_circles: true) {
  @if $color_paths == true {
    path {
      fill: $color;
    }
  }
  @if $color_polygons == true {
    polygon {
      fill: $color;
    }
  }
  @if $color_rects == true {
    rect {
      fill: $color;
    }
  }
  @if $color_circles == true {
    circle {
      fill: $color;
    }
  }
}

// TEXT
// Default modifiers that affect spacing and layout of text
@mixin text_modifiers($self: &) {
  @at-root #{$self}--center {
    text-align: center;
  }
  @at-root #{$self}--margin {
    margin-top: $spacing_text;
    margin-bottom: $spacing_text;

    @at-root #{&}--auto {
      margin-right: auto;
      margin-left: auto;
    }
    @at-root #{&}--top {
      margin-top: $spacing_text;
    }
    @at-root #{&}--right {
      margin-right: $spacing_text;
    }
    @at-root #{&}--bottom {
      margin-bottom: $spacing_text;
    }
    @at-root #{&}--left {
      margin-left: $spacing_text;
    }
  }
  @at-root #{$self}--padding {
    padding-top: $spacing_text;
    padding-bottom: $spacing_text;

    @at-root #{&}--top {
      padding-top: $spacing_text;
    }
    @at-root #{&}--right {
      padding-right: $spacing_text;
    }
    @at-root #{&}--bottom {
      padding-bottom: $spacing_text;
    }
    @at-root #{&}--left {
      padding-left: $spacing_text;
    }
  }
}
// Hide text for things like buttons or links that are replaced with a background image
@mixin hide_text {
  text-indent: -99999px;
}
// Add ellipsis to a single line of text when the amount of text no longer fits
@mixin truncate {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

    .c_slider {
        $self: &;

        position: relative;
        overflow: hidden;
    }
</style>