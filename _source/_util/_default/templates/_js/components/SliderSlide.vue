<template>
    <div class="vue_slider__slide" :class="'vue_slider__slide--' + currentStatus" :style="{ 'background-image': ((backgroundImageSrc && sliderLoaded) ? 'url(' + backgroundImageSrc + ')' : false), 'background-position': focalPoint }">
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                backgroundImageSrc: false,
                currentStatus: 'after',
                sliderLoaded: false
            }
        },
        props: {
            backgroundImages: false,
            focalPoint: { default: '50% 50%' },
        },
        methods: {
            updateSlideSrc() {
                if (this.backgroundImages) {
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
                }
            }
        },
        mounted() {
            VueEvent.$on('window-resized', this.updateSlideSrc);
            this.updateSlideSrc();
        }
    }
</script>

<style scoped lang="scss">
    @import "./../../_scss/base/_mixins.scss";

    .vue_slider__slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        transition: transform $anim_duration_slide ease-out;

        &:first-child {
            position: relative;
        }
        &.active {
            color: lighten($color_black_default, 50);
        }

        @at-root #{&}--before {
            transform: translateX(-100%);
        }
        @at-root #{&}--after {
            transform: translateX(100%);
        }
    }
</style>