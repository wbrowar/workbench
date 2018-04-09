<template>
    <div class="c_slider_control">
        <div class="c_slider_control__back" v-html="labelBack" v-if="showBack" @click="setSlideIndex(currentSlide - 1)"></div>
        <div class="c_slider_control__indicators" v-if="showIndicators && (indicatorType === 'dots') && (maxNodes >= totalSlides)">
            <div class="c_slider_control__indicator_dot" :class="{ active: index === currentSlide }" v-for="(item, index) in totalSlides" @click="setSlideIndex(index)">{{ index + 1 }}</div>
        </div>
        <div class="c_slider_control__indicators" v-else-if="showIndicators && (indicatorType === 'numbers') && (maxNodes >= totalSlides)">
            <span class="c_slider_control__indicator_number">{{ currentSlide + 1 }}</span>{{ numberIndicatorDivider }}<span class="c_slider_control__indicator_number">{{ totalSlides }}</span>
        </div>
        <div class="c_slider_control__next" v-html="labelNext" v-if="showNext" @click="setSlideIndex(currentSlide + 1)"></div>
    </div>
</template>

<script>
    export default {
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
            maxNodes: { default: 10 },
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
        }
    }
</script>

<style lang="scss">
    @import "./../../_scss/base/_mixins.scss";

    $_dot_size: 10px;
    .c_slider_control {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        padding: 6px;

        @at-root #{&}__back {
            cursor: pointer;
        }
        @at-root #{&}__indicators {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
        }
        @at-root #{&}__indicator_dot {
            @include hide_text;
            position: relative;
            padding: 4px;
            margin: 0 3px;
            width: $_dot_size;
            height: $_dot_size;
            cursor: pointer;

            &:before {
                content: "";
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                width: $_dot_size;
                height: $_dot_size;
                border: 2px solid lighten($color_black_default, 50);
                border-radius: 50%;
                transform: translateX(-50%) translateY(-50%);
            }
            &.active {
                &:before {
                    background-color: lighten($color_black_default, 50);
                }
            }
        }
        @at-root #{&}__next {
            cursor: pointer;
        }
    }
</style>